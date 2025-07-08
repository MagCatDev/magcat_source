import { userAgent } from "../consts";

import * as cheerio from "cheerio";
import { BaseEngineApp } from "../app";

class MikanApp extends BaseEngineApp {

  async getMetadata(): Promise<Metadata> {
    return {
      type: "engine",
      category: "acg",
      icon: "https://mikanani.me/images/mikan-pic.png",
      name: "蜜柑计划",
      description: "蜜柑计划：新一代的动漫下载站",
      version: "1.0.0",
      version_code: 1,
      min_app_version_code: 1,
      settings: [
        {
          settings: {
            domain: {
              label: "域名",
              type: "select",
              default: "https://mikanani.me",
              options: [
                {
                  label: "蜜柑计划",
                  value: "https://mikanani.me"
                },
                {
                  label: "蜜柑计划（中国大陆）",
                  value: "https://mikanime.tv"
                }
              ]
            }
          }
        }
      ]
    };
  }

  async search(options: SearchOptions): Promise<SearchResult> {

    const domain = await this.getSetting("domain", options.opts);
    // https://mikanani.me/Home/Search?searchstr=seed
    const query = new URLSearchParams({
      searchstr: options.query || "",
    }).toString();
    const url = `${domain}/Home/Search?${query}`;

    const text = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
      }
    }).then((res) => res.text());

    const $ = cheerio.load(text);
    const items: Item[] = [];

    $("tr.js-search-results-row").each((_, el) => {
      const children = $(el).children("td");

      const links = children.eq(0).children("a");
      const title = links.eq(0).text().trim();
      const link = domain + links.eq(0).attr("href");
      const magnet = links.eq(1).attr("data-clipboard-text");
      const size = children.eq(1).text().trim();
      const date = children.eq(2).text().trim();
      const torrent = domain + children.eq(3).find("a").attr("href");

      items.push({
        title,
        link,
        magnet,
        size,
        date,
        torrent
      });
    });

    return {
      items,
      hasMore: false,
    };
  }
}

const app: EngineApp = new MikanApp();

export default app;