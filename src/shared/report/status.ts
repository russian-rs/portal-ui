import { MantineColor } from "@mantine/core"

export enum ReportStatus {
    CREATED = "CREATED",
    ACCEPTED = "ACCEPTED",
}

export const getReportStatusColor = (status: string | undefined): MantineColor => {
    switch (status) {
        case ReportStatus.CREATED:
            return "blue"
        case ReportStatus.ACCEPTED:
            return "green"
        default:
            return "blue"
    }
}
