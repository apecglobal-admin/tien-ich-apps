'use client';

import { useState, useEffect } from 'react';
import { BANNER_ASPECT_RATIO_OPTIONS, DEFAULT_BANNER_ASPECT_RATIO, normalizeBannerAspectRatio } from '@/lib/bannerUtils.mjs';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    subtitle: '',
    title: '',
    buttonText: '',
    buttonLink: '',
    gradient: 'linear-gradient(135deg, #43b97f 0%, #2d9a6a 40%, #4ec08d 100%)',
    image: '',
    position: 0,
    aspectRatio: DEFAULT_BANNER_ASPECT_RATIO,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [bannersRes, sectionsRes] = await Promise.all([
      fetch('/api/banners'),
      fetch('/api/sections'),
    ]);
    setBanners(await bannersRes.json());
    setSections(await sectionsRes.json());
    setLoading(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function resetForm() {
    setForm({
      subtitle: '', title: '', buttonText: '', buttonLink: '',
      gradient: 'linear-gradient(135deg, #43b97f 0%, #2d9a6a 40%, #4ec08d 100%)',
      image: '', position: 0, aspectRatio: DEFAULT_BANNER_ASPECT_RATIO,
    });
    setEditItem(null);
    setShowForm(false);
  }

  function startEdit(banner) {
    setForm({
      subtitle: banner.subtitle || '', title: banner.title || '',
      buttonText: banner.buttonText || '', buttonLink: banner.buttonLink || '',
      gradient: banner.gradient || '', image: banner.image || '',
      position: banner.position || 0,
      aspectRatio: normalizeBannerAspectRatio(banner.aspectRatio),
    });
    setEditItem(banner);
    setShowForm(true);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.url }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, aspectRatio: normalizeBannerAspectRatio(form.aspectRatio) };

    if (editItem) {
      await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: editItem.id }),
      });
      showToast('✓ Cập nhật banner thành công!');
    } else {
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showToast('✓ Thêm banner thành công!');
    }

    resetForm();
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
    await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
    showToast('✓ Đã xóa banner!');
    fetchData();
  }

  // Build position labels
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  function getPositionLabel(pos) {
    if (pos === 0) return 'Trên cùng (trước section đầu tiên)';
    if (pos <= sortedSections.length) {
      return `Sau section "${sortedSections[pos - 1]?.title || `#${pos}`}"`;
    }
    return `Cuối trang (vị trí ${pos})`;
  }

  if (loading) return <div className="empty-state"><div className="empty-state__text">Đang tải...</div></div>;

  return (
    <>
      <div className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Quản lý Banner</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Thêm Banner
          </button>
        </div>

        {banners.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🖼️</div>
            <div className="empty-state__text">Chưa có banner nào</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Tiêu đề</th>
                <th>Phụ đề</th>
                <th>Vị trí</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td>
                    <div className="banner-preview" style={{ background: banner.gradient || 'linear-gradient(135deg, #43b97f, #2d9a6a)', aspectRatio: normalizeBannerAspectRatio(banner.aspectRatio) }}>
                      <div className="banner-preview__title">{banner.title?.trim() || 'Banner'}</div>
                    </div>
                  </td>
                  <td>{banner.title}</td>
                  <td>{banner.subtitle}</td>
                  <td style={{ fontSize: 12, color: '#a1a1aa' }}>
                    {getPositionLabel(banner.position)}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => startEdit(banner)}>✏️ Sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(banner.id)}>🗑️ Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{editItem ? '✏️ Sửa Banner' : '+ Thêm Banner Mới'}</h3>
              <button className="modal__close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Tiêu đề chính</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: ƯU ĐÃI MỖI NGÀY" />
              </div>

              <div className="form-group">
                <label>Phụ đề</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="VD: Thanh toán dễ dàng" />
              </div>

              <div className="form-group">
                <label>Text nút bấm</label>
                <input type="text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="VD: Khám phá ngay" />
              </div>

              <div className="form-group">
                <label>Link nút bấm</label>
                <input type="text" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} placeholder="https://..." />
              </div>

              <div className="form-group">
                <label>Vị trí hiển thị</label>
                <select value={form.position} onChange={(e) => setForm({ ...form, position: parseInt(e.target.value) })}>
                  <option value={0}>Trên cùng (trước section đầu)</option>
                  {sortedSections.map((s, i) => (
                    <option key={s.id} value={i + 1}>
                      Sau section &quot;{s.title || `Section #${i + 1}`}&quot;
                    </option>
                  ))}
                  <option value={sortedSections.length + 1}>Cuối trang</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tỷ lệ banner</label>
                <select value={form.aspectRatio} onChange={(e) => setForm({ ...form, aspectRatio: e.target.value })}>
                  {BANNER_ASPECT_RATIO_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>CSS Gradient</label>
                <input type="text" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
                <div style={{ height: 32, borderRadius: 8, background: form.gradient, marginTop: 4 }} />
              </div>

              <div className="form-group">
                <label>Hình ảnh (tùy chọn)</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={handleUpload} />
                  {form.image ? (
                    <img src={form.image} alt="preview" className="file-upload__preview" />
                  ) : (
                    <>
                      <div className="file-upload__icon">📁</div>
                      <span className="file-upload__text">Click hoặc kéo thả file</span>
                    </>
                  )}
                </div>
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editItem ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
