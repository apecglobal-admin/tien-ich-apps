import './globals.css';
import QueryParamsCapture from '@/components/QueryParamsCapture';

export const metadata = {
  title: 'Apec Space',
  description: 'Cổng tiện ích số hỗ trợ chuyển tiền, thanh toán hóa đơn, liên kết ngân hàng và các dịch vụ tài chính hằng ngày.',
  icons: {
    icon: '/favi.png',
    shortcut: '/favi.png',
    apple: '/favi.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <QueryParamsCapture />
        {children}
      </body>
    </html>
  );
}
