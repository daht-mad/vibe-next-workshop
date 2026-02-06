"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContentNode } from "@/lib/content";

interface SidebarProps {
  tree: ContentNode[];
}

function TreeNode({ node, depth = 0 }: { node: ContentNode; depth?: number }) {
  const pathname = usePathname();
  const folderPath = `/docs/${node.path.split("/").map((s) => encodeURIComponent(s)).join("/")}`;
  const isCurrentPathInFolder = pathname.startsWith(folderPath);
  const [isOpen, setIsOpen] = useState(isCurrentPathInFolder);

  const isFolder = node.type === "folder";
  const pathWithoutExt = node.path.replace(/\.(md|pdf)$/, "");
  const href = `/docs/${pathWithoutExt.split("/").map((s) => encodeURIComponent(s)).join("/")}`;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const paddingLeft = `${depth * 1.25 + 0.75}rem`;

  if (isFolder) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-folder={node.name}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          style={{ paddingLeft }}
        >
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {isOpen ? "▼" : "▶"}
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {node.name}
          </span>
        </button>
        {isOpen && node.children && (
          <div className="mt-0.5">
            {node.children.map((child) => (
              <TreeNode key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const displayName = node.name.replace(/\.(md|pdf)$/, "");
  const isPdf = node.extension === ".pdf";

  return (
    <Link
      href={href}
      className={`
        block px-3 py-1.5 text-sm rounded-md transition-colors
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
      style={{ paddingLeft }}
    >
      <span className="flex items-center gap-2">
        {isPdf && <span className="text-xs text-gray-400">📄</span>}
        {displayName}
      </span>
    </Link>
  );
}

export function Sidebar({ tree }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      data-testid="sidebar"
      className="w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto"
    >
      <div className="p-4">
        <Link href="/docs" className="block mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            워크샵 문서
          </h1>
        </Link>
        
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800 space-y-1">
          <Link
            href="/upload"
            className={`
              block px-3 py-2 text-sm rounded-md transition-colors font-medium
              ${
                pathname === '/upload'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">📝</span>
              설계서 업로드
            </span>
          </Link>
          <Link
            href="/designs"
            className={`
              block px-3 py-2 text-sm rounded-md transition-colors font-medium
              ${
                pathname === '/designs' || pathname.startsWith('/designs/')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">📋</span>
              설계서 목록
            </span>
          </Link>
        </div>

        <nav className="space-y-0.5">
          {tree.map((node) => (
            <TreeNode key={node.path} node={node} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
