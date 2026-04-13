import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';

const DEFAULT_ICON = '✦';

const MarqueeBanner = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  // Form state
  const [editId, setEditId]     = useState(null);  // null = add mode
  const [text, setText]         = useState('');
  const [icon, setIcon]         = useState(DEFAULT_ICON);
  const [order, setOrder]       = useState(0);
  const [isActive, setIsActive] = useState(true);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/get-marquee-all');
      setItems(res.data.items || []);
    } catch {
      Swal.fire('Error', 'Failed to fetch marquee items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // ── Reset form ───────────────────────────────────────────────────────────
  const resetForm = () => {
    setEditId(null);
    setText('');
    setIcon(DEFAULT_ICON);
    setOrder(0);
    setIsActive(true);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setText(item.text);
    setIcon(item.icon || DEFAULT_ICON);
    setOrder(item.order ?? 0);
    setIsActive(item.isActive !== false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Save (add or update) ─────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!text.trim()) return Swal.fire('Validation', 'Text is required', 'warning');
    setSaving(true);
    try {
      if (editId) {
        await axiosInstance.put(`/update-marquee/${editId}`, { text, icon, isActive, order: Number(order) });
        Swal.fire({ icon: 'success', title: 'Updated!', timer: 1400, showConfirmButton: false });
      } else {
        await axiosInstance.post('/add-marquee', { text, icon, isActive, order: Number(order) });
        Swal.fire({ icon: 'success', title: 'Added!', timer: 1400, showConfirmButton: false });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────
  const handleToggle = async (item) => {
    try {
      await axiosInstance.put(`/update-marquee/${item._id}`, { ...item, isActive: !item.isActive });
      fetchItems();
    } catch {
      Swal.fire('Error', 'Failed to toggle status', 'error');
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this item?', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await axiosInstance.delete(`/delete-marquee/${id}`);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      fetchItems();
    } catch {
      Swal.fire('Error', 'Failed to delete item', 'error');
    }
  };

  return (
    <div className="container-fluid py-4">
      <h4 className="mb-1 fw-bold">Promo Ticker / Marquee</h4>
      <p className="text-muted mb-4" style={{ fontSize: 13 }}>
        Manage the scrolling announcement strip shown below the hero banner on the homepage.
      </p>

      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#1a1a1a', borderRadius: 8, padding: '12px 0',
          marginBottom: 28, overflow: 'hidden', position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex', gap: 48, alignItems: 'center',
            animation: 'marqueePreview 18s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...items.filter(i => i.isActive), ...items.filter(i => i.isActive)].map((item, idx) => (
            <span key={idx} style={{ color: '#f5f5f0', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#b08d6a', fontSize: 16 }}>{item.icon || '✦'}</span>
              {item.text}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marqueePreview {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      <div className="row g-4">
        {/* ── Add / Edit form ──────────────────────────────────────────── */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 fw-semibold">{editId ? '✏️ Edit Item' : '➕ Add New Item'}</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Text <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    placeholder="e.g. Free Shipping on Orders ₹999+"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    maxLength={120}
                  />
                  <div className="form-text">{text.length}/120 characters</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Icon / Separator</label>
                  <input
                    className="form-control"
                    placeholder="e.g. ✦  •  ★  |"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    maxLength={4}
                    style={{ width: 100 }}
                  />
                  <div className="form-text">Decorative symbol shown before the text</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Display Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={order}
                    onChange={e => setOrder(e.target.value)}
                    min={0}
                    style={{ width: 100 }}
                  />
                  <div className="form-text">Lower number = shown first</div>
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActiveCheck"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isActiveCheck" style={{ fontSize: 13 }}>
                      Active (visible on site)
                    </label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={saving}
                    style={{ minWidth: 90 }}
                  >
                    {saving ? 'Saving…' : editId ? 'Update' : 'Add'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Items list ───────────────────────────────────────────────── */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">All Items ({items.length})</h6>
              <span className="badge bg-success">{items.filter(i => i.isActive).length} active</span>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border spinner-border-sm text-secondary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-5 text-muted">No items yet. Add one on the left.</div>
              ) : (
                <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ width: 40, paddingLeft: 16 }}>#</th>
                      <th>Text</th>
                      <th style={{ width: 70 }}>Icon</th>
                      <th style={{ width: 80 }}>Order</th>
                      <th style={{ width: 90 }}>Status</th>
                      <th style={{ width: 100 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item._id} style={{ opacity: item.isActive ? 1 : 0.45 }}>
                        <td style={{ paddingLeft: 16, color: '#94a3b8' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{item.text}</td>
                        <td style={{ fontSize: 18 }}>{item.icon || '✦'}</td>
                        <td>{item.order ?? 0}</td>
                        <td>
                          <span
                            className={`badge ${item.isActive ? 'bg-success' : 'bg-secondary'}`}
                            style={{ cursor: 'pointer', fontSize: 11 }}
                            title="Click to toggle"
                            onClick={() => handleToggle(item)}
                          >
                            {item.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-dark"
                              title="Edit"
                              onClick={() => startEdit(item)}
                              style={{ padding: '2px 8px' }}
                            >
                              <i className="fa-light fa-pen" />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={() => handleDelete(item._id)}
                              style={{ padding: '2px 8px' }}
                            >
                              <i className="fa-light fa-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeBanner;
