import { put, list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { getDocBySlug, getDocContent } from '@/lib/content';

interface RouteContext {
  params: Promise<{ slug: string[] }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;
    const decodedSlug = slug.map(s => decodeURIComponent(s));
    const blobPathname = `docs/${decodedSlug.join('/')}.md`;

    try {
      const { blobs } = await list({
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const blob = blobs.find(b => b.pathname === blobPathname);
      if (blob) {
        const response = await fetch(blob.url);
        const content = await response.text();
        return NextResponse.json({
          success: true,
          content,
          source: 'blob',
        });
      }
    } catch {
      // Blob 조회 실패 시 로컬 파일로 폴백
    }

    const { filePath, exists, isPdf } = getDocBySlug(decodedSlug);
    if (!exists) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (isPdf) {
      return NextResponse.json(
        { error: 'PDF 파일은 편집할 수 없습니다' },
        { status: 400 }
      );
    }

    const content = getDocContent(filePath);
    return NextResponse.json({
      success: true,
      content,
      source: 'local',
    });
  } catch (error) {
    console.error('Get doc error:', error);
    return NextResponse.json(
      { error: '파일 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const decodedSlug = slug.map(s => decodeURIComponent(s));
    const blobPathname = `docs/${decodedSlug.join('/')}.md`;

    // 원본 파일 존재 확인
    const { exists, isPdf } = getDocBySlug(decodedSlug);
    if (!exists) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (isPdf) {
      return NextResponse.json(
        { error: 'PDF 파일은 편집할 수 없습니다' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '유효하지 않은 내용입니다' },
        { status: 400 }
      );
    }

    // Blob에 저장 (기존 파일 덮어쓰기 허용)
    const blob = await put(blobPathname, content, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'text/markdown',
      allowOverwrite: true,
    });

    revalidatePath(`/docs/${decodedSlug.join('/')}`);

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blobPathname,
    });
  } catch (error) {
    console.error('Update doc error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: '파일 수정 중 오류가 발생했습니다', details: errorMessage },
      { status: 500 }
    );
  }
}
