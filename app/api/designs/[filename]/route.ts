import { put, list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ filename: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);

    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const blob = blobs.find(b => b.pathname === decodedFilename);
    if (!blob) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const response = await fetch(blob.url);
    const content = await response.text();

    return NextResponse.json({
      success: true,
      content,
      filename: decodedFilename,
    });
  } catch (error) {
    console.error('Get file error:', error);
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

    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);

    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const existingBlob = blobs.find(b => b.pathname === decodedFilename);
    if (!existingBlob) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다' },
        { status: 404 }
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

    const blob = await put(decodedFilename, content, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'text/markdown',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: decodedFilename,
    });
  } catch (error) {
    console.error('Update file error:', error);
    return NextResponse.json(
      { error: '파일 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
