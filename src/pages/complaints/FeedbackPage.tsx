import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const RESOLVED_COMPLAINTS = [
    { id: 'CMP-2026-287', title: 'Water leakage in Boys Hostel 2 washroom', resolvedAt: '11 Apr 2026, 6:30 PM' },
    { id: 'CMP-2026-219', title: 'Dustbin not cleaned in Cafeteria Block A', resolvedAt: '22 Mar 2026, 3:00 PM' },
]

const RATING_LABELS: Record<number, string> = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
}

const RATING_COLORS: Record<number, string> = {
    1: 'text-[rgb(var(--color-danger))]',
    2: 'text-[rgb(var(--color-danger))]',
    3: 'text-[rgb(var(--color-warning))]',
    4: 'text-[rgb(var(--color-success))]',
    5: 'text-[rgb(var(--color-success))]',
}

type SubmittedFeedback = {
    complaintId: string
    rating: number
    comment: string
    aspects: string[]
    submittedAt: string
}

const ASPECT_OPTIONS = [
    'Quick response time',
    'Professional technician',
    'Issue fully resolved',
    'Good communication',
    'Clean work area',
    'Needs improvement',
]

function nowStamp() {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date())
}

function FeedbackPage() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const preselectedId = params.get('id') ?? ''

    const [selectedId, setSelectedId] = useState(
        RESOLVED_COMPLAINTS.find((c) => c.id === preselectedId)?.id ?? RESOLVED_COMPLAINTS[0]?.id ?? ''
    )
    const [rating, setRating] = useState(5)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState('')
    const [aspects, setAspects] = useState<string[]>([])
    const [formError, setFormError] = useState('')
    const [submitted, setSubmitted] = useState<SubmittedFeedback | null>(null)

    const selectedComplaint = RESOLVED_COMPLAINTS.find((c) => c.id === selectedId)
    const displayRating = hoveredRating || rating

    const toggleAspect = (aspect: string) => {
        setAspects((prev) =>
            prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
        )
    }

    const handleSubmit = () => {
        if (!selectedId) { setFormError('Please select a complaint.'); return }
        if (comment.trim().length < 10) { setFormError('Please write a comment with at least 10 characters.'); return }
        setFormError('')
        setSubmitted({
            complaintId: selectedId,
            rating,
            comment: comment.trim(),
            aspects,
            submittedAt: nowStamp(),
        })
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-10 md:px-8">
                <div className="mx-auto max-w-lg">
                    <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(var(--color-success))/0.15] text-2xl">
                            ★
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-[rgb(var(--color-text-primary))]">Feedback Submitted</h2>
                        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                            Thank you for helping us improve campus service quality.
                        </p>

                        <div className="mt-5 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-left space-y-3">
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Complaint</p>
                                <p className="mt-0.5 text-sm font-semibold text-[rgb(var(--color-text-primary))]">{submitted.complaintId}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Rating</p>
                                <p className={`mt-0.5 text-2xl font-bold ${RATING_COLORS[submitted.rating]}`}>
                                    {'★'.repeat(submitted.rating)}{'☆'.repeat(5 - submitted.rating)}
                                    <span className="ml-2 text-sm">{RATING_LABELS[submitted.rating]}</span>
                                </p>
                            </div>
                            {submitted.aspects.length > 0 && (
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Highlights</p>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                        {submitted.aspects.map((a) => (
                                            <span key={a} className="rounded-full border border-[rgb(var(--color-primary))/0.3] bg-[rgb(var(--color-primary))/0.1] px-2 py-0.5 text-[11px] text-[rgb(var(--color-primary))]">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Comment</p>
                                <p className="mt-0.5 text-sm text-[rgb(var(--color-text-primary))]">{submitted.comment}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Submitted At</p>
                                <p className="mt-0.5 text-sm text-[rgb(var(--color-text-primary))]">{submitted.submittedAt}</p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/complaints')}
                                className="rounded-xl bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                            >
                                View All Complaints
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSubmitted(null); setComment(''); setAspects([]); setRating(5) }}
                                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-primary))]"
                            >
                                Submit Another
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-xl">
                <header className="mb-6">
                    <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                        Service Feedback
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))]">Rate Your Experience</h1>
                    <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                        Your feedback helps us improve campus maintenance quality and response times.
                    </p>
                </header>

                <div className="space-y-4">
                    {/* Select complaint */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Select Resolved Complaint</h2>
                        <div className="mt-3 space-y-2">
                            {RESOLVED_COMPLAINTS.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setSelectedId(c.id)}
                                    className={[
                                        'w-full rounded-2xl border p-3 text-left transition',
                                        selectedId === c.id
                                            ? 'border-[rgb(var(--color-primary))/0.55] bg-[rgb(var(--color-primary))/0.08]'
                                            : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] hover:border-[rgb(var(--color-primary))/0.35]',
                                    ].join(' ')}
                                >
                                    <p className="text-xs font-semibold text-[rgb(var(--color-primary))]">{c.id}</p>
                                    <p className="mt-0.5 text-xs text-[rgb(var(--color-text-primary))]">{c.title}</p>
                                    <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-secondary))]">Resolved: {c.resolvedAt}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Star rating */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Overall Rating</h2>
                        <div className="mt-4 flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className={[
                                        'text-3xl transition-transform hover:scale-110',
                                        star <= displayRating ? 'text-[rgb(var(--color-warning))]' : 'text-[rgb(var(--color-border))]',
                                    ].join(' ')}
                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                >
                                    ★
                                </button>
                            ))}
                            <span className={`ml-2 text-sm font-semibold ${RATING_COLORS[displayRating]}`}>
                                {RATING_LABELS[displayRating]}
                            </span>
                        </div>
                    </section>

                    {/* Aspect tags */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">What stood out? <span className="font-normal text-[rgb(var(--color-text-secondary))]">(optional)</span></h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {ASPECT_OPTIONS.map((aspect) => (
                                <button
                                    key={aspect}
                                    type="button"
                                    onClick={() => toggleAspect(aspect)}
                                    className={[
                                        'rounded-full border px-3 py-1 text-xs font-medium transition',
                                        aspects.includes(aspect)
                                            ? 'border-[rgb(var(--color-primary))/0.5] bg-[rgb(var(--color-primary))/0.12] text-[rgb(var(--color-primary))]'
                                            : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-primary))/0.35]',
                                    ].join(' ')}
                                >
                                    {aspect}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Comment */}
                    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                            Your Comment <span className="text-[rgb(var(--color-danger))]">*</span>
                        </h2>
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => { setComment(e.target.value); setFormError('') }}
                            placeholder="Describe your experience — what went well or what could be improved."
                            className="mt-3 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
                        />
                        <div className="mt-1 flex items-center justify-between text-[11px] text-[rgb(var(--color-text-secondary))]">
                            <span>Minimum 10 characters required.</span>
                            <span>{comment.trim().length} chars</span>
                        </div>
                    </section>

                    {formError && (
                        <p className="rounded-xl border border-[rgb(var(--color-danger))/0.3] bg-[rgb(var(--color-danger))/0.08] px-4 py-2.5 text-xs font-semibold text-[rgb(var(--color-danger))]">
                            {formError}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 pb-6">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="rounded-xl bg-[rgb(var(--color-primary))] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                        >
                            Submit Feedback
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/complaints')}
                            className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-6 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-primary))]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FeedbackPage
