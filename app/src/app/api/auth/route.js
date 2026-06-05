import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import crypto from 'crypto';

function createToken(secret) {
  const payload = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

function verifyToken(token, secret) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length < 2) return false;
  const payload = parts.slice(0, -1).join('.');
  const sig = parts[parts.length - 1];
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return sig === expected;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();
    const storedPassword = data.auth?.password || 'admin123';
    const secret = data.auth?.sessionSecret || 'default-secret';

    if (body.action === 'login') {
      if (body.password === storedPassword) {
        const token = createToken(secret);

        // Store active tokens
        if (!data.auth.activeTokens) data.auth.activeTokens = [];
        data.auth.activeTokens.push(token);
        // Keep only last 10 tokens
        if (data.auth.activeTokens.length > 10) {
          data.auth.activeTokens = data.auth.activeTokens.slice(-10);
        }
        writeData(data);

        const response = NextResponse.json({ success: true });
        response.cookies.set('admin_token', token, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
        });
        return response;
      }
      return NextResponse.json({ success: false, error: 'Mật khẩu không đúng' }, { status: 401 });
    }

    if (body.action === 'check') {
      const token = request.cookies.get('admin_token')?.value;
      const isValid = token && verifyToken(token, secret) && (data.auth.activeTokens || []).includes(token);
      return NextResponse.json({ authenticated: !!isValid });
    }

    if (body.action === 'logout') {
      const token = request.cookies.get('admin_token')?.value;
      if (token && data.auth.activeTokens) {
        data.auth.activeTokens = data.auth.activeTokens.filter(t => t !== token);
        writeData(data);
      }
      const response = NextResponse.json({ success: true });
      response.cookies.delete('admin_token');
      return response;
    }

    if (body.action === 'change_password') {
      const token = request.cookies.get('admin_token')?.value;
      const isValid = token && verifyToken(token, secret) && (data.auth.activeTokens || []).includes(token);
      if (!isValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (body.currentPassword !== storedPassword) {
        return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 });
      }
      data.auth.password = body.newPassword;
      writeData(data);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
