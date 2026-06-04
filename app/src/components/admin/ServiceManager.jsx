'use client';

import { useState, useEffect } from 'react';

export default function ServiceManager() {
  const [data, setData] = useState({ columns: 3, items: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    name: '',
    icon: '',
    color: '#f5f5f5',
    iconColor: '#9e9e9e',
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch('/api/services');
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function resetForm() {
    setForm({ name: '', icon: '', color: '#f5f5f5', iconColor: '#9e9e9e' });
    setEditItem(null);
    setShowForm(false);
  }

  function startEdit(item) {
    setForm({ name: item.name, icon: item.icon, color: item.color, iconColor: item.iconColor });
    setEditItem(item);
    setShowForm(true);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    setForm((prev) => ({ ...prev, icon: json.url }));
  }

  async function updateColumns(cols) {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _updateColumns: cols }),
    });
    setData((prev) => ({ ...prev, columns: cols }));
    showToast(`✓ Đã đổi thành ${cols} cột!`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) return;

    if (editItem) {
      await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editItem.id }),
      });
      showToast('✓ Cập nhật thành công!');
    } else {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      showToast('✓ Thêm dịch vụ thành công!');
    }

    resetForm();
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    showToast('✓ Đã xóa!');
    fetchData();
  }

  if (loading) return <div className="empty-state"><div className="empty-state__text">Đang tải...</div></div>;

  return (
    <>
      <div className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Quản lý Dịch vụ</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="columns-selector">
              <span className="columns-selector__label">Số cột:</span>
              <div className="columns-selector__btns">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`columns-selector__btn ${data.columns === n ? 'columns-selector__btn--active' : ''}`}
                    onClick={() => updateColumns(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Thêm
            </button>
          </div>
        </div>

        {data.items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚡</div>
            <div className="empty-state__text">Chưa có dịch vụ nào</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tên</th>
                <th>Màu nền</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.items
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.icon} alt={item.name} className="admin-table__icon" style={{ backgroundColor: item.color }} />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <span className="admin-table__color" style={{ backgroundColor: item.color }} />
                    </td>
                    <td>{item.order}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => startEdit(item)}>✏️ Sửa</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>🗑️ Xóa</button>
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
              <h3 className="modal__title">{editItem ? '✏️ Sửa Dịch vụ' : '+ Thêm Dịch vụ'}</h3>
              <button className="modal__close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Tên dịch vụ *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Chuyển tiền" required />
              </div>

              <div className="form-group">
                <label>Upload Icon</label>
                <div className="file-upload">
                  <input type="file" accept="image/*,.svg" onChange={handleUpload} />
                  {form.icon ? (
                    <img src={form.icon} alt="preview" className="file-upload__preview" />
                  ) : (
                    <>
                      <div className="file-upload__icon">📁</div>
                      <span className="file-upload__text">Click hoặc kéo thả file</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Màu nền icon</label>
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Màu icon</label>
                  <input type="color" value={form.iconColor} onChange={(e) => setForm({ ...form, iconColor: e.target.value })} />
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
