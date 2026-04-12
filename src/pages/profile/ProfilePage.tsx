import { useState } from 'react'
import { useAuth } from '../../contexts/useAuth'

const ACTIVITY_LOG = [
    { id: 'a1', label: 'Complaint CMP-2026-301 updated to In Progress', at: 'Today, 8:20 AM' },
    { id: 'a2', label: 'Feedback submitted for CMP-2026-287', at: 'Yesterday, 8:15 PM' },
    { id: 'a3', label: 'Evidence uploaded to CMP-2026-301', at: 'Yesterday, 3:10 PM' },
    { id: 'a4', label: 'Complaint CMP-2026-254 raised', at: '01 Apr 2026, 2:40 PM' },
]

function ProfilePage() {
    const { user } = useAuth()

    const [phone, setPhone] = useState('+91-98XXXXXX10')
    const [address, setAddress] = useState('Boys Hostel 2, Room 310')
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [whatsappAlerts, setWhatsappAlerts] = useState(false)
    const [smsAlerts, setSmsAlerts] = useState(true)
    const [message, setMessage] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    const handleSavePreferences = () => {
        setMessage('Preferences saved successfully.')
        setTimeout(() => setMessage(''), 3000)
    }

    const handleChangePassword = () => {
        if (!currentPassword) { setPasswordError('Enter your current password.'); return }
        if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return }
        if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return }
        setPasswordError('')
        setPasswordMessage('Password updated successfully.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPasswordMessage(''), 3000)
    }

    const displayRole = (user?.role ?? 'customer').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

    return (
        <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-3xl space-y-5">
                {/* Header */}
                <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
                    <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                        My Profile
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--color-primary))/0.15] text-2xl font-bold text-[rgb(var(--color-primary))]">
                            {(user?.name ?? 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">{user?.name ?? 'Campus User'}</h1>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">{user?.email ?? 'user@gbu.ac.in'}</p>
                            <span className="mt-1 inline-block rounded-full bg-[rgb(var(--color-primary))/0.12] px-2.5 py-0.5 text-[11px] font-semibold text-[rgb(var(--color-primary))]">
                                {displayRole}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Identity cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Account Information</h2>
                        <dl className="mt-4 space-y-3">
                            {[
                                { label: 'Full Name', value: user?.name ?? '—' },
                                { label: 'Email', value: user?.email ?? '—' },
                                { label: 'Department', value: user?.department ?? '—' },
                                { label: 'Role', value: displayRole },
                            ].map((item) => (
                                <div key={item.label}>
                                    <dt className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">{item.label}</dt>
                                    <dd className="mt-0.5 text-sm font-medium text-[rgb(var(--color-text-primary))]">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Service Summary</h2>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {[
                                { label: 'Total Raised', value: '5', color: 'text-[rgb(var(--color-text-primary))]' },
                                { label: 'Open', value: '2', color: 'text-[rgb(var(--color-danger))]' },
                                { label: 'Resolved', value: '2', color: 'text-[rgb(var(--color-success))]' },
                                { label: 'Feedback Given', value: '1', color: 'text-[rgb(var(--color-primary))]' },
                            ].map((s) => (
                                <div key={s.label} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-center">
                                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
                            <p className="font-semibold text-[rgb(var(--color-text-primary))]">What you can do</p>
                            <ul className="mt-2 space-y-1">
                                <li>• Raise and monitor complaints end-to-end</li>
                                <li>• Attach evidence and request reopen</li>
                                <li>• Review billing and submit feedback</li>
                            </ul>
                        </div>
                    </article>
                </div>

                {/* Contact & Notification Preferences */}
                <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Contact & Notification Preferences</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Mobile Number</label>
                            <input
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value); setMessage('') }}
                                className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Hostel / Office Address</label>
                            <input
                                value={address}
                                onChange={(e) => { setAddress(e.target.value); setMessage('') }}
                                className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                            { label: 'Email alerts', checked: emailAlerts, onChange: setEmailAlerts },
                            { label: 'WhatsApp alerts', checked: whatsappAlerts, onChange: setWhatsappAlerts },
                            { label: 'SMS alerts', checked: smsAlerts, onChange: setSmsAlerts },
                        ].map((pref) => (
                            <label key={pref.label} className="flex cursor-pointer items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
                                <span>{pref.label}</span>
                                <input
                                    type="checkbox"
                                    checked={pref.checked}
                                    onChange={(e) => { pref.onChange(e.target.checked); setMessage('') }}
                                    className="h-4 w-4 accent-[rgb(var(--color-primary))]"
                                />
                            </label>
                        ))}
                    </div>
                    {message && <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p>}
                    <button
                        type="button"
                        onClick={handleSavePreferences}
                        className="mt-4 rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                    >
                        Save Preferences
                    </button>
                </article>

                {/* Change Password */}
                <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Change Password</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {[
                            { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword },
                            { label: 'New Password', value: newPassword, onChange: setNewPassword },
                            { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword },
                        ].map((f) => (
                            <div key={f.label}>
                                <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">{f.label}</label>
                                <input
                                    type="password"
                                    value={f.value}
                                    onChange={(e) => { f.onChange(e.target.value); setPasswordError(''); setPasswordMessage('') }}
                                    className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                                />
                            </div>
                        ))}
                    </div>
                    {passwordError && <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-danger))]">{passwordError}</p>}
                    {passwordMessage && <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{passwordMessage}</p>}
                    <button
                        type="button"
                        onClick={handleChangePassword}
                        className="mt-4 rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                    >
                        Update Password
                    </button>
                </article>

                {/* Recent Activity */}
                <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Recent Activity</h2>
                    <ul className="mt-3 space-y-2">
                        {ACTIVITY_LOG.map((entry) => (
                            <li key={entry.id} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2">
                                <p className="text-xs font-medium text-[rgb(var(--color-text-primary))]">{entry.label}</p>
                                <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-secondary))]">{entry.at}</p>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </main>
    )
}

export default ProfilePage
