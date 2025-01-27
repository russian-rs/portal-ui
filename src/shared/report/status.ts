import { MantineColor } from "@mantine/core"

export enum ReportStatus {
    CREATED = "CREATED",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
}

export const getReportStatusColor = (status: string | undefined): MantineColor => {
    switch (status) {
        case ReportStatus.CREATED:
            return "blue"
        case ReportStatus.REJECTED:
            return "red"
        case ReportStatus.ACCEPTED:
            return "green"
        default:
            return "blue"
    }
}
