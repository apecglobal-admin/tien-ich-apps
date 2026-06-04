'use client';

import { useState } from 'react';

export default function IconPopup({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <img src={image} alt="Popup" className="popup-image" />
      </div>
    </div>
  );
}
