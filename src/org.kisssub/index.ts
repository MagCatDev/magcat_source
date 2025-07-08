import { userAgent } from "../consts";

import * as cheerio from "cheerio";
import { BaseEngineApp } from "../app";

class KisssubApp extends BaseEngineApp {

  async getMetadata(): Promise<Metadata> {
    return {
      type: "engine",
      category: "acg",
      icon: "https://kisssub.org/images/favicon/kisssub.ico",
      name: "爱恋动漫",
      description: "(」・ω・)」唔 -- (/・ω・)/喵---(」・ω・)」唔 --(/・ω・)/ 喵---",
      version: "1.0.0",
      version_code: 1,
      min_app_version_code: 1,
    };
  }

  async search(options: SearchOptions): Promise<SearchResult> {
    let url;
    if (options.opts) {
      url = options.opts.url;
    } else {
      // https://kisssub.org/search.php?keyword=seed&page=2
      const query = new URLSearchParams({
        page: "1",
        keyword: options.query || "",
      }).toString();
      url = `https://kisssub.org/search.php?${query}`;
    }

    const text = await fetch(url, {
      headers: {
        "User-Agent": `${userAgent} Kisssub/1.0.0`,
      }
    }).then((res) => res.text());

    const $ = cheerio.load(text);
    const items: Item[] = [];

    $("#data_list > tr").each((_, el) => {
      const children = $(el).children("td");
      const date = children.eq(0).text().trim();
      const category = children.eq(1).text();
      const linkEl = children.eq(2).find("a");
      const title = linkEl.text().trim();
      const part = linkEl.attr("href")!;
      // https://kisssub.org/show-ab89e0acf9a9a94f7577420b89accb749a9fa1b6.html
      const hash = part.slice(-45, -5);
      const magnet = `magnet:?xt=urn:btih:${hash}`;
      const link = "https://kisssub.org/" + part;
      const size = children.eq(3).text();

      items.push({
        title,
        link,
        date,
        category,
        size,
        magnet,
      });
    });

    let nextPageLink = $("#btm > div.main > div.pages > a.nextprev").attr("href");
    const result: SearchResult = {
      items,
      hasMore: !!nextPageLink,
    };

    if (nextPageLink) {
      nextPageLink = "https://kisssub.org/" + nextPageLink;
      result.next = { url: nextPageLink };
    }

    return result;
  }
}

const app: EngineApp = new KisssubApp();

export default app;