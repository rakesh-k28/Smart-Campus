import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { priorityBadgeClasses, statusBadgeClasses } from '../../components/customerDashboard/types'
import type { Complaint, Priority } from '../../components/customerDashboard/types'

const SAMPLE_COMPLAINTS: Complaint[] = [
    {
        id: 'CMP-2026-301',
        title: 'AC not cooling in Computer Lab A-301',
        category: 'Electrical',
        location: 'School of Engineering Block A, Room 301',
        priority: 'High',
        status: 'In Progress',
        description: 'Room temperature remains high during practical session hours and affects system performance.',
        createdAt: '09 Apr 2026, 10:10 AM',
        updatedAt: 'Today, 8:20 AM',
        updatedAtIso: '2026-04-12T08:20:00+05:30',
        assignedTeam: 'Electrical Response Team',
        invoiceStatus: 'Pending',
        evidence: ['lab-ac-panel.jpg'],
        timeline: [
            { id: 't1', label: 'Complaint submitted', when: '09 Apr 2026, 10:10 AM' },
            { id: 't2', label: 'Assigned to Electrical Response Team', when: '09 Apr 2026, 11:00 AM' },
            { id: 't3', label: 'On-site visit started', when: '10 Apr 2026, 9:15 AM' },
        ],
    },
    {
        id: 'CMP-2026-287',
        title: 'Water leakage in Boys Hostel 2 washroom',
        category: 'Plumbing',
        location: 'Boys Hostel 2, Room 310',
        priority: 'Medium',
        status: 'Resolved',
        description: 'Continuous water leakage from tap and drainage, causing water logging.',
        createdAt: '03 Apr 2026, 4:05 PM',
        updatedAt: 'Yesterday, 6:30 PM',
        updatedAtIso: '2026-04-11T18:30:00+05:30',
        assignedTeam: 'Plumbing Duty Team',
        invoiceStatus: 'Partially Paid',
        evidence: ['hostel-washroom-before.png', 'hostel-washroom-after.png'],
        timeline: [
            { id: 't4', label: 'Complaint submitted', when: '03 Apr 2026, 4:05 PM' },
            { id: 't5', label: 'Assigned to Plumbing Duty Team', when: '03 Apr 2026, 5:10 PM' },
            { id: 't6', label: 'Issue resolved', when: '11 Apr 2026, 6:30 PM' },
        ],
    },
    {
        id: 'CMP-2026-254',
        title: 'WiFi dead zone in Central Library reading hall',
        category: 'IT/Network',
        location: 'Central Library - Reading Hall',
        priority: 'Critical',
        status: 'Open',
        description: 'Frequent disconnections in the east wing during peak study hours.',
        createdAt: '01 Apr 2026, 2:40 PM',
        updatedAt: 'Today, 7:45 AM',
        updatedAtIso: '2026-04-12T07:45:00+05:30',
        assignedTeam: 'Pending Assignment',
        invoiceStatus: 'Not Generated',
        evidence: [],
        timeline: [{ id: 't7', label: 'Complaint submitted', when: '01 Apr 2026, 2:40 PM' }],
    },
]

const STATUS_STEPS = ['Open', 'Assigned', 'In Progress', 'Resolved'] as const

function getStepIndex(status: string) {
    const idx = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number])
    return idx === -1 ? (status === 'Reopened' ? 1 : 0) : idx
}

function ComplaintTrackingPage() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const initialId = params.get('id') ?? SAMPLE_COMPLAINTS[0].id

    const [selectedId, setSelectedId] = useState(initialId)
    const [uploadError, setUploadError] = useState('')
    const [uploadMessage, setUploadMessage] = useState('')
    const [complaints, setComplaints] = useState<Complaint[]>(SAMPLE_COMPLAINTS)

    const complaint = useMemo(() => complaints.find((c) => c.id === selectedId) ?? null, [complaints, selectedId])
    const stepIndex = complaint ? getStepIndex(complaint.status) : 0

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!complaint || !e.target.files) return
        const allowed = ['image/jpeg', 'image/png', 'video/mp4']
        const max = 10 * 1024 * 1024
        const accepted: string[] = []
        const rejected: string[] = []
        Array.from(e.target.files).forEach((f) => {
            if (allowed.includes(f.type) && f.size <= max) accepted.push(f.name)
            else rejected.push(f.name)
        })
        if (accepted.length) {
            setComplaints((prev) =>
                prev.map((c) =>
                    c.id !== complaint.id ? c : {
                        ...c,
                        evidence: [...c.evidence, ...accepted],
                        timeline: [...c.timeline, { id: crypto.randomUUID(), label: `Evidence uploaded (${accepted.length} file(s))`, when: 'Just now' }],
                    }
                )
            )
            setUploadMessage(`${accepted.length} file(s) attached.`)
            setUploadError('')
        }
        if (rejected.length) setUploadError(`Rejected: ${rejected.join(', ')} — only JPG, PNG, MP4 ≤ 10MB.`)
    }

    const handleReopen = () => {
        if (!complaint || complaint.status !== 'Resolved') return
        setComplaints((prev) =>
            prev.map((c) =>
                c.id !== complaint.id ? c : {
                    ...c,
                    status: 'Reopened',
                    updatedAt: 'Just now',
                    updatedAtIso: new Date().toISOString(),
                    timeline: [...c.timeline, { id: crypto.randomUUID(), label: 'Customer requested reopen', when: 'Just now' }],
                }
            )
        )
    }

    return (
        <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/complaints')}
                            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition hover:text-[rgb(var(--color-text-primary))]"
                        >
                            ← Back to List
                        </button>
                        <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                            Complaint Tracker
                        </p>
                    </div>
                    <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))]">Track Your Complaint</h1>
                    <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                        Monitor real-time status, timeline, and evidence for your service requests.
                    </p>
                </header>

                <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                    {/* Sidebar: complaint list */}
                    <aside className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Your Complaints</p>
                        {complaints.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setSelectedId(c.id)}
                                className={[
                                    'w-full rounded-2xl border p-3 text-left transition',
                                    selectedId === c.id
                                        ? 'border-[rgb(var(--color-primary))/0.55] bg-[rgb(var(--color-primary))/0.08]'
                                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:border-[rgb(var(--color-primary))/0.35]',
                                ].join(' ')}
                            >
                                <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))]">{c.id}</p>
                                <p className="mt-1 text-xs font-semibold text-[rgb(var(--color-text-primary))] line-clamp-2">{c.title}</p>
                                <div className="mt-2 flex gap-1.5">
                                    <span className={['rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', statusBadgeClasses[c.status]].join(' ')}>
                                        {c.status}
                                    </span>
                                    <span className={['rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', priorityBadgeClasses[c.priority as Priority]].join(' ')}>
                                        {c.priority}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </aside>

                    {/* Main detail panel */}
                    {complaint ? (
                        <div className="space-y-4">
                            {/* Status progress bar */}
                            <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{complaint.id}</p>
                                        <h2 className="mt-1 text-base font-bold text-[rgb(var(--color-text-primary))]">{complaint.title}</h2>
                                        <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{complaint.category} · {complaint.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', priorityBadgeClasses[complaint.priority as Priority]].join(' ')}>
                                            {complaint.priority}
                                        </span>
                                        <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', statusBadgeClasses[complaint.status]].join(' ')}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress steps */}
                                <div className="mt-5">
                                    <div className="flex items-center gap-0">
                                        {STATUS_STEPS.map((step, i) => {
                                            const done = i <= stepIndex
                                            const active = i === stepIndex
                                            return (
                                                <div key={step} className="flex flex-1 items-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className={[
                                                            'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition',
                                                            done
                                                                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] text-white'
                                                                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))]',
                                                            active ? 'ring-2 ring-[rgb(var(--color-primary))/0.3]' : '',
                                                        ].join(' ')}>
                                                            {done ? '✓' : i + 1}
                                                        </div>
                                                        <p className={['mt-1 text-[10px] font-semibold', done ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-secondary))]'].join(' ')}>
                                                            {step}
                                                        </p>
                                                    </div>
                                                    {i < STATUS_STEPS.length - 1 && (
                                                        <div className={['mx-1 mb-4 h-0.5 flex-1', i < stepIndex ? 'bg-[rgb(var(--color-primary))]' : 'bg-[rgb(var(--color-border))]'].join(' ')} />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                                    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                                        <p className="uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Assigned Team</p>
                                        <p className="mt-1 font-semibold text-[rgb(var(--color-text-primary))]">{complaint.assignedTeam}</p>
                                    </div>
                                    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                                        <p className="uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Raised On</p>
                                        <p className="mt-1 font-semibold text-[rgb(var(--color-text-primary))]">{complaint.createdAt}</p>
                                    </div>
                                    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                                        <p className="uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Last Updated</p>
                                        <p className="mt-1 font-semibold text-[rgb(var(--color-text-primary))]">{complaint.updatedAt}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Description */}
                            <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Description</h3>
                                <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">{complaint.description}</p>
                            </section>

                            {/* Timeline */}
                            <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Activity Timeline</h3>
                                <ol className="mt-4 space-y-0">
                                    {complaint.timeline.map((entry, i) => (
                                        <li key={entry.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--color-primary))] mt-1" />
                                                {i < complaint.timeline.length - 1 && (
                                                    <div className="w-px flex-1 bg-[rgb(var(--color-border))] my-1" />
                                                )}
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{entry.label}</p>
                                                <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-secondary))]">{entry.when}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {/* Evidence & Actions */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Evidence</h3>
                                    <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">JPG, PNG, MP4 up to 10MB</p>
                                    <label
                                        htmlFor="track-evidence"
                                        className="mt-3 block cursor-pointer rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-4 text-center text-xs text-[rgb(var(--color-text-secondary))] transition hover:border-[rgb(var(--color-primary))/0.5]"
                                    >
                                        Upload files for {complaint.id}
                                    </label>
                                    <input id="track-evidence" type="file" multiple accept=".jpg,.jpeg,.png,.mp4" onChange={handleFileChange} className="hidden" />
                                    {complaint.evidence.length > 0 ? (
                                        <ul className="mt-3 space-y-1 text-xs text-[rgb(var(--color-text-secondary))]">
                                            {complaint.evidence.map((e) => <li key={e}>• {e}</li>)}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-xs text-[rgb(var(--color-text-secondary))]">No evidence uploaded yet.</p>
                                    )}
                                    {uploadError && <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{uploadError}</p>}
                                    {uploadMessage && <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{uploadMessage}</p>}
                                </section>

                                <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Actions</h3>
                                    <div className="mt-3 space-y-3">
                                        <div>
                                            <p className="text-xs text-[rgb(var(--color-text-secondary))]">Request reopen if service quality is unsatisfactory after closure.</p>
                                            <button
                                                type="button"
                                                onClick={handleReopen}
                                                disabled={complaint.status !== 'Resolved'}
                                                className="mt-2 rounded-lg bg-[rgb(var(--color-danger))] px-3 py-2 text-xs font-semibold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                                            >
                                                Request Reopen
                                            </button>
                                        </div>
                                        <div className="border-t border-[rgb(var(--color-border))] pt-3">
                                            <p className="text-xs text-[rgb(var(--color-text-secondary))]">Leave feedback once your complaint is resolved.</p>
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/complaints/feedback?id=${complaint.id}`)}
                                                disabled={complaint.status !== 'Resolved'}
                                                className="mt-2 rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white transition enabled:hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-45"
                                            >
                                                Submit Feedback
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-10 text-center">
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Select a complaint from the list to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default ComplaintTrackingPage
