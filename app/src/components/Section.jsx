'use client';

import { useState } from 'react';
import IconPopup from './IconPopup';
import { useQueryParams } from '@/lib/useQueryParams';

export default function Section({ section }) {
  const [popupImage, setPopupImage] = useState(null);
  const { buildUrl } = useQueryParams();
  const columns = section?.columns || 3;
  const items = (section?.items || []).sort((a, b) => a.order - b.order);

  function handleItemClick(item) {
    if (item.linkType === 'url' && item.linkUrl) {
      const urlWithParams = buildUrl(item.linkUrl);
      window.open(urlWithParams, '_self');
    } else if (item.linkType === 'popup' && item.popupImage) {
      setPopupImage(item.popupImage);
    }
  }

  function handleHeaderClick(e) {
    if (section.headerLinkType === 'none') {
      e.preventDefault();
      return;
    }
    
    if (section.headerLinkType === 'url' && section.headerLinkUrl) {
      e.preventDefault();
      const urlWithParams = buildUrl(section.headerLinkUrl);
      window.open(urlWithParams, '_self');
    } else if (section.headerLinkType === 'popup' && section.headerPopupImage) {
      e.preventDefault();
      setPopupImage(section.headerPopupImage);
    }
  }

  return (
    <>
      <div className="section-card animate-in">
        {/* Header only if title exists */}
        {section.title && (
          <div className="section-header">
            <h3 className="section-header__title">{section.title}</h3>
            {section.headerLink && (
              <a href="#" className="section-header__link" onClick={handleHeaderClick}>
                {section.headerLink}
              </a>
            )}
          </div>
        )}

        <div className={`icon-grid icon-grid--cols-${columns}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`icon-item ${item.linkType && item.linkType !== 'none' ? 'icon-item--clickable' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <div
                className="icon-item__icon icon-item__icon--service"
                style={{ backgroundColor: item.color || '#f5f5f5' }}
              >
                <img src={item.icon} alt={item.name} />
              </div>
              <span className="icon-item__label">{item.name}</span>
            </div>
          ))}

          {/* Add button for bank-like sections */}
          {section.showAddButton && (
            <div className="icon-item">
              <div className="icon-item__icon icon-item__icon--add">+</div>
              <span className="icon-item__label">Thêm</span>
            </div>
          )}
        </div>
      </div>

      {popupImage && (
        <IconPopup image={popupImage} onClose={() => setPopupImage(null)} />
      )}
    </>
  );
}
