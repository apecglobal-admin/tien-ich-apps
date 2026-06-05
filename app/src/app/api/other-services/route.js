import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.otherServices || { columns: 4, items: [] });
  } catch (error) {
    console.error('GET otherServices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();

    if (body._updateColumns !== undefined) {
      data.otherServices = {
        ...data.otherServices,
        columns: Math.min(5, Math.max(1, body._updateColumns)),
      };
      writeData(data);
      return NextResponse.json({ success: true });
    }

    const newItem = {
      id: generateId('other'),
      name: body.name || '',
      icon: body.icon || '',
      color: body.color || '#f5f5f5',
      iconColor: body.iconColor || '#9e9e9e',
      order: (data.otherServices?.items?.length || 0) + 1,
    };

    data.otherServices = {
      ...data.otherServices,
      items: [...(data.otherServices?.items || []), newItem],
    };
    writeData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST otherServices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = readData();

    data.otherServices = {
      ...data.otherServices,
      items: (data.otherServices?.items || []).map((s) =>
        s.id === body.id ? { ...s, ...body } : s
      ),
    };
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT otherServices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = readData();

    data.otherServices = {
      ...data.otherServices,
      items: (data.otherServices?.items || []).filter((s) => s.id !== id),
    };
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE otherServices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
