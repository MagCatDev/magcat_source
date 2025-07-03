import app from "../src/me.mikanani";

test("me.mikanani", async () => {
    const res = await app.search({ opts: { domain: "https://mikanani.me" }, query: "seed" });
    console.log(res);
    expect(res).toBeDefined();
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.hasMore).toBeFalsy();
});