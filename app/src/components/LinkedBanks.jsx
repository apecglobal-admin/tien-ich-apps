'use client';

export default function LinkedBanks({ data }) {
  const columns = data?.columns || 4;
  const items = data?.items || [];

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
            <div key={bank.id} className="icon-item">
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
