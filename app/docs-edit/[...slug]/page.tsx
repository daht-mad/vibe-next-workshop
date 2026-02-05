'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MdxContent';

export default function EditDocPage() {
  const router = useRouter();
  const params = useParams();
  // Next.js App Router에서 params.slug는 이미 디코딩된 상태
  const slug = params.slug as string[];
  const slugKey = slug.join('/');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        const encodedSlug = slug.map(s => encodeURIComponent(s)).join('/');
        const response = await fetch(`/api/docs/${encodedSlug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '파일을 불러올 수 없습니다');
        }

        setContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [slugKey]);

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;

        setUploading(true);
        setError('');

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/images', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || '이미지 업로드 실패');
          }

          const textarea = textareaRef.current;
          if (textarea && data.url) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const markdown = `![이미지](${data.url})`;
            const newContent = content.slice(0, start) + markdown + content.slice(end);
            setContent(newContent);
            
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
              textarea.focus();
            }, 0);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '이미지 업로드 중 오류');
        } finally {
          setUploading(false);
        }
        return;
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const encodedSlug = slug.map(s => encodeURIComponent(s)).join('/');
      const response = await fetch(`/api/docs/${encodedSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '저장에 실패했습니다');
      }

      router.push(`/docs/${slug.join('/')}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const docTitle = slug[slug.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/docs/${slug.join('/')}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              취소
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{docTitle} 편집</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">에디터</label>
              <span className="text-xs text-gray-400">이미지 붙여넣기 지원</span>
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handlePaste}
                className="w-full h-[calc(100vh-200px)] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="마크다운 형식으로 작성하세요..."
              />
              {uploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>이미지 업로드 중...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">미리보기</label>
              <span className="text-xs text-gray-400">실시간 반영</span>
            </div>
            <div className="h-[calc(100vh-200px)] p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-auto">
              <MarkdownRenderer content={content || '*내용을 입력하면 여기에 미리보기가 표시됩니다.*'} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMobilePreview(true)}
        className="lg:hidden fixed bottom-6 right-6 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 z-40"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-medium">미리보기</span>
      </button>

      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">미리보기</h3>
            <button
              onClick={() => setShowMobilePreview(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <MarkdownRenderer content={content || '*내용을 입력하면 여기에 미리보기가 표시됩니다.*'} />
          </div>
        </div>
      )}
    </div>
  );
}
