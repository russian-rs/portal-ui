import { TaskDto } from "@russian-rs/portal-api-axios"
import { v4 as uuid } from "uuid"

export const locales = {
    title: "pages.new-report.title",
    description: "pages.new-report.description",
}

export const defaultTask: TaskDto = {
    id: uuid(),
    date: Date(),
    name: "",
    description: "",
    timeSpent: 60,
    result: "",
    files: [],
    customer: null,
}
