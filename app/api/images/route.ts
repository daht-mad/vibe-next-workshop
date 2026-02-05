import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다' },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다 (png, jpg, jpeg, gif, webp)' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'Blob 토큰이 설정되지 않았습니다. .env.local 파일을 확인하세요.' },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const pathname = `images/${timestamp}_${file.name}`;

    const blob = await put(pathname, file, {
      access: 'public',
      token,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: file.name,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
