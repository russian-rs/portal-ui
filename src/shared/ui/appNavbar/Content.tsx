import { IconAdjustments, IconFileAnalytics, IconHelp, IconUsers } from "@tabler/icons-react"
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
                label: "navbar.reports.new-report-playground",
                link: "/playgrounds",
                roles: ["MAIN_VOLUNTEER", "ADMIN_VOLUNTEER", "ADMIN"],
            },
            {
                label: "navbar.reports.all",
                link: "/reports",
                roles: ["ADMIN_VOLUNTEER"],
            }, // {
            //     label: "navbar.reports.summary",
            //     link: "/reports/summary",
            //     roles: ["ADMIN_VOLUNTEER"],
            // },
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
            },
            {
                label: "navbar.volunteers.applications",
                link: "/applications",
                roles: ["ADMIN_VOLUNTEER", "ADMIN"],
            }, // {
            //     label: "navbar.volunteers.statistics",
            //     link: "/volunteers-stats",
            // },
        ],
        roles: ["ADMIN", "ADMIN_VOLUNTEER", "ADMIN_SSO"],
    },
    {
        label: "navbar.account-settings",
        icon: IconAdjustments,
        link: "https://id.russian.rs/if/user/#/settings",
    },
    {
        label: "navbar.support",
        icon: IconHelp,
        link: "https://t.me/c/1842141044/5106",
    },
]
