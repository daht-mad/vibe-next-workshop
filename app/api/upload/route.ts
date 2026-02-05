import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

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

    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: '.md 파일만 업로드 가능합니다' },
        { status: 400 }
      );
    }

    if (file.type !== 'text/markdown' && file.type !== 'text/plain' && file.type !== '') {
      return NextResponse.json(
        { error: '.md 파일만 업로드 가능합니다' },
        { status: 400 }
      );
    }

    const now = new Date();
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '');
    const newFilename = `설계서_${session.nickname}_${yymmdd}.md`;

    const blob = await put(newFilename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: newFilename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
