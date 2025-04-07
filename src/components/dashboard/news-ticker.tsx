import React, { useEffect, useState, useRef } from "react";

interface Headline {
  title: string;
  link: string;
  date: string;
}

const NewsTicker: React.FC = () => {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        setError(null);
        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        if (data.headlines && Array.isArray(data.headlines)) {
          setHeadlines(data.headlines);
        } else {
          console.warn("Invalid headlines format from API", data);
          setError("Could not load headlines");
        }
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setError("Failed to load campus alerts");
      }
    };

    fetchHeadlines();
    const interval = setInterval(fetchHeadlines, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || headlines.length === 0) return;

    const scrollElement = scrollRef.current;
    const contentWidth = scrollElement.scrollWidth / 2;

    const scroll = () => {
      if (!isPaused && scrollElement) {
        if (scrollElement.scrollLeft >= contentWidth) {
          scrollElement.scrollLeft = 0;
        } else {
          scrollElement.scrollLeft += 1;
        }
      }
    };

    animationRef.current = setInterval(scroll, 30);
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [headlines, isPaused]);

  if (error) {
    return (
      <div className="bg-background border-b border-border py-2 px-4">
        <div className="text-[#ff4b66] text-sm">
          {error} - Check the{" "}
          <a
            href="https://emergency.charlotte.edu"
            className="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Emergency Management website
          </a>{" "}
          for updates
        </div>
      </div>
    );
  }

  if (headlines.length === 0) return null;

  const allHeadlines = [...headlines, ...headlines];

  function isNinerAlert(headline: Headline): boolean {
    const title = headline.title.toLowerCase();
    return (
      title.includes("niner alert") ||
      title.includes("ninernotice") ||
      title.includes("emergency") ||
      title.includes("police activity") ||
      title.includes("lockdown")
    );
  }

  return (
    <div className="bg-background border-b border-border overflow-hidden relative">
      <div className="max-w-full py-2 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 pr-4 z-10 bg-background flex items-center">
            <span className="text-[#ff4b66] font-bold mr-2">LATEST:</span>
          </div>
          <div
            ref={scrollRef}
            className="overflow-hidden whitespace-nowrap flex-1 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="inline-block whitespace-nowrap">
              {allHeadlines.map((headline, index) => (
                <a
                  key={index}
                  href={headline.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block mr-12 ${
                    isNinerAlert(headline)
                      ? "text-[#ff4b66] font-bold"
                      : "text-[#ff4b66]"
                  } hover:text-white transition-colors cursor-pointer`}
                  onClick={(e: React.MouseEvent) => {
                    if (!isPaused) {
                      e.preventDefault();
                    }
                  }}
                >
                  {isNinerAlert(headline) ? "🚨 " : ""}
                  {headline.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
