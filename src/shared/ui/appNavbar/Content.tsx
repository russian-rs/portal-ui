import { IconAdjustments, IconFileAnalytics, IconLifebuoy, IconUsers } from "@tabler/icons-react"
import { ItemGroupProps } from "src/shared/ui/appNavbar/AppNavbar"

export const Content: ItemGroupProps[] = [
    {
        label: "navbar.reports.reporting",
        icon: IconFileAnalytics,
        initiallyOpened: true,
        items: [
            {
                label: "navbar.reports.my-reports",
                link: "/reports/personal",
            },
            {
                label: "navbar.reports.new-report",
                link: "/report/create",
            },
            {
                label: "navbar.reports.cleaning",
                link: "/cleaning-how-to",
                roles: ["ADMIN_VOLUNTEER", "ADMIN", "MAIN_VOLUNTEER"],
            },
            {
                label: "navbar.reports.reporting-guide",
                link: "/reporting-guide",
            },
            {
                label: "navbar.reports.all",
                link: "/reports",
                roles: ["ADMIN_VOLUNTEER"],
            },
            {
                label: "navbar.reports.heat-map",
                link: "/volunteers/heatmap",
                roles: ["ADMIN_VOLUNTEER"],
            },
        ],
    },
    {
        label: "navbar.volunteers.volunteers",
        icon: IconUsers,
        initiallyOpened: true,
        items: [
            {
                label: "navbar.volunteers.all-volunteers",
                link: "/volunteers",
                roles: ["ADMIN_VOLUNTEER", "ADMIN_SSO"],
            },
            {
                label: "navbar.volunteers.applications",
                link: "/applications",
                roles: ["ADMIN_VOLUNTEER", "INTERVIEWER"],
            },
            {
                label: "navbar.volunteers.statistics",
                link: "/volunteers/reports",
                roles: ["ADMIN_VOLUNTEER"],
            },
        ],
        roles: ["ADMIN_VOLUNTEER", "ADMIN_SSO", "INTERVIEWER"],
    },
    {
        label: "navbar.account-settings",
        icon: IconAdjustments,
        link: "https://id.russian.rs/if/user/#/settings",
    },
    {
        label: "navbar.support",
        icon: IconLifebuoy,
        link: "https://docs.google.com/forms/d/e/1FAIpQLSf3Zqvd4ZTqZeAd_JI5OtRHy8bUqn_2jiDEEXdnqQZdZISpSA/viewform",
    },
]
