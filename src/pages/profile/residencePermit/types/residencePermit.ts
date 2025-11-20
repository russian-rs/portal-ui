import { FileInfoDto } from "@russian-rs/portal-api-axios"

export interface ResidencePermitDto {
    id: string
    nationality: string
    registrationNumber: string
    validUntil: string
    purposeOfStay: string
    identityNumber: string
    issuingDate: string
    issuingAuthority: string
    stateOfBirth: string
    note: string
    frontSidePhoto: FileInfoDto | null
    backSidePhoto: FileInfoDto | null
}
