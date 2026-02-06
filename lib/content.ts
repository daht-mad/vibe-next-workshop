import fs from "fs";
import path from "path";
import { list } from "@vercel/blob";

export interface ContentNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: ContentNode[];
  extension?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const EXCLUDED_FILES = ["CLAUDE.md"];
const SUPPORTED_EXTENSIONS = [".md", ".pdf"];

function shouldExcludeFile(fileName: string): boolean {
  return EXCLUDED_FILES.includes(fileName);
}

function isSupportedFile(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

function sortFoldersFirstThenIndexFirst(a: ContentNode, b: ContentNode): number {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }
  
  if (a.type === "file") {
    const aIsIndex = a.name.toLowerCase() === "index.md";
    const bIsIndex = b.name.toLowerCase() === "index.md";
    if (aIsIndex && !bIsIndex) return -1;
    if (!aIsIndex && bIsIndex) return 1;
  }
  
  return a.name.localeCompare(b.name, "ko");
}

export function getContentTree(dir: string = CONTENT_DIR): ContentNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: ContentNode[] = [];

  for (const entry of entries) {
    if (shouldExcludeFile(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(CONTENT_DIR, fullPath);

    if (entry.isDirectory()) {
      const children = getContentTree(fullPath);
      nodes.push({
        name: entry.name,
        path: relativePath,
        type: "folder",
        children,
      });
    } else if (entry.isFile() && isSupportedFile(entry.name)) {
      const extension = path.extname(entry.name);
      nodes.push({
        name: entry.name,
        path: relativePath,
        type: "file",
        extension,
      });
    }
  }

  return nodes.sort(sortFoldersFirstThenIndexFirst);
}

function tryFindFile(basePath: string, fileName: string): string | null {
  const fullPath = path.join(basePath, fileName);
  return fs.existsSync(fullPath) ? fullPath : null;
}

export function getDocBySlug(slug: string[]): { filePath: string; exists: boolean; isPdf: boolean } {
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const relativePath = decodedSlug.join("/");
  const basePath = path.join(CONTENT_DIR, relativePath);

  const mdPath = tryFindFile(CONTENT_DIR, `${relativePath}.md`);
  if (mdPath) return { filePath: mdPath, exists: true, isPdf: false };

  const pdfPath = tryFindFile(CONTENT_DIR, `${relativePath}.pdf`);
  if (pdfPath) return { filePath: pdfPath, exists: true, isPdf: true };

  const readmePath = tryFindFile(basePath, "README.md");
  if (readmePath) return { filePath: readmePath, exists: true, isPdf: false };

  const indexPath = tryFindFile(basePath, "index.md");
  if (indexPath) return { filePath: indexPath, exists: true, isPdf: false };

  return { filePath: "", exists: false, isPdf: false };
}

export function getDocContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export interface FlatDoc {
  name: string;
  slug: string;
}

function flattenTree(nodes: ContentNode[], parentPath: string = ""): FlatDoc[] {
  const docs: FlatDoc[] = [];
  
  for (const node of nodes) {
    if (node.type === "file") {
      const nameWithoutExt = node.name.replace(/\.(md|pdf)$/, "");
      const slug = parentPath ? `${parentPath}/${nameWithoutExt}` : nameWithoutExt;
      docs.push({ name: nameWithoutExt, slug });
    } else if (node.type === "folder" && node.children) {
      const folderPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      docs.push(...flattenTree(node.children, folderPath));
    }
  }
  
  return docs;
}

export function getPrevNextDocs(currentSlug: string[]): { prev: FlatDoc | null; next: FlatDoc | null } {
  const tree = getContentTree();
  const allDocs = flattenTree(tree);
  const currentPath = currentSlug.map(s => decodeURIComponent(s)).join("/");
  
  const currentIndex = allDocs.findIndex(doc => doc.slug === currentPath);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
    next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null,
  };
}

export async function getDocContentWithBlob(slug: string[]): Promise<string> {
  const decodedSlug = slug.map(s => decodeURIComponent(s));
  const blobPathname = `docs/${decodedSlug.join('/')}.md`;

  try {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const blob = blobs.find(b => b.pathname === blobPathname);
    if (blob) {
      const response = await fetch(blob.url);
      return await response.text();
    }
  } catch (error) {
    console.error('Blob fetch error:', error);
  }

  const { filePath, exists } = getDocBySlug(decodedSlug);
  if (!exists) {
    throw new Error('Document not found');
  }

  return getDocContent(filePath);
}
