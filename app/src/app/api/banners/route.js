import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';
import { normalizeBannerAspectRatio } from '@/lib/bannerUtils.mjs';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.banners || []);
}

export async function POST(request) {
  const body = await request.json();
  const data = readData();

  const newBanner = {
    id: generateId('banner'),
    subtitle: body.subtitle || '',
    title: body.title || '',
    buttonText: body.buttonText || '',
    buttonLink: body.buttonLink || '',
    gradient: body.gradient || 'linear-gradient(135deg, #43b97f 0%, #2d9a6a 40%, #4ec08d 100%)',
    image: body.image || '',
    position: body.position !== undefined ? body.position : 0,
    aspectRatio: normalizeBannerAspectRatio(body.aspectRatio),
  };

  data.banners = [...(data.banners || []), newBanner];
  writeData(data);

  return NextResponse.json(newBanner, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const data = readData();

  data.banners = (data.banners || []).map((b) =>
    b.id === body.id ? { ...b, ...body, aspectRatio: normalizeBannerAspectRatio(body.aspectRatio) } : b
  );
  writeData(data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = readData();

  data.banners = (data.banners || []).filter((b) => b.id !== id);
  writeData(data);

  return NextResponse.json({ success: true });
}
