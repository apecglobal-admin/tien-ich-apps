import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';

// Section items API - manages items within a specific section
export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();
    const sectionId = body.sectionId;

    const section = data.sections?.find((s) => s.id === sectionId);
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const newItem = {
      id: generateId('item'),
      name: body.name || '',
      icon: body.icon || '',
      color: body.color || '#f5f5f5',
      iconColor: body.iconColor || '#9e9e9e',
      linkType: body.linkType || 'none',
      linkUrl: body.linkUrl || '',
      popupImage: body.popupImage || '',
      order: (section.items?.length || 0) + 1,
    };

    section.items = [...(section.items || []), newItem];
    writeData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST section items error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = readData();
    const sectionId = body.sectionId;

    const section = data.sections?.find((s) => s.id === sectionId);
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    section.items = (section.items || []).map((item) =>
      item.id === body.id ? { ...item, ...body, sectionId: undefined } : item
    );
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT section items error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const itemId = searchParams.get('id');
    const data = readData();

    const section = data.sections?.find((s) => s.id === sectionId);
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    section.items = (section.items || []).filter((item) => item.id !== itemId);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE section items error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
