import { IconAdjustments, IconFileAnalytics, IconHelp, IconUsers } from "@tabler/icons-react"

export const Content = [
    {
        label: "navbar.reports.reporting",
        icon: IconFileAnalytics,
        links: [
            {
                label: "navbar.reports.my-reports",
                link: "/reports",
            },
            {
                label: "navbar.reports.new-report",
                link: "/report/create",
            },
            {
                label: "navbar.reports.summary",
                link: "/reports/summary",
            },
        ],
    },
    {
        label: "navbar.volunteers.volunteers",
        icon: IconUsers,
        links: [
            {
                label: "navbar.volunteers.all-volunteers",
                link: "/volunteers",
            },
            {
                label: "navbar.volunteers.applications",
                link: "/applications",
            },
            {
                label: "navbar.volunteers.statistics",
                link: "/volunteers-stats",
            },
        ],
    },
    {
        label: "navbar.account-settings",
        icon: IconAdjustments,
        link: "https://id.russian.rs/if/user/#/settings",
    },
    {
        label: "navbar.support",
        icon: IconHelp,
        link: "https://t.me/ruskadijaspora_bot",
    },
]
