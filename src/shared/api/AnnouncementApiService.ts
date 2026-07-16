import { RequestHttp } from "src/shared/http/RequestHttp"

export type AnnouncementAudience = "ALL" | "PROGRAM"

export interface AnnouncementDto {
    id: string
    title: string
    body: string
    createTime: string
    createdBy?: string | null
    audience: AnnouncementAudience
    programCode?: string | null
    read: boolean
}

export interface AnnouncementCreateRequest {
    title: string
    body: string
    audience: AnnouncementAudience
    programCode?: string | null
}

export interface UnreadAnnouncementsCountDto {
    count: number
}

export const AnnouncementApiService = {
    getAnnouncements: () => RequestHttp.get<AnnouncementDto[]>("/announcements"),

    getUnreadCount: () => RequestHttp.get<UnreadAnnouncementsCountDto>("/announcements/unread-count"),

    markRead: (id: string) => RequestHttp.post(`/announcements/${id}/read`),

    create: (payload: AnnouncementCreateRequest) =>
        RequestHttp.post<AnnouncementDto>("/announcements", payload),
}
