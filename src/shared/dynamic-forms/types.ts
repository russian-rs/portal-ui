export type CaseId = "BUG" | "AUTH" | "ADDRESS_CHANGE" | "NAME_CHANGE" | "PROGRAM_CHANGE" | "RESIDENCE_PERMIT" | "OTHER"

export type FieldType = "text" | "textarea" | "select" | "date"

export type SelectOption = { value: string; labelKey: string }

export type CaseField =
    | {
          type: "text" | "textarea"
          name: string
          labelKey: string
          placeholderKey?: string
          required?: boolean
          visibleWhen?: { field: string; equals: string }
      }
    | {
          type: "date"
          name: string
          labelKey: string
          required?: boolean
          visibleWhen?: { field: string; equals: string }
      }
    | {
          type: "select"
          name: string
          labelKey: string
          placeholderKey?: string
          required?: boolean
          options: SelectOption[]
          visibleWhen?: { field: string; equals: string }
      }

export type CaseValues = Record<string, string>

export type TicketDraft = {
    title: string
    bodyHtml: string
    allowAttachments: boolean
    attachmentsRequired: boolean
    groupTarget: "SUPPORT" | "CURATOR"
}

export type SupportCaseConfig = {
    id: CaseId
    labelKey: string
    defaultTitleKey: string
    groupTarget: "SUPPORT" | "CURATOR"
    fields: CaseField[]
    allowAttachments?: boolean
    attachmentsRequired?: boolean
    build: (values: CaseValues, t: (id: string) => string) => TicketDraft
}
