import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.bills || { columns: 5, items: [] });
  } catch (error) {
    console.error('GET bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();

    if (body._updateColumns !== undefined) {
      data.bills = {
        ...data.bills,
        columns: Math.min(5, Math.max(1, body._updateColumns)),
      };
      writeData(data);
      return NextResponse.json({ success: true });
    }

    const newItem = {
      id: generateId('bill'),
      name: body.name || '',
      icon: body.icon || '',
      color: body.color || '#f5f5f5',
      iconColor: body.iconColor || '#9e9e9e',
      order: (data.bills?.items?.length || 0) + 1,
    };

    data.bills = {
      ...data.bills,
      items: [...(data.bills?.items || []), newItem],
    };
    writeData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = readData();

    data.bills = {
      ...data.bills,
      items: (data.bills?.items || []).map((b) =>
        b.id === body.id ? { ...b, ...body } : b
      ),
    };
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = readData();

    data.bills = {
      ...data.bills,
      items: (data.bills?.items || []).filter((b) => b.id !== id),
    };
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
