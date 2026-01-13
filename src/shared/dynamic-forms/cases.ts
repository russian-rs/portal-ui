import { CaseValues, SupportCaseConfig, TicketDraft } from "src/shared/dynamic-forms/types"
import { buildDefinitionList, getValue } from "src/shared/dynamic-forms/utils/buildTicketBody"
import { TicketGroupTarget } from "src/shared/ui/ticketModal/lib/groupTarget"

function baseDraft(partial: Partial<TicketDraft>): TicketDraft {
    return {
        title: partial.title ?? "",
        bodyHtml: partial.bodyHtml ?? "",
        allowAttachments: partial.allowAttachments ?? true,
        attachmentsRequired: partial.attachmentsRequired ?? false,
        groupTarget: partial.groupTarget ?? TicketGroupTarget.SUPPORT,
    }
}

export const supportCases: SupportCaseConfig[] = [
    {
        id: "BUG",
        labelKey: "pages.support.cases.bug",
        defaultTitleKey: "pages.support.cases.bug.title",
        groupTarget: TicketGroupTarget.SUPPORT,
        allowAttachments: true,
        attachmentsRequired: false,
        fields: [
            {
                type: "text",
                name: "page",
                labelKey: "pages.support.fields.page",
                required: false,
            },
            {
                type: "textarea",
                name: "steps",
                labelKey: "pages.support.fields.steps",
                required: true,
            },
            {
                type: "textarea",
                name: "expected",
                labelKey: "pages.support.fields.expected",
                required: false,
            },
            {
                type: "textarea",
                name: "actual",
                labelKey: "pages.support.fields.actual",
                required: true,
            },
            {
                type: "text",
                name: "environment",
                labelKey: "pages.support.fields.environment",
                required: false,
            },
        ],
        build: (values: CaseValues, t) => {
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.bug")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.page"), value: getValue(values, "page") },
                    { label: t("pages.support.fields.steps"), value: getValue(values, "steps") },
                    { label: t("pages.support.fields.expected"), value: getValue(values, "expected") },
                    { label: t("pages.support.fields.actual"), value: getValue(values, "actual") },
                    { label: t("pages.support.fields.environment"), value: getValue(values, "environment") },
                ])}
            `.trim()
            return baseDraft({
                title: t("pages.support.cases.bug.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: false,
                groupTarget: TicketGroupTarget.SUPPORT,
            })
        },
    },
    {
        id: "AUTH",
        labelKey: "pages.support.cases.auth",
        defaultTitleKey: "pages.support.cases.auth.title",
        groupTarget: TicketGroupTarget.SUPPORT,
        allowAttachments: true,
        attachmentsRequired: false,
        fields: [
            {
                type: "text",
                name: "loginOrEmail",
                labelKey: "pages.support.fields.loginOrEmail",
                required: false,
            },
            {
                type: "textarea",
                name: "problem",
                labelKey: "pages.support.fields.problem",
                required: true,
            },
            {
                type: "text",
                name: "when",
                labelKey: "pages.support.fields.when",
                required: false,
            },
            {
                type: "text",
                name: "environment",
                labelKey: "pages.support.fields.environment",
                required: false,
            },
        ],
        build: (values: CaseValues, t) => {
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.auth")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.loginOrEmail"), value: getValue(values, "loginOrEmail") },
                    { label: t("pages.support.fields.problem"), value: getValue(values, "problem") },
                    { label: t("pages.support.fields.when"), value: getValue(values, "when") },
                    { label: t("pages.support.fields.environment"), value: getValue(values, "environment") },
                ])}
            `.trim()
            return baseDraft({
                title: t("pages.support.cases.auth.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: false,
                groupTarget: TicketGroupTarget.SUPPORT,
            })
        },
    },
    {
        id: "ADDRESS_CHANGE",
        labelKey: "pages.support.cases.addressChange",
        defaultTitleKey: "pages.support.cases.addressChange.title",
        groupTarget: TicketGroupTarget.CURATOR,
        allowAttachments: true,
        attachmentsRequired: true,
        fields: [
            { type: "text", name: "oldAddress", labelKey: "pages.support.fields.oldAddress", required: true },
            { type: "text", name: "newAddress", labelKey: "pages.support.fields.newAddress", required: true },
            { type: "date", name: "effectiveDate", labelKey: "pages.support.fields.effectiveDate", required: false },
            { type: "textarea", name: "reason", labelKey: "pages.support.fields.reason", required: false },
        ],
        build: (values: CaseValues, t) => {
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.addressChange")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.oldAddress"), value: getValue(values, "oldAddress") },
                    { label: t("pages.support.fields.newAddress"), value: getValue(values, "newAddress") },
                    { label: t("pages.support.fields.effectiveDate"), value: getValue(values, "effectiveDate") },
                    { label: t("pages.support.fields.reason"), value: getValue(values, "reason") },
                ])}
            `.trim()
            return baseDraft({
                title: t("pages.support.cases.addressChange.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: true,
                groupTarget: TicketGroupTarget.CURATOR,
            })
        },
    },
    {
        id: "NAME_CHANGE",
        labelKey: "pages.support.cases.nameChange",
        defaultTitleKey: "pages.support.cases.nameChange.title",
        groupTarget: TicketGroupTarget.CURATOR,
        allowAttachments: true,
        attachmentsRequired: true,
        fields: [
            { type: "text", name: "oldName", labelKey: "pages.support.fields.oldName", required: true },
            { type: "text", name: "newName", labelKey: "pages.support.fields.newName", required: true },
            { type: "textarea", name: "reason", labelKey: "pages.support.fields.reason", required: false },
        ],
        build: (values: CaseValues, t) => {
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.nameChange")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.oldName"), value: getValue(values, "oldName") },
                    { label: t("pages.support.fields.newName"), value: getValue(values, "newName") },
                    { label: t("pages.support.fields.reason"), value: getValue(values, "reason") },
                ])}
            `.trim()
            return baseDraft({
                title: t("pages.support.cases.nameChange.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: true,
                groupTarget: TicketGroupTarget.CURATOR,
            })
        },
    },
    {
        id: "PROGRAM_CHANGE",
        labelKey: "pages.support.cases.programChange",
        defaultTitleKey: "pages.support.cases.programChange.title",
        groupTarget: TicketGroupTarget.CURATOR,
        allowAttachments: true,
        attachmentsRequired: false,
        fields: [
            {
                type: "select",
                name: "programOrProject",
                labelKey: "pages.support.fields.programOrProject",
                required: true,
                options: [
                    { value: "PROGRAM", labelKey: "pages.support.fields.programOrProject.options.PROGRAM" },
                    { value: "PROJECT", labelKey: "pages.support.fields.programOrProject.options.PROJECT" },
                ],
            },
            {
                type: "text",
                name: "currentProgram",
                labelKey: "pages.support.fields.currentProgram",
                required: true,
                visibleWhen: { field: "programOrProject", equals: "PROGRAM" },
            },
            {
                type: "text",
                name: "desiredProgram",
                labelKey: "pages.support.fields.desiredProgram",
                required: true,
                visibleWhen: { field: "programOrProject", equals: "PROGRAM" },
            },
            {
                type: "text",
                name: "currentProject",
                labelKey: "pages.support.fields.currentProject",
                required: true,
                visibleWhen: { field: "programOrProject", equals: "PROJECT" },
            },
            {
                type: "text",
                name: "desiredProject",
                labelKey: "pages.support.fields.desiredProject",
                required: true,
                visibleWhen: { field: "programOrProject", equals: "PROJECT" },
            },
            { type: "textarea", name: "reason", labelKey: "pages.support.fields.reason", required: true },
        ],
        build: (values: CaseValues, t) => {
            const scope = getValue(values, "programOrProject")
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.programChange")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.programOrProject"), value: scope },
                    {
                        label:
                            scope === "PROJECT"
                                ? t("pages.support.fields.currentProject")
                                : t("pages.support.fields.currentProgram"),
                        value:
                            scope === "PROJECT"
                                ? getValue(values, "currentProject")
                                : getValue(values, "currentProgram"),
                    },
                    {
                        label:
                            scope === "PROJECT"
                                ? t("pages.support.fields.desiredProject")
                                : t("pages.support.fields.desiredProgram"),
                        value:
                            scope === "PROJECT"
                                ? getValue(values, "desiredProject")
                                : getValue(values, "desiredProgram"),
                    },
                    { label: t("pages.support.fields.reason"), value: getValue(values, "reason") },
                ])}
            `.trim()
            return baseDraft({
                title: t("pages.support.cases.programChange.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: false,
                groupTarget: TicketGroupTarget.CURATOR,
            })
        },
    },
    {
        id: "RESIDENCE_PERMIT",
        labelKey: "pages.support.cases.residencePermit",
        defaultTitleKey: "pages.support.cases.residencePermit.title",
        groupTarget: TicketGroupTarget.CURATOR,
        allowAttachments: true,
        attachmentsRequired: false,
        fields: [
            {
                type: "select",
                name: "permitCase",
                labelKey: "pages.support.fields.permitCase",
                required: true,
                options: [
                    { value: "EXTEND", labelKey: "pages.support.fields.permitCase.options.EXTEND" },
                    { value: "QUESTION", labelKey: "pages.support.fields.permitCase.options.QUESTION" },
                ],
            },
            { type: "text", name: "city", labelKey: "pages.support.fields.city", required: false },
            { type: "date", name: "desiredDate", labelKey: "pages.support.fields.desiredDate", required: false },
            { type: "textarea", name: "question", labelKey: "pages.support.fields.question", required: true },
        ],
        build: (values: CaseValues, t) => {
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.residencePermit")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.permitCase"), value: getValue(values, "permitCase") },
                    { label: t("pages.support.fields.city"), value: getValue(values, "city") },
                    { label: t("pages.support.fields.desiredDate"), value: getValue(values, "desiredDate") },
                    { label: t("pages.support.fields.question"), value: getValue(values, "question") },
                ])}
            `.trim()
            return baseDraft({
                title: t("pages.support.cases.residencePermit.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: false,
                groupTarget: TicketGroupTarget.CURATOR,
            })
        },
    },
    {
        id: "OTHER",
        labelKey: "pages.support.cases.other",
        defaultTitleKey: "pages.support.cases.other.title",
        groupTarget: TicketGroupTarget.CURATOR,
        allowAttachments: true,
        attachmentsRequired: false,
        fields: [
            { type: "text", name: "topic", labelKey: "pages.support.fields.topic", required: true },
            { type: "textarea", name: "message", labelKey: "pages.support.fields.message", required: true },
        ],
        build: (values: CaseValues, t) => {
            const body = `
                <p><strong>${t("pages.support.body.case")}:</strong> ${t("pages.support.cases.other")}</p>
                ${buildDefinitionList([
                    { label: t("pages.support.fields.topic"), value: getValue(values, "topic") },
                    { label: t("pages.support.fields.message"), value: getValue(values, "message") },
                ])}
            `.trim()
            return baseDraft({
                title: getValue(values, "topic") || t("pages.support.cases.other.title"),
                bodyHtml: body,
                allowAttachments: true,
                attachmentsRequired: false,
                groupTarget: TicketGroupTarget.CURATOR,
            })
        },
    },
]

export const defaultSupportCaseId = "BUG" as const
