import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import Swal from 'sweetalert2';

const EmailNotifications = () => {
    const [adminEmails, setAdminEmails] = useState([]);
    const [inputEmail, setInputEmail] = useState('');
    const [notifyOnNewOrder, setNotifyOnNewOrder] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [emailError, setEmailError] = useState('');

    // ── Fetch existing settings ──────────────────────────────────────────────
    useEffect(() => {
        axiosInstance.get('/notification-settings')
            .then(res => {
                const s = res.data.settings;
                setAdminEmails(s.adminEmails || []);
                setNotifyOnNewOrder(s.notifyOnNewOrder !== false);
            })
            .catch(() => {
                Swal.fire('Error', 'Could not load notification settings.', 'error');
            })
            .finally(() => setLoading(false));
    }, []);

    // ── Validate email ───────────────────────────────────────────────────────
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ── Add email ────────────────────────────────────────────────────────────
    const handleAddEmail = () => {
        const trimmed = inputEmail.trim().toLowerCase();
        if (!trimmed) return;
        if (!isValidEmail(trimmed)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        if (adminEmails.includes(trimmed)) {
            setEmailError('This email is already added.');
            return;
        }
        setAdminEmails(prev => [...prev, trimmed]);
        setInputEmail('');
        setEmailError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const handleRemoveEmail = (email) => {
        setAdminEmails(prev => prev.filter(e => e !== email));
    };

    // ── Save settings ────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            await axiosInstance.put('/notification-settings', {
                adminEmails,
                notifyOnNewOrder,
            });
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Notification settings updated successfully.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to save settings.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="row g-4">
                <div className="col-12">

                    {/* Page Header */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <i className="fa-light fa-bell" style={{ color: '#fff', fontSize: 20 }}></i>
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold">Email Notification Settings</h4>
                            <p className="mb-0 text-muted" style={{ fontSize: 13 }}>
                                Configure who receives order alerts and what emails customers get.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">

                        {/* ── Admin Notification Emails Card ─────────────────────── */}
                        <div className="col-lg-7">
                            <div className="panel h-100">
                                <div className="panel-header border-bottom pb-3 mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="fa-light fa-envelope-open-text text-primary" style={{ fontSize: 18 }}></i>
                                        <h6 className="mb-0 fw-bold">Admin Notification Emails</h6>
                                    </div>
                                    <p className="text-muted mb-0 mt-1" style={{ fontSize: 13 }}>
                                        These addresses will receive an email whenever a new order is placed.
                                    </p>
                                </div>
                                <div className="panel-body">

                                    {/* Toggle */}
                                    <div className="d-flex align-items-center justify-content-between p-3 mb-4 rounded-3"
                                        style={{ background: 'var(--bs-light, #f8f9fa)', border: '1px solid var(--bs-border-color, #dee2e6)' }}>
                                        <div>
                                            <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>
                                                <i className="fa-light fa-toggle-large-on me-2 text-success"></i>
                                                Notify on New Order
                                            </p>
                                            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                                                Send an alert to all admin emails when a customer places an order.
                                            </p>
                                        </div>
                                        <div className="form-check form-switch mb-0 ms-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="notifySwitch"
                                                checked={notifyOnNewOrder}
                                                onChange={e => setNotifyOnNewOrder(e.target.checked)}
                                                style={{ width: 44, height: 22, cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Add Email Input */}
                                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                        Add Email Address
                                    </label>
                                    <div className="input-group mb-1">
                                        <span className="input-group-text">
                                            <i className="fa-light fa-envelope" style={{ fontSize: 14 }}></i>
                                        </span>
                                        <input
                                            type="email"
                                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                            placeholder="admin@example.com"
                                            value={inputEmail}
                                            onChange={e => { setInputEmail(e.target.value); setEmailError(''); }}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleAddEmail}
                                            style={{ minWidth: 80 }}
                                        >
                                            <i className="fa-light fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                    {emailError && (
                                        <div className="text-danger mb-2" style={{ fontSize: 12 }}>
                                            <i className="fa-light fa-circle-exclamation me-1"></i>{emailError}
                                        </div>
                                    )}
                                    <p className="text-muted mb-4" style={{ fontSize: 12 }}>
                                        Press Enter or click Add. You can add multiple addresses.
                                    </p>

                                    {/* Email Chips */}
                                    {adminEmails.length === 0 ? (
                                        <div className="text-center py-4" style={{
                                            border: '2px dashed var(--bs-border-color, #dee2e6)',
                                            borderRadius: 10
                                        }}>
                                            <i className="fa-light fa-inbox" style={{ fontSize: 28, color: '#ccc' }}></i>
                                            <p className="mb-0 text-muted mt-2" style={{ fontSize: 13 }}>
                                                No notification emails added yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="fw-semibold mb-2" style={{ fontSize: 13 }}>
                                                Notification Recipients ({adminEmails.length})
                                            </p>
                                            <div className="d-flex flex-wrap gap-2">
                                                {adminEmails.map((email) => (
                                                    <div key={email}
                                                        className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                                        style={{
                                                            background: '#eef2ff',
                                                            border: '1px solid #c7d2fe',
                                                            maxWidth: '100%'
                                                        }}>
                                                        <i className="fa-light fa-envelope" style={{ fontSize: 12, color: '#6366f1', flexShrink: 0 }}></i>
                                                        <span style={{ fontSize: 13, color: '#4338ca', wordBreak: 'break-all' }}>{email}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveEmail(email)}
                                                            style={{
                                                                background: 'none', border: 'none', cursor: 'pointer',
                                                                color: '#a5b4fc', padding: 0, lineHeight: 1, flexShrink: 0
                                                            }}
                                                            title="Remove"
                                                        >
                                                            <i className="fa-solid fa-xmark" style={{ fontSize: 11 }}></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Button */}
                                    <div className="mt-4 pt-3 border-top">
                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</>
                                            ) : (
                                                <><i className="fa-light fa-floppy-disk me-2"></i>Save Settings</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Info / Preview Card ───────────────────────────────── */}
                        <div className="col-lg-5">
                            <div className="panel h-100">
                                <div className="panel-header border-bottom pb-3 mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="fa-light fa-circle-info text-info" style={{ fontSize: 18 }}></i>
                                        <h6 className="mb-0 fw-bold">How It Works</h6>
                                    </div>
                                </div>
                                <div className="panel-body">

                                    {[
                                        {
                                            icon: 'fa-cart-shopping',
                                            color: '#6366f1',
                                            bg: '#eef2ff',
                                            title: 'Customer Places Order',
                                            desc: 'When a customer completes checkout, they automatically receive a beautifully formatted order confirmation email.'
                                        },
                                        {
                                            icon: 'fa-bell',
                                            color: '#f59e0b',
                                            bg: '#fffbeb',
                                            title: 'Admin Gets Notified',
                                            desc: 'All email addresses added here will receive a new order alert with full order details, customer info, and item list.'
                                        },
                                        {
                                            icon: 'fa-shield-check',
                                            color: '#22c55e',
                                            bg: '#f0fdf4',
                                            title: 'Always Reliable',
                                            desc: 'Email failures are non-fatal — your orders are always saved even if an email doesn\'t go through.'
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="d-flex gap-3 mb-4">
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                                background: item.bg, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <i className={`fa-light ${item.icon}`} style={{ color: item.color, fontSize: 16 }}></i>
                                            </div>
                                            <div>
                                                <p className="mb-1 fw-semibold" style={{ fontSize: 14 }}>{item.title}</p>
                                                <p className="mb-0 text-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="p-3 rounded-3 mt-2" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                        <p className="mb-1 fw-semibold" style={{ fontSize: 13 }}>
                                            <i className="fa-light fa-lightbulb me-2 text-warning"></i>Tip
                                        </p>
                                        <p className="mb-0 text-muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
                                            Add your team's emails — store manager, support, or finance — so everyone stays in the loop when orders come in.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailNotifications;