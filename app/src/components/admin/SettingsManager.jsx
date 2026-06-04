'use client';

import { useState, useEffect } from 'react';

export default function SettingsManager() {
  const [settings, setSettings] = useState({ backgroundImage: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    
    setSettings({ ...settings, backgroundImage: json.url });
  }

  async function handleSave() {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    alert('Đã lưu cấu hình!');
  }

  if (loading) return <div>Đang tải cấu hình...</div>;

  return (
    <div className="admin-content animate-in">
      <div className="admin-header-row">
        <h2>Cài đặt chung</h2>
        <button className="btn btn-primary" onClick={handleSave}>💾 Lưu cấu hình</button>
      </div>

      <div className="admin-form" style={{ marginTop: 24, maxWidth: 600 }}>
        <div className="form-group">
          <label>Hình nền ứng dụng (Tỉ lệ khuyến nghị 9:20)</label>
          <div className="file-upload" style={{ minHeight: 200 }}>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {settings.backgroundImage ? (
              <img 
                src={settings.backgroundImage} 
                alt="Background preview" 
                style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8 }} 
              />
            ) : (
              <>
                <div className="file-upload__icon">🖼️</div>
                <span className="file-upload__text">Click để upload hình nền</span>
              </>
            )}
          </div>
          {settings.backgroundImage && (
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: 12 }} 
              onClick={() => setSettings({ ...settings, backgroundImage: '' })}
            >
              Xóa hình nền
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
