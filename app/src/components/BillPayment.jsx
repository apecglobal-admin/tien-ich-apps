'use client';

export default function BillPayment({ data }) {
  const columns = data?.columns || 5;
  const items = data?.items || [];

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
            <div key={bill.id} className="icon-item">
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
