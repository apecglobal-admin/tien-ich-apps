import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.banks || { columns: 4, items: [] });
  } catch (error) {
    console.error('GET banks error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();

    if (body._updateColumns !== undefined) {
      data.banks = {
        ...data.banks,
        columns: Math.min(5, Math.max(1, body._updateColumns)),
      };
      writeData(data);
      return NextResponse.json({ success: true });
    }

    const newItem = {
      id: generateId('bank'),
      name: body.name || '',
      icon: body.icon || '',
      order: (data.banks?.items?.length || 0) + 1,
    };

    data.banks = {
      ...data.banks,
      items: [...(data.banks?.items || []), newItem],
    };
    writeData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST banks error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = readData();

    data.banks = {
      ...data.banks,
      items: (data.banks?.items || []).map((b) =>
        b.id === body.id ? { ...b, ...body } : b
      ),
    };
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT banks error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = readData();

    data.banks = {
      ...data.banks,
      items: (data.banks?.items || []).filter((b) => b.id !== id),
    };
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE banks error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
