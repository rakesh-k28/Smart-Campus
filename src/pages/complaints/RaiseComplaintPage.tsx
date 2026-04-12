import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Priority } from '../../components/customerDashboard/types'
import { campusLocations, complaintCategories } from '../../data/sampleData'

const categoryOptions = complaintCategories.map((c) => c.name)

function nowStamp() {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(new Date())
}

function RaiseComplaintPage() {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(categoryOptions[0])
    const [subcategory, setSubcategory] = useState('')
    const [location, setLocation] = useState('')
    const [customLocation, setCustomLocation] = useState('')
    const [priority, setPriority] = useState<Priority>('Medium')
    const [description, setDescription] = useState('')
    const [attachments, setAttachments] = useState<string[]>([])
    const [uploadError, setUploadError] = useState('')
    const [formError, setFormError] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [ticketId, setTicketId] = useState('')

    const selectedCategory = complaintCategories.find((c) => c.name === category)
    const effectiveLocation = location === '__custom__' ? customLocation : location

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const allowed = ['image/jpeg', 'image/png', 'video/mp4']
        const maxSize = 10 * 1024 * 1024
        const accepted: string[] = []
        const rejected: string[] = []
        Array.from(files).forEach((f) => {
            if (allowed.includes(f.type) && f.size <= maxSize) accepted.push(f.name)
            else rejected.push(f.name)
        })
        if (accepted.length) setAttachments((prev) => [...prev, ...accepted])
        setUploadError(rejected.length ? `Rejected: ${rejected.join(', ')} — only JPG, PNG, MP4 ≤ 10MB.` : '')
    }

    const removeAttachment = (name: string) => {
        setAttachments((prev) => prev.filter((a) => a !== name))
    }

    const handleSubmit = () => {
        if (title.trim().length < 8) {
            setFormError('Title must be at least 8 characters.')
            return
        }
        if (effectiveLocation.trim().length < 5) {
            setFormError('Please enter a valid campus location.')
            return
        }
        if (description.trim().length < 20) {
            setFormError('Description must be at least 20 characters.')
            return
        }
        const id = `CMP-2026-${String(Math.floor(400 + Math.random() * 100)).padStart(3, '0')}`
        setTicketId(id)
        setSubmitted(true)
        setFormError('')
    }

    const handleReset = () => {
        setTitle('')
        setCategory(categoryOptions[0])
        setSubcategory('')
        setLocation('')
        setCustomLocation('')
        setPriority('Medium')
        setDescription('')
        setAttachments([])
        setUploadError('')
        setFormError('')
        setSubmitted(false)
        setTicketId('')
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-10 md:px-8">
                <div className="mx-auto max-w-xl">
                    <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(var(--color-success))/0.15] text-2xl">
                            ✓
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-[rgb(var(--color-text-primary))]">Complaint Submitted</h2>
                        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                            Your complaint has been registered. You will receive assignment updates shortly.
                        </p>
                        <div className="mt-5 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-left">
                            <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Ticket ID</p>
                            <p className="mt-1 text-lg font-bold text-[rgb(var(--color-primary))]">{ticketId}</p>
                            <p className="mt-3 text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Submitted At</p>
                            <p className="mt-1 text-sm text-[rgb(var(--color-text-primary))]">{nowStamp()}</p>
                            <p className="mt-3 text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Category</p>
                            <p className="mt-1 text-sm text-[rgb(var(--color-text-primary))]">{category}</p>
                            <p className="mt-3 text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Priority</p>
                            <p className="mt-1 text-sm font-semibold text-[rgb(var(--color-warning))]">{priority}</p>
                        </div>
                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/customer-dashboard-advanced')}
                                className="rounded-xl bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-primary))]"
                            >
                                Raise Another
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-2xl">
                <header className="mb-6">
                    <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                        GBU Campus Services
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))]">Raise a Complaint</h1>
                    <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                        Report a campus issue with location, category, and a clear description for faster resolution.
                    </p>
                </header>

                <div className="space-y-4">
                    {/* Basic Info */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Complaint Details</h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                                    Complaint Title <span className="text-[rgb(var(--color-danger))]">*</span>
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. AC not cooling in Computer Lab A-301"
                                    className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                                    Category <span className="text-[rgb(var(--color-danger))]">*</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); setSubcategory('') }}
                                    className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
                                >
                                    {categoryOptions.map((opt) => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                                    Sub-category
                                </label>
                                <select
                                    value={subcategory}
                                    onChange={(e) => setSubcategory(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
                                >
                                    <option value="">Select sub-category</option>
                                    {selectedCategory?.subcategories.map((s) => <option key={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                                    Campus Location <span className="text-[rgb(var(--color-danger))]">*</span>
                                </label>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
                                >
                                    <option value="">Select location</option>
                                    {campusLocations.map((l) => <option key={l}>{l}</option>)}
                                    <option value="__custom__">Other (specify below)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                                    Priority <span className="text-[rgb(var(--color-danger))]">*</span>
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>

                            {location === '__custom__' && (
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
                                        Specify Location
                                    </label>
                                    <input
                                        value={customLocation}
                                        onChange={(e) => setCustomLocation(e.target.value)}
                                        placeholder="Block, room number, floor, etc."
                                        className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Description */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Description</h2>
                        <textarea
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue clearly — include block, room, time of occurrence, and impact on operations."
                            className="mt-3 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                        />
                        <div className="mt-1 flex items-center justify-between text-[11px] text-[rgb(var(--color-text-secondary))]">
                            <span>Tip: include block, room, and impact for faster assignment.</span>
                            <span>{description.trim().length} chars</span>
                        </div>
                    </section>

                    {/* Evidence Upload */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Attach Evidence</h2>
                        <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Optional — JPG, PNG, MP4 up to 10MB each.</p>
                        <label
                            htmlFor="raise-evidence"
                            className="mt-3 block cursor-pointer rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-5 text-center text-xs text-[rgb(var(--color-text-secondary))] transition hover:border-[rgb(var(--color-primary))/0.5]"
                        >
                            Click to select files
                        </label>
                        <input id="raise-evidence" type="file" multiple accept=".jpg,.jpeg,.png,.mp4" onChange={handleFileChange} className="hidden" />
                        {attachments.length > 0 && (
                            <ul className="mt-3 space-y-1">
                                {attachments.map((name) => (
                                    <li key={name} className="flex items-center justify-between rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-1.5 text-xs">
                                        <span className="text-[rgb(var(--color-text-primary))]">{name}</span>
                                        <button type="button" onClick={() => removeAttachment(name)} className="text-[rgb(var(--color-danger))] hover:opacity-75">✕</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {uploadError && <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{uploadError}</p>}
                    </section>

                    {/* Submit */}
                    {formError && <p className="rounded-xl border border-[rgb(var(--color-danger))/0.3] bg-[rgb(var(--color-danger))/0.08] px-4 py-2.5 text-xs font-semibold text-[rgb(var(--color-danger))]">{formError}</p>}

                    <div className="flex flex-wrap gap-3 pb-6">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="rounded-xl bg-[rgb(var(--color-primary))] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                        >
                            Submit Complaint
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-6 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-primary))]"
                        >
                            Clear Form
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default RaiseComplaintPage
