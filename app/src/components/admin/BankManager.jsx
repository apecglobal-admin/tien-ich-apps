'use client';

import { useState, useEffect } from 'react';

export default function BankManager() {
  const [data, setData] = useState({ columns: 4, items: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', icon: '' });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch('/api/banks');
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function resetForm() {
    setForm({ name: '', icon: '' });
    setEditItem(null);
    setShowForm(false);
  }

  function startEdit(item) {
    setForm({ name: item.name, icon: item.icon });
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
    await fetch('/api/banks', {
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
      await fetch('/api/banks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editItem.id }),
      });
      showToast('✓ Cập nhật thành công!');
    } else {
      await fetch('/api/banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      showToast('✓ Thêm ngân hàng thành công!');
    }

    resetForm();
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    await fetch(`/api/banks?id=${id}`, { method: 'DELETE' });
    showToast('✓ Đã xóa!');
    fetchData();
  }

  if (loading) return <div className="empty-state"><div className="empty-state__text">Đang tải...</div></div>;

  return (
    <>
      <div className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Quản lý Ngân hàng liên kết</h2>
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
            <div className="empty-state__icon">🏦</div>
            <div className="empty-state__text">Chưa có ngân hàng nào</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Tên</th>
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
                      <img src={item.icon} alt={item.name} className="admin-table__icon" />
                    </td>
                    <td>{item.name}</td>
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
              <h3 className="modal__title">{editItem ? '✏️ Sửa Ngân hàng' : '+ Thêm Ngân hàng'}</h3>
              <button className="modal__close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Tên ngân hàng *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Vietcombank" required />
              </div>

              <div className="form-group">
                <label>Upload Logo</label>
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
