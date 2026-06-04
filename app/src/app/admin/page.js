'use client';

import { useState } from 'react';
import AuthGuard, { useAuth } from '@/components/admin/AuthGuard';
import BannerManager from '@/components/admin/BannerManager';
import SectionManager from '@/components/admin/SectionManager';
import SettingsManager from '@/components/admin/SettingsManager';

const TABS = [
  { key: 'banners', label: '🖼️ Banners' },
  { key: 'sections', label: '📦 Sections' },
  { key: 'settings', label: '⚙️ Cài đặt' },
];

function AdminContent() {
  const [activeTab, setActiveTab] = useState('sections');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [toast, setToast] = useState('');
  const { logout } = useAuth();

  function showToastMessage(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError('Vui lòng nhập đầy đủ');
      return;
    }
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToastMessage('✓ Đổi mật khẩu thành công!');
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '' });
      } else {
        setPasswordError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setPasswordError('Có lỗi xảy ra');
    }
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1 className="admin-header__title">✦ CMS Admin</h1>
        <nav className="admin-header__nav">
          <a href="/" className="admin-header__link" target="_blank">
            ↗ Xem trang chủ
          </a>
          <button className="admin-header__link" onClick={() => setShowPasswordModal(true)} style={{ cursor: 'pointer', color: '#818cf8' }}>
            🔑 Đổi mật khẩu
          </button>
          <button className="admin-header__link" onClick={logout} style={{ cursor: 'pointer' }}>
            🚪 Đăng xuất
          </button>
        </nav>
      </header>

      <div className="admin-container">
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'banners' && <BannerManager />}
        {activeTab === 'sections' && <SectionManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal__header">
              <h3 className="modal__title">🔑 Đổi mật khẩu Admin</h3>
              <button className="modal__close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>

            <form onSubmit={handleChangePassword} className="admin-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword} 
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword} 
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                  required 
                />
              </div>

              {passwordError && <div style={{ color: '#f87171', marginBottom: 16, fontSize: 13 }}>{passwordError}</div>}

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminContent />
    </AuthGuard>
  );
}
