import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocBySlug, getDocContentWithBlob, getPrevNextDocs } from "@/lib/content";
import PdfViewer from "@/components/PdfViewer";
import MarkdownRenderer from "@/components/MdxContent";
import { TableOfContents } from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const { filePath, exists, isPdf } = getDocBySlug(slug);

  if (!exists) {
    notFound();
  }

  const { prev, next } = getPrevNextDocs(slug);

  if (isPdf) {
    const pdfUrl = `/api/pdf?path=${encodeURIComponent(filePath)}`;
    return (
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <PdfViewer fileUrl={pdfUrl} />
        <DocNavigation prev={prev} next={next} />
      </article>
    );
  }

  const content = await getDocContentWithBlob(slug);

  return (
    <div className="relative w-full max-w-6xl xl:pr-64">
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex justify-end mb-4">
          <Link
            href={`/docs-edit/${slug.join('/')}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            편집
          </Link>
        </div>
        <MarkdownRenderer content={content} />
        <DocNavigation prev={prev} next={next} />
      </article>
      <TableOfContents content={content} />
    </div>
  );
}

function DocNavigation({ prev, next }: { prev: { name: string; slug: string } | null; next: { name: string; slug: string } | null }) {
  if (!prev && !next) return null;
  
  return (
    <nav className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-right">
            <div className="text-xs text-gray-400 dark:text-gray-500">이전</div>
            <div className="font-medium">{prev.name}</div>
          </div>
        </Link>
      ) : <div />}
      
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <div className="text-left">
            <div className="text-xs text-gray-400 dark:text-gray-500">다음</div>
            <div className="font-medium">{next.name}</div>
          </div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : <div />}
    </nav>
  );
}
