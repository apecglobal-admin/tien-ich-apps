'use client';

import { useState, useEffect } from 'react';

export default function SectionManager() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Section form
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    title: '', headerLink: '', columns: 3, showAddButton: false,
    headerLinkType: 'none', headerLinkUrl: '', headerPopupImage: ''
  });

  // Item form
  const [showItemForm, setShowItemForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '', icon: '', color: '#f5f5f5', iconColor: '#9e9e9e',
    linkType: 'none', linkUrl: '', popupImage: '',
  });

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch('/api/sections');
    const data = await res.json();
    setSections(data);
    setLoading(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function toggleExpand(id) {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // ===== SECTION CRUD =====
  function resetSectionForm() {
    setSectionForm({ 
      title: '', headerLink: '', columns: 3, showAddButton: false,
      headerLinkType: 'none', headerLinkUrl: '', headerPopupImage: ''
    });
    setEditSection(null);
    setShowSectionForm(false);
  }

  function startEditSection(section) {
    setSectionForm({
      title: section.title || '', headerLink: section.headerLink || '',
      columns: section.columns || 3, showAddButton: section.showAddButton || false,
      headerLinkType: section.headerLinkType || 'none',
      headerLinkUrl: section.headerLinkUrl || '',
      headerPopupImage: section.headerPopupImage || '',
    });
    setEditSection(section);
    setShowSectionForm(true);
  }

  async function handleSectionSubmit(e) {
    e.preventDefault();

    if (editSection) {
      await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sectionForm, id: editSection.id }),
      });
      showToast('✓ Cập nhật section thành công!');
    } else {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionForm),
      });
      showToast('✓ Tạo section thành công!');
    }

    resetSectionForm();
    fetchData();
  }

  async function handleDeleteSection(id) {
    if (!confirm('Xóa section này sẽ xóa tất cả items bên trong. Tiếp tục?')) return;
    await fetch(`/api/sections?id=${id}`, { method: 'DELETE' });
    showToast('✓ Đã xóa section!');
    fetchData();
  }

  async function updateSectionColumns(sectionId, cols) {
    await fetch('/api/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sectionId, columns: cols }),
    });
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, columns: cols } : s));
    showToast(`✓ Đã đổi thành ${cols} cột!`);
  }

  // ===== ITEM CRUD =====
  function resetItemForm() {
    setItemForm({ name: '', icon: '', color: '#f5f5f5', iconColor: '#9e9e9e', linkType: 'none', linkUrl: '', popupImage: '' });
    setEditItem(null);
    setActiveSection(null);
    setShowItemForm(false);
  }

  function startAddItem(section) {
    setActiveSection(section);
    resetItemFormFields();
    setShowItemForm(true);
  }

  function resetItemFormFields() {
    setItemForm({ name: '', icon: '', color: '#f5f5f5', iconColor: '#9e9e9e', linkType: 'none', linkUrl: '', popupImage: '' });
    setEditItem(null);
  }

  function startEditItem(section, item) {
    setActiveSection(section);
    setItemForm({
      name: item.name, icon: item.icon, color: item.color || '#f5f5f5',
      iconColor: item.iconColor || '#9e9e9e', linkType: item.linkType || 'none',
      linkUrl: item.linkUrl || '', popupImage: item.popupImage || '',
    });
    setEditItem(item);
    setShowItemForm(true);
  }

  async function handleUpload(e, field) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    
    // Support upload for both item form and section form
    if (field === 'headerPopupImage') {
      setSectionForm(prev => ({ ...prev, [field]: json.url }));
    } else {
      setItemForm(prev => ({ ...prev, [field]: json.url }));
    }
  }

  async function handleItemSubmit(e) {
    e.preventDefault();
    if (!itemForm.name || !activeSection) return;

    if (editItem) {
      await fetch('/api/sections/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemForm, id: editItem.id, sectionId: activeSection.id }),
      });
      showToast('✓ Cập nhật thành công!');
    } else {
      await fetch('/api/sections/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemForm, sectionId: activeSection.id }),
      });
      showToast('✓ Thêm thành công!');
    }

    resetItemForm();
    fetchData();
  }

  async function handleDeleteItem(sectionId, itemId) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    await fetch(`/api/sections/items?sectionId=${sectionId}&id=${itemId}`, { method: 'DELETE' });
    showToast('✓ Đã xóa!');
    fetchData();
  }

  if (loading) return <div className="empty-state"><div className="empty-state__text">Đang tải...</div></div>;

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Create Section Button */}
      <div className="admin-section" style={{ marginBottom: 16 }}>
        <div className="admin-section__header" style={{ marginBottom: 0 }}>
          <h2 className="admin-section__title">Quản lý Sections</h2>
          <button className="btn btn-primary" onClick={() => setShowSectionForm(true)}>
            + Tạo Section mới
          </button>
        </div>
      </div>

      {/* Sections List */}
      {sortedSections.length === 0 ? (
        <div className="admin-section">
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <div className="empty-state__text">Chưa có section nào. Tạo section trước, sau đó thêm items.</div>
          </div>
        </div>
      ) : (
        sortedSections.map((section) => {
          const isExpanded = expandedSections[section.id];
          const items = (section.items || []).sort((a, b) => a.order - b.order);

          return (
            <div key={section.id} className="admin-section" style={{ marginBottom: 16 }}>
              {/* Section Header */}
              <div className="admin-section__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleExpand(section.id)}
                    style={{ fontSize: 16, padding: '4px 8px' }}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  <div>
                    <h3 className="admin-section__title" style={{ fontSize: 16 }}>
                      {section.title || '(Không có tiêu đề)'}
                    </h3>
                    <span style={{ fontSize: 11, color: '#71717a' }}>
                      {items.length} items · {section.columns} cột · Thứ tự: {section.order}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Column selector */}
                  <div className="columns-selector">
                    <span className="columns-selector__label">Cột:</span>
                    <div className="columns-selector__btns">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          className={`columns-selector__btn ${section.columns === n ? 'columns-selector__btn--active' : ''}`}
                          onClick={() => updateSectionColumns(section.id, n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => startEditSection(section)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSection(section.id)}>🗑️</button>
                </div>
              </div>

              {/* Expanded content: Items */}
              {isExpanded && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => startAddItem(section)}>
                      + Thêm item
                    </button>
                  </div>

                  {items.length === 0 ? (
                    <div className="empty-state" style={{ padding: 20 }}>
                      <div className="empty-state__text">Chưa có item. Bấm "Thêm item" để bắt đầu.</div>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Icon</th>
                          <th>Tên</th>
                          <th>Hành động</th>
                          <th>Link/Popup</th>
                          <th>TT</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <img src={item.icon} alt={item.name} className="admin-table__icon" style={{ backgroundColor: item.color }} />
                            </td>
                            <td>{item.name}</td>
                            <td>
                              <span style={{
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 4,
                                background: item.linkType === 'url' ? 'rgba(34,197,94,0.15)' : item.linkType === 'popup' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                                color: item.linkType === 'url' ? '#22c55e' : item.linkType === 'popup' ? '#818cf8' : '#71717a',
                              }}>
                                {item.linkType === 'url' ? '🔗 URL' : item.linkType === 'popup' ? '🖼️ Popup' : '—'}
                              </span>
                            </td>
                            <td style={{ fontSize: 11, color: '#71717a', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.linkType === 'url' ? (item.linkUrl || '—') : item.linkType === 'popup' ? (item.popupImage ? '✓ Có ảnh' : '—') : '—'}
                            </td>
                            <td>{item.order}</td>
                            <td>
                              <div className="admin-table__actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => startEditItem(section, item)}>✏️</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(section.id, item.id)}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          );
        })
      )}

      {/* ===== Section Form Modal ===== */}
      {showSectionForm && (
        <div className="modal-overlay" onClick={resetSectionForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{editSection ? '✏️ Sửa Section' : '+ Tạo Section Mới'}</h3>
              <button className="modal__close" onClick={resetSectionForm}>✕</button>
            </div>

            <form onSubmit={handleSectionSubmit} className="admin-form">
              <div className="form-group">
                <label>Tên section (tiêu đề)</label>
                <input type="text" value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} placeholder="VD: Ngân hàng liên kết (để trống nếu không cần)" />
              </div>

              <div className="form-group">
                <label>Link header (Text bên phải tiêu đề)</label>
                <input type="text" value={sectionForm.headerLink} onChange={(e) => setSectionForm({ ...sectionForm, headerLink: e.target.value })} placeholder="VD: Xem tất cả, Quản lý..." />
              </div>

              {sectionForm.headerLink && (
                <>
                  <div className="form-group">
                    <label>Hành động cho Link header</label>
                    <select value={sectionForm.headerLinkType} onChange={(e) => setSectionForm({ ...sectionForm, headerLinkType: e.target.value })}>
                      <option value="none">Không có hành động</option>
                      <option value="url">Mở đường link (URL)</option>
                      <option value="popup">Hiển thị Popup (hình ảnh)</option>
                    </select>
                  </div>

                  {sectionForm.headerLinkType === 'url' && (
                    <div className="form-group">
                      <label>Đường link URL (Header)</label>
                      <input type="text" value={sectionForm.headerLinkUrl} onChange={(e) => setSectionForm({ ...sectionForm, headerLinkUrl: e.target.value })} placeholder="https://example.com" />
                    </div>
                  )}

                  {sectionForm.headerLinkType === 'popup' && (
                    <div className="form-group">
                      <label>Hình ảnh Popup (Header)</label>
                      <div className="file-upload">
                        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'headerPopupImage')} />
                        {sectionForm.headerPopupImage ? (
                          <img src={sectionForm.headerPopupImage} alt="popup preview" className="file-upload__preview" style={{ width: 100, height: 'auto' }} />
                        ) : (
                          <>
                            <div className="file-upload__icon">🖼️</div>
                            <span className="file-upload__text">Upload ảnh popup cho Header</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label>Số cột hiển thị</label>
                <div className="columns-selector" style={{ marginTop: 4 }}>
                  <div className="columns-selector__btns">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`columns-selector__btn ${sectionForm.columns === n ? 'columns-selector__btn--active' : ''}`}
                        onClick={() => setSectionForm({ ...sectionForm, columns: n })}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={sectionForm.showAddButton}
                    onChange={(e) => setSectionForm({ ...sectionForm, showAddButton: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  Hiển thị nút "Thêm" (+) ở cuối
                </label>
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={resetSectionForm}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editSection ? 'Cập nhật' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Item Form Modal ===== */}
      {showItemForm && activeSection && (
        <div className="modal-overlay" onClick={resetItemForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {editItem ? '✏️ Sửa Item' : `+ Thêm item vào "${activeSection.title || 'Section'}"`}
              </h3>
              <button className="modal__close" onClick={resetItemForm}>✕</button>
            </div>

            <form onSubmit={handleItemSubmit} className="admin-form">
              <div className="form-group">
                <label>Tên *</label>
                <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="VD: Chuyển tiền" required />
              </div>

              <div className="form-group">
                <label>Upload Icon</label>
                <div className="file-upload">
                  <input type="file" accept="image/*,.svg" onChange={(e) => handleUpload(e, 'icon')} />
                  {itemForm.icon ? (
                    <img src={itemForm.icon} alt="preview" className="file-upload__preview" />
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
                  <label>Màu nền</label>
                  <input type="color" value={itemForm.color} onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Màu icon</label>
                  <input type="color" value={itemForm.iconColor} onChange={(e) => setItemForm({ ...itemForm, iconColor: e.target.value })} />
                </div>
              </div>

              {/* Link Type */}
              <div className="form-group">
                <label>Hành động khi bấm</label>
                <select value={itemForm.linkType} onChange={(e) => setItemForm({ ...itemForm, linkType: e.target.value })}>
                  <option value="none">Không có hành động</option>
                  <option value="url">Mở đường link (URL)</option>
                  <option value="popup">Hiển thị Popup (hình ảnh)</option>
                </select>
              </div>

              {/* URL input */}
              {itemForm.linkType === 'url' && (
                <div className="form-group">
                  <label>Đường link URL</label>
                  <input type="text" value={itemForm.linkUrl} onChange={(e) => setItemForm({ ...itemForm, linkUrl: e.target.value })} placeholder="https://example.com" />
                </div>
              )}

              {/* Popup image upload */}
              {itemForm.linkType === 'popup' && (
                <div className="form-group">
                  <label>Hình ảnh Popup</label>
                  <div className="file-upload">
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'popupImage')} />
                    {itemForm.popupImage ? (
                      <img src={itemForm.popupImage} alt="popup preview" className="file-upload__preview" style={{ width: 100, height: 'auto' }} />
                    ) : (
                      <>
                        <div className="file-upload__icon">🖼️</div>
                        <span className="file-upload__text">Upload ảnh popup</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={resetItemForm}>Hủy</button>
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
