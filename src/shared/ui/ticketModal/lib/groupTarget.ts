export enum TicketGroupTarget {
    SUPPORT = "SUPPORT",
    CURATOR = "CURATOR",
}

/**
 * Substrings used to auto-pick group from /ticket/groups.
 * Keep these lists small and explicit — backend group names may change.
 */
export const ticketGroupNeedlesByTarget: Record<TicketGroupTarget, string[]> = {
    [TicketGroupTarget.SUPPORT]: ["support", "help", "поддерж", "helpdesk", "it"],
    [TicketGroupTarget.CURATOR]: ["curator", "куратор", "координ", "volunteer", "волонт"],
}

export const ticketGroupExactCandidatesByTarget: Record<TicketGroupTarget, string[]> = {
    [TicketGroupTarget.SUPPORT]: ["support", "help", "поддержка"],
    [TicketGroupTarget.CURATOR]: ["curator", "куратор", "координатор"],
}

export function pickTicketGroupByTarget(
    groups: string[] | undefined,
    target: TicketGroupTarget | undefined
): string | null {
    if (!groups || groups.length === 0) return null
    if (!target) return null

    const norm = (s: string) => s.toLowerCase()
    const hasAny = (s: string, parts: string[]) => parts.some((p) => norm(s).includes(p))

    const exactCandidates = ticketGroupExactCandidatesByTarget[target]
    const exact = groups.find((g) => exactCandidates.includes(norm(g)))
    if (exact) return exact

    const fuzzy = groups.find((g) => hasAny(g, ticketGroupNeedlesByTarget[target]))
    if (fuzzy) return fuzzy

    return groups[0]
}
