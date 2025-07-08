import * as cheerio from "cheerio";
import { userAgent } from "../consts";
import { BaseEngineApp } from "../app";

class AcgRip extends BaseEngineApp {

  async getMetadata(): Promise<Metadata> {
    return {
      type: "engine",
      category: "acg",
      icon: "https://acg.rip/favicon.ico",
      name: "AcgRip",
      description: "ACG Rip is a website that provides a collection of anime and manga torrents.",
      version: "1.0.0",
      version_code: 1,
      min_app_version_code: 1
    };
  }


  async search(options: SearchOptions): Promise<SearchResult> {
    // https://acg.rip/page/1?term=seed
    let url;
    if (options.opts) {
      url = options.opts.url;
    } else {
      url = "https://acg.rip/page/1";
      if (options.query) {
        const s = new URLSearchParams({
          term: options.query
        }).toString();
        url += "?" + s;
      }
    }

    const text = await fetch(url, {
      headers: {
        "User-Agent": userAgent
      }
    }).then((res) => res.text());

    const $ = cheerio.load(text);
    const items: Item[] = [];
    $("div.container > table > tbody > tr").each(function (_, el) {
      const children = $(el).children("td");
      const date = children.eq(0).find("time").text();
      const linkEl = children.eq(1).find("span.title a");
      const title = linkEl.text();
      const link = "https://acg.rip" + linkEl.attr("href");
      const torrent = "https://acg.rip" + children.eq(2).find("a").attr("href");
      const size = children.eq(3).text();

      items.push({
        date,
        title,
        torrent,
        size,
        link,
      });
    });
    let next = $("body > div.container > ul.pagination > li.next > a")?.attr("href");
    const result: SearchResult = {
      items,
      hasMore: !!next,
    };
    if (next) {
      next = "https://acg.rip" + next;
      result.next = {
        url: next,
      };
    }
    return result;
  }

}


const app = new AcgRip();

export default app;

