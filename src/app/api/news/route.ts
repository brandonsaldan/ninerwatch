import { NextResponse } from "next/server";
import Parser from "rss-parser";

interface Headline {
  title: string;
  link: string;
  date: Date;
}

interface CacheData {
  headlines: Headline[];
  lastUpdated: string;
  status?: string;
}

interface MinimalFeed {
  items: {
    title?: string;
    link?: string;
    pubDate?: string;
  }[];
}

let newsCache: {
  data: CacheData | null;
  lastUpdated: number | null;
  expiryTime: number;
} = {
  data: null,
  lastUpdated: null,
  expiryTime: 5 * 60 * 1000,
};

function processHeadlines(headlines: Headline[]): Headline[] {
  const unc_charlotte_sources = headlines.filter(
    (item) =>
      item.link.includes("charlotte.edu") ||
      item.link.includes("ninertimes.com") ||
      item.link.includes("uncc.edu")
  );

  const other_sources = headlines.filter(
    (item) =>
      !item.link.includes("charlotte.edu") &&
      !item.link.includes("ninertimes.com") &&
      !item.link.includes("uncc.edu")
  );

  const prioritize = (item: Headline): number => {
    const title = item.title.toLowerCase();
    if (title.includes("niner alert") || title.includes("ninernotice"))
      return 10;
    if (
      title.includes("police") ||
      title.includes("safety") ||
      title.includes("security")
    )
      return 8;
    if (title.includes("emergency") || title.includes("incident")) return 7;
    if (title.includes("unc charlotte") || title.includes("uncc")) return 5;
    return 0;
  };

  return [...unc_charlotte_sources, ...other_sources]
    .sort((a, b) => {
      const priorityDiff = prioritize(b) - prioritize(a);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 15);
}

export async function GET() {
  try {
    if (
      newsCache.data &&
      newsCache.lastUpdated &&
      Date.now() - newsCache.lastUpdated < newsCache.expiryTime
    ) {
      return NextResponse.json(newsCache.data);
    }

    const parser = new Parser({
      timeout: 5000,
      maxRedirects: 5,
    });

    const headlines: Headline[] = [];

    const fallbackHeadlines: Headline[] = [
      {
        title: "UNC Charlotte campus safety updates available on LiveSafe app",
        link: "https://emergency.charlotte.edu/communications/livesafe-app",
        date: new Date(),
      },
      {
        title: "Check NinerNotices for latest campus safety information",
        link: "https://emergency.charlotte.edu/communications/ninernotice",
        date: new Date(),
      },
      {
        title: "Campus Police Department provides daily security updates",
        link: "https://police.charlotte.edu/police-log/police-log-2025",
        date: new Date(),
      },
    ];

    const feeds = [
      "https://news.google.com/rss/search?q=UNC+Charlotte+campus+safety+police",
      "https://news.google.com/rss/search?q=UNC+Charlotte+security+incident",
      "https://www.ninertimes.com/search/?f=rss",
      "https://inside.charlotte.edu/news-features/feed",
      "https://emergency.charlotte.edu/communications/ninernotice/feed",
    ];

    const feedPromises = feeds.map((feed) =>
      parser.parseURL(feed).catch((err) => {
        console.error(`Error parsing feed ${feed}:`, err);
        return { items: [] } as MinimalFeed;
      })
    );

    const feedResults = await Promise.all(feedPromises);

    const seenTitles = new Set<string>();

    for (const feed of feedResults) {
      if (feed.items && Array.isArray(feed.items)) {
        for (const item of feed.items) {
          if (item.title && !seenTitles.has(item.title)) {
            seenTitles.add(item.title);
            headlines.push({
              title: item.title,
              link: item.link || "#",
              date: new Date(item.pubDate || Date.now()),
            });
          }
        }
      }
    }

    if (headlines.length === 0) {
      console.warn("No headlines found from feeds, using fallback data");
      headlines.push(...fallbackHeadlines);
    }

    const processed_headlines = processHeadlines(headlines);

    const result: CacheData = {
      headlines: processed_headlines,
      lastUpdated: new Date().toISOString(),
    };

    newsCache = {
      data: result,
      lastUpdated: Date.now(),
      expiryTime: 5 * 60 * 1000,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching news:", error);

    if (!newsCache.data) {
      const fallbackData: CacheData = {
        headlines: [
          {
            title:
              "UNC Charlotte campus safety updates available on LiveSafe app",
            link: "https://emergency.charlotte.edu/communications/livesafe-app",
            date: new Date(),
          },
          {
            title: "Check NinerNotices for latest campus safety information",
            link: "https://emergency.charlotte.edu/communications/ninernotice",
            date: new Date(),
          },
          {
            title: "Campus Police Department provides daily security updates",
            link: "https://police.charlotte.edu/police-log/police-log-2025",
            date: new Date(),
          },
        ],
        lastUpdated: new Date().toISOString(),
        status: "Using fallback data due to fetch error",
      };

      return NextResponse.json(fallbackData);
    }

    return NextResponse.json({
      ...newsCache.data,
      status: "Using cached data due to fetch error",
    });
  }
}
