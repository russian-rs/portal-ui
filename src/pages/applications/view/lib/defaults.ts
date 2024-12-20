import { ApplicationDto } from "@russian-rs/portal-api-axios"
import { v4 } from "uuid"

export const defaultApplicationDto: ApplicationDto = {
    id: v4(),
}
