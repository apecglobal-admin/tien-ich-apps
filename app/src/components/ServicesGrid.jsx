'use client';

export default function ServicesGrid({ data }) {
  const columns = data?.columns || 3;
  const items = data?.items || [];

  return (
    <div className="section-card animate-in">
      <div className={`icon-grid icon-grid--cols-${columns}`}>
        {items
          .sort((a, b) => a.order - b.order)
          .map((service) => (
            <div key={service.id} className="icon-item">
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
