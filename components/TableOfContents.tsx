"use client";

import { useEffect, useState, useMemo } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const lines = content.split("\n");
    const result: Heading[] = [];
    
    for (const line of lines) {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);
      
      if (h2Match) {
        const text = h2Match[1].trim();
        result.push({ id: slugify(text), text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        result.push({ id: slugify(text), text, level: 3 });
      }
    }
    
    return result;
  }, [content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll("article h2[id], article h3[id]");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-80px 0px -80% 0px",
          threshold: 0,
        }
      );

      headingElements.forEach((heading) => observer.observe(heading));

      return () => {
        headingElements.forEach((heading) => observer.unobserve(heading));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      data-testid="toc"
      className="hidden xl:block fixed right-8 top-28 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto"
    >
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={`
                text-left w-full px-2 py-1 rounded text-[13px] transition-colors
                ${heading.level === 3 ? "pl-4" : ""}
                ${
                  activeId === heading.id
                    ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
