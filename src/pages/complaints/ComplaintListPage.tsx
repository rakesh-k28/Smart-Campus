import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { priorityBadgeClasses, statusBadgeClasses } from '../../components/customerDashboard/types'
import type { Complaint, Priority, SortOrder } from '../../components/customerDashboard/types'

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
    {
        id: 'CMP-2026-241',
        title: 'Broken door lock in Girls Hostel 1',
        category: 'Civil',
        location: 'Girls Hostel 1 (GH-1) - Room 105',
        priority: 'High',
        status: 'Assigned',
        description: 'Door lock is broken and cannot be secured from inside. Safety concern for residents.',
        createdAt: '28 Mar 2026, 9:00 AM',
        updatedAt: '29 Mar 2026, 10:00 AM',
        updatedAtIso: '2026-03-29T10:00:00+05:30',
        assignedTeam: 'Civil Maintenance Team',
        invoiceStatus: 'Not Generated',
        evidence: [],
        timeline: [
            { id: 't8', label: 'Complaint submitted', when: '28 Mar 2026, 9:00 AM' },
            { id: 't9', label: 'Assigned to Civil Maintenance Team', when: '29 Mar 2026, 10:00 AM' },
        ],
    },
    {
        id: 'CMP-2026-219',
        title: 'Dustbin not cleaned in Cafeteria Block A',
        category: 'Housekeeping',
        location: 'Cafeteria - Block A',
        priority: 'Low',
        status: 'Resolved',
        description: 'Dustbins overflowing since morning. Hygiene concern for students.',
        createdAt: '22 Mar 2026, 11:30 AM',
        updatedAt: '22 Mar 2026, 3:00 PM',
        updatedAtIso: '2026-03-22T15:00:00+05:30',
        assignedTeam: 'Housekeeping Team',
        invoiceStatus: 'Paid',
        evidence: [],
        timeline: [
            { id: 't10', label: 'Complaint submitted', when: '22 Mar 2026, 11:30 AM' },
            { id: 't11', label: 'Resolved by Housekeeping Team', when: '22 Mar 2026, 3:00 PM' },
        ],
    },
]

const ALL_CATEGORIES = ['All Categories', ...Array.from(new Set(SAMPLE_COMPLAINTS.map((c) => c.category)))]
const ALL_STATUSES = ['All Status', 'Open', 'Assigned', 'In Progress', 'Resolved', 'Reopened']
const ALL_PRIORITIES = ['All Priorities', 'Low', 'Medium', 'High', 'Critical']

function ComplaintListPage() {
    const navigate = useNavigate()

    const [search, setSearch] = useState('')
    const [appliedSearch, setAppliedSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All Categories')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [priorityFilter, setPriorityFilter] = useState('All Priorities')
    const [sortOrder, setSortOrder] = useState<SortOrder>('Newest First')

    const filtered = useMemo(() => {
        const rows = SAMPLE_COMPLAINTS.filter((c) => {
            const catOk = categoryFilter === 'All Categories' || c.category === categoryFilter
            const statOk = statusFilter === 'All Status' || c.status === statusFilter
            const priOk = priorityFilter === 'All Priorities' || c.priority === priorityFilter
            const q = appliedSearch.toLowerCase()
            const searchOk = !q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
            return catOk && statOk && priOk && searchOk
        })
        return [...rows].sort((a, b) => {
            const at = new Date(a.updatedAtIso).getTime()
            const bt = new Date(b.updatedAtIso).getTime()
            return sortOrder === 'Newest First' ? bt - at : at - bt
        })
    }, [appliedSearch, categoryFilter, statusFilter, priorityFilter, sortOrder])

    const stats = useMemo(() => ({
        total: SAMPLE_COMPLAINTS.length,
        open: SAMPLE_COMPLAINTS.filter((c) => c.status === 'Open' || c.status === 'Reopened').length,
        inProgress: SAMPLE_COMPLAINTS.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length,
        resolved: SAMPLE_COMPLAINTS.filter((c) => c.status === 'Resolved').length,
    }), [])

    const resetFilters = () => {
        setSearch('')
        setAppliedSearch('')
        setCategoryFilter('All Categories')
        setStatusFilter('All Status')
        setPriorityFilter('All Priorities')
        setSortOrder('Newest First')
    }

    return (
        <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <header className="mb-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                                My Complaints
                            </p>
                            <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))]">Complaint List</h1>
                            <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                                View, filter, and manage all your submitted service requests.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/complaints/raise')}
                            className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                        >
                            + Raise New
                        </button>
                    </div>

                    {/* Stats row */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { label: 'Total', value: stats.total, color: 'text-[rgb(var(--color-text-primary))]' },
                            { label: 'Open', value: stats.open, color: 'text-[rgb(var(--color-danger))]' },
                            { label: 'In Progress', value: stats.inProgress, color: 'text-[rgb(var(--color-primary))]' },
                            { label: 'Resolved', value: stats.resolved, color: 'text-[rgb(var(--color-success))]' },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-center">
                                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setAppliedSearch(search.trim())}
                        placeholder="Search by ID, title, or location"
                        className="min-w-52 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-xs outline-none focus:border-[rgb(var(--color-primary))]"
                    />
                    <button
                        type="button"
                        onClick={() => setAppliedSearch(search.trim())}
                        className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-medium text-white"
                    >
                        Search
                    </button>
                    {[
                        { value: categoryFilter, options: ALL_CATEGORIES, onChange: setCategoryFilter },
                        { value: statusFilter, options: ALL_STATUSES, onChange: setStatusFilter },
                        { value: priorityFilter, options: ALL_PRIORITIES, onChange: setPriorityFilter },
                    ].map((f, i) => (
                        <select
                            key={i}
                            value={f.value}
                            onChange={(e) => f.onChange(e.target.value)}
                            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-xs"
                        >
                            {f.options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-xs"
                    >
                        <option>Newest First</option>
                        <option>Oldest First</option>
                    </select>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-xs font-medium text-[rgb(var(--color-text-primary))]"
                    >
                        Reset
                    </button>
                </div>

                {/* Result count */}
                <p className="mb-3 text-xs text-[rgb(var(--color-text-secondary))]">
                    Showing {filtered.length} of {SAMPLE_COMPLAINTS.length} complaints
                </p>

                {/* List */}
                <div className="space-y-3">
                    {filtered.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => navigate(`/complaints/track?id=${c.id}`)}
                            className="w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 text-left shadow-sm transition hover:border-[rgb(var(--color-primary))/0.45] hover:bg-[rgb(var(--color-primary))/0.04]"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{c.id}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={['rounded-full border px-2 py-0.5 text-xs font-semibold', priorityBadgeClasses[c.priority as Priority]].join(' ')}>
                                        {c.priority}
                                    </span>
                                    <span className={['rounded-full border px-2 py-0.5 text-xs font-semibold', statusBadgeClasses[c.status]].join(' ')}>
                                        {c.status}
                                    </span>
                                </div>
                            </div>
                            <h3 className="mt-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">{c.title}</h3>
                            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{c.category} · {c.location}</p>
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[rgb(var(--color-text-secondary))]">
                                <span>Team: {c.assignedTeam}</span>
                                <span>Updated: {c.updatedAt}</span>
                            </div>
                        </button>
                    ))}

                    {filtered.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 text-center">
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">No complaints match your current filters.</p>
                            <button type="button" onClick={resetFilters} className="mt-3 text-xs font-semibold text-[rgb(var(--color-primary))] hover:underline">
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default ComplaintListPage
