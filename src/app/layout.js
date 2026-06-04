import './globals.css';

export const metadata = {
  title: 'Tiện Ích',
  description: 'Ứng dụng ngân hàng số - Thanh toán, chuyển tiền, tiết kiệm và nhiều dịch vụ tài chính tiện ích khác.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
