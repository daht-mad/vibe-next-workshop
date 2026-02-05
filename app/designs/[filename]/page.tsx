import { list } from '@vercel/blob';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';


interface PageProps {
  params: Promise<{ filename: string }>;
}

async function getFileContent(filename: string): Promise<string | null> {
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const blob = blobs.find(b => b.pathname === filename);
  if (!blob) {
    return null;
  }

  const response = await fetch(blob.url);
  return await response.text();
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

export default async function DesignViewerPage({ params }: PageProps) {
  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  
  const content = await getFileContent(decodedFilename);
  
  if (!content) {
    notFound();
  }

  const htmlContent = await markdownToHtml(content);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/designs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            목록으로 돌아가기
          </Link>

          <Link
            href={`/designs/${encodeURIComponent(decodedFilename)}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            편집
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{decodedFilename}</h1>
          </div>
          
          <div className="px-6 py-8">
            <article 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
