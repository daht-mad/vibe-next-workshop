"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContentNode } from "@/lib/content";

interface SidebarProps {
  tree: ContentNode[];
  isOpen?: boolean;
  onClose?: () => void;
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

export function Sidebar({ tree, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  // 페이지 이동 시 자동으로 drawer 닫기
  useEffect(() => {
    if (onClose && isOpen) {
      onClose();
    }
  }, [pathname]);

  return (
    <>
      {/* 모바일 오버레이 배경 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        data-testid="sidebar"
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:transform-none
          md:h-screen md:sticky md:top-0
          border-r border-gray-200 dark:border-gray-800 
          bg-white dark:bg-gray-950 overflow-y-auto
        `}
      >
        {/* 모바일 drawer 닫기 버튼 */}
        <div className="md:hidden flex justify-end p-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            aria-label="메뉴 닫기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

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
    </>
  );
}
