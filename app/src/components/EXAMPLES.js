/**
 * IMPLEMENTATION EXAMPLES
 * 
 * Các ví dụ dưới đây cho thấy cách thêm query parameters 
 * vào các components khác nhau
 */

// ============================================
// EXAMPLE 1: Update BillPayment.jsx with links
// ============================================
/*
'use client';

import { useQueryParams } from '@/lib/useQueryParams';

export default function BillPayment({ data }) {
  const columns = data?.columns || 5;
  const items = data?.items || [];
  const { buildUrl } = useQueryParams();

  function handleBillClick(bill) {
    if (bill.linkUrl) {
      const urlWithParams = buildUrl(bill.linkUrl);
      window.open(urlWithParams, '_self');
    }
  }

  return (
    <div className="section-card animate-in">
      <div className="section-header">
        <h3 className="section-header__title">Thanh toán hóa đơn</h3>
        <a href="#" className="section-header__link">Xem tất cả</a>
      </div>
      <div className={`icon-grid icon-grid--cols-${columns}`}>
        {items
          .sort((a, b) => a.order - b.order)
          .map((bill) => (
            <div 
              key={bill.id} 
              className="icon-item icon-item--clickable"
              onClick={() => handleBillClick(bill)}
            >
              <div
                className="icon-item__icon icon-item__icon--service"
                style={{ backgroundColor: bill.color || '#f5f5f5' }}
              >
                <img src={bill.icon} alt={bill.name} />
              </div>
              <span className="icon-item__label">{bill.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
*/

// ============================================
// EXAMPLE 2: Update LinkedBanks.jsx with links
// ============================================
/*
'use client';

import { useQueryParams } from '@/lib/useQueryParams';

export default function LinkedBanks({ data }) {
  const columns = data?.columns || 4;
  const items = data?.items || [];
  const { buildUrl } = useQueryParams();

  function handleBankClick(bank) {
    if (bank.linkUrl) {
      const urlWithParams = buildUrl(bank.linkUrl);
      window.open(urlWithParams, '_self');
    }
  }

  return (
    <div className="section-card animate-in">
      <div className="section-header">
        <h3 className="section-header__title">Ngân hàng liên kết</h3>
        <a href="#" className="section-header__link">Quản lý</a>
      </div>
      <div className={`icon-grid icon-grid--cols-${columns}`}>
        {items
          .sort((a, b) => a.order - b.order)
          .map((bank) => (
            <div 
              key={bank.id} 
              className="icon-item icon-item--clickable"
              onClick={() => handleBankClick(bank)}
            >
              <div className="icon-item__icon icon-item__icon--bank">
                <img src={bank.icon} alt={bank.name} />
              </div>
              <span className="icon-item__label">{bank.name}</span>
            </div>
          ))}
        <div className="icon-item">
          <div className="icon-item__icon icon-item__icon--add">+</div>
          <span className="icon-item__label">Thêm</span>
        </div>
      </div>
    </div>
  );
}
*/

// ============================================
// EXAMPLE 3: Update OtherServices.jsx with links
// ============================================
/*
'use client';

import { useQueryParams } from '@/lib/useQueryParams';

export default function OtherServices({ data }) {
  const columns = data?.columns || 4;
  const items = data?.items || [];
  const { buildUrl } = useQueryParams();

  function handleServiceClick(service) {
    if (service.linkUrl) {
      const urlWithParams = buildUrl(service.linkUrl);
      window.open(urlWithParams, '_self');
    }
  }

  return (
    <div className="section-card animate-in">
      <div className="section-header">
        <h3 className="section-header__title">Dịch vụ khác</h3>
        <a href="#" className="section-header__link">Xem tất cả</a>
      </div>
      <div className={`icon-grid icon-grid--cols-${columns}`}>
        {items
          .sort((a, b) => a.order - b.order)
          .map((service) => (
            <div 
              key={service.id} 
              className="icon-item icon-item--clickable"
              onClick={() => handleServiceClick(service)}
            >
              <div
                className="icon-item__icon icon-item__icon--service"
                style={{ backgroundColor: service.color || '#f5f5f5' }}
              >
                <img src={service.icon} alt={service.name} />
              </div>
              <span className="icon-item__label">{service.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
*/

// ============================================
// EXAMPLE 4: Using ParameterizedLink component
// ============================================
/*
import ParameterizedLink from '@/components/ParameterizedLink';

export default function ExternalServiceLink({ url, label }) {
  return (
    <ParameterizedLink 
      href={url}
      className="btn btn-primary"
    >
      {label}
    </ParameterizedLink>
  );
}
*/

// ============================================
// EXAMPLE 5: API Route to forward parameters
// ============================================
/*
// app/api/services/redirect/route.js

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const phone = searchParams.get('phone');
  const zalo_id = searchParams.get('zalo_id');
  const target = searchParams.get('target'); // URL to redirect to

  if (!target) {
    return new Response('Missing target URL', { status: 400 });
  }

  // Build target URL with parameters
  const targetUrl = new URL(target);
  if (code) targetUrl.searchParams.append('code', code);
  if (phone) targetUrl.searchParams.append('phone', phone);
  if (zalo_id) targetUrl.searchParams.append('zalo_id', zalo_id);

  // Redirect
  return Response.redirect(targetUrl.toString());
}
*/

// ============================================
// EXAMPLE 6: Check if parameters exist
// ============================================
/*
'use client';

import { useQueryParams } from '@/lib/useQueryParams';

export default function Component() {
  const { code, phone, zalo_id, isLoading } = useQueryParams();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!code && !phone && !zalo_id) {
    return <div>No parameters found</div>;
  }

  return (
    <div>
      <p>Code: {code}</p>
      <p>Phone: {phone}</p>
      <p>Zalo ID: {zalo_id}</p>
    </div>
  );
}
*/
