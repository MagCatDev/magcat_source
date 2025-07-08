import { rolldown } from "rolldown";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { MetadataSchema } from "../types/schema";


function exec(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`cmd <= ${cmd} ${args.join(" ")}`);
    const child = spawn(cmd, args, { stdio: "pipe" });
    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    child.on("close", (code) => {
      if (code === 0) {
        const s = output.trim();
        if (s) console.log(`cmd => ${s}`);
        resolve(s);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}


type AppManifest = Metadata & {
    id: string;
    entry: string;
}

async function getAppManifest(entry: string): Promise<Metadata> {
  const tpl = `import app from "./${entry}";console.log(JSON.stringify(await app.getMetadata()));`;
  fs.writeFileSync(".tmp", tpl);
  try {
    const res = await exec("tsx", [".tmp"]);
    const m = MetadataSchema.parse(JSON.parse(res));
    return {
      type: m.type,
      category: m.category,
      icon: m.icon,
      name: m.name,
      description: m.description,
      version: m.version,
      version_code: m.version_code,
      min_app_version_code: m.min_app_version_code,
    };
  } finally {
    fs.rmSync(".tmp", { force: true });
  }
}


async function gitPrepare() {
  const shortRef = await exec("git", ["rev-parse", "--short", "HEAD"]);
  const tagName = `${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${shortRef}`;
  await exec("git", ["tag", tagName]);
  await exec("git", ["push", "origin", tagName]);
  return tagName;
}


async function build() {
  const git = await gitPrepare();
  const root = "src";
  const apps = fs.readdirSync(root)
    .map((f) => [f, path.join(root, f)])
    .filter(([, p]) => fs.statSync(p).isDirectory());
  try {
    const mds: AppManifest[] = [];
    for (const [id, dir] of apps) {
      const m = await getAppManifest(dir);
      mds.push({
        ...m,
        id,
        entry: `${id}.js`,
      });
      console.time(id);
      const bundle = await rolldown({
        input: `${dir}/index.ts`,
      });
      await bundle.write({
        format: "esm",
        minify: true,
        polyfillRequire: true,
        file: `dist/${id}.js`,
      });
      console.timeEnd(id);
    }
    const manifest = {
      git,
      apps: mds,
    };
    fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));
    fs.writeFileSync("dist/manifest.min.json", JSON.stringify(manifest));
  } catch (error) {
    console.error("Build failed:", error);
  }
}

console.time("Build Time");
build().catch((error) => {
  console.error("Error during build:", error);
}).finally(() => {
  console.timeEnd("Build Time");
});