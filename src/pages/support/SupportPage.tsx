import { Alert, Button, Card, Flex, Select, Text } from "@mantine/core"
import { IconLifebuoy } from "@tabler/icons-react"
import React, { useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import CaseForm from "src/shared/dynamic-forms/CaseForm"
import { defaultSupportCaseId, supportCases } from "src/shared/dynamic-forms/cases"
import { CaseId, CaseValues } from "src/shared/dynamic-forms/types"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import TicketModal from "src/shared/ui/ticketModal/TicketModal"
import classes from "./SupportPage.module.scss"
import { locales } from "./lib/locales"

export const SupportPage: React.FC = () => {
    const { user } = useContext(UserContext)
    const intl = useIntl()

    const [ticketDrawerOpen, setTicketDrawerOpen] = useState(false)
    const [caseId, setCaseId] = useState<CaseId>(defaultSupportCaseId)
    const [values, setValues] = useState<CaseValues>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    const selectedCase = supportCases.find((c) => c.id === caseId) ?? supportCases[0]

    setDocumentTitleByLocale(locales.title)

    if (!user) {
        return null
    }

    const validate = (): boolean => {
        const next: Record<string, string> = {}
        for (const f of selectedCase.fields) {
            if (f.visibleWhen) {
                const current = (values[f.visibleWhen.field] ?? "").toString()
                if (current !== f.visibleWhen.equals) continue
            }
            if (!f.required) continue
            const v = (values[f.name] ?? "").trim()
            if (!v) {
                next[f.name] = intl.formatMessage({ id: "common.ticket-modal.required" })
            }
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const openTicket = () => {
        if (!validate()) return
        setTicketDrawerOpen(true)
    }

    const t = (id: string) => intl.formatMessage({ id })
    const draft = selectedCase.build(values, t)

    return (
        <Flex className={classes.root} direction="column" gap="lg">
            <Card withBorder shadow="sm" className={classes.card}>
                <Flex direction="column" gap="sm">
                    <Text size="xl" fw={700}>
                        <FormattedMessage id={locales.heading} />
                    </Text>
                    <Text c="dimmed">
                        <FormattedMessage id={locales.description} />
                    </Text>
                    <Select
                        label={<FormattedMessage id={locales.caseLabel} />}
                        placeholder={intl.formatMessage({ id: locales.casePlaceholder })}
                        value={caseId}
                        allowDeselect={false}
                        data={supportCases.map((c) => ({
                            value: c.id,
                            label: intl.formatMessage({ id: c.labelKey }),
                        }))}
                        onChange={(v) => {
                            const next = (v ?? defaultSupportCaseId) as CaseId
                            setCaseId(next)
                            setValues({})
                            setErrors({})
                        }}
                    />
                </Flex>
            </Card>

            <Card withBorder shadow="sm" className={classes.card}>
                <Flex direction="column" gap="md">
                    <Text fw={600}>
                        <FormattedMessage id={locales.formTitle} />
                    </Text>

                    {draft.attachmentsRequired ? (
                        <Alert color="orange" variant="light">
                            <FormattedMessage id={locales.attachmentsRequiredHint} />
                        </Alert>
                    ) : null}

                    <CaseForm fields={selectedCase.fields} values={values} onChange={setValues} errors={errors} />

                    <Flex>
                        <Button leftSection={<IconLifebuoy size={16} />} onClick={openTicket}>
                            <FormattedMessage id={locales.button} />
                        </Button>
                    </Flex>
                </Flex>
            </Card>

            <TicketModal
                opened={ticketDrawerOpen}
                close={() => setTicketDrawerOpen(false)}
                fromUser={user ?? undefined}
                initialTitle={draft.title}
                initialBody={draft.bodyHtml}
                allowAttachments={draft.allowAttachments}
                attachmentsRequired={draft.attachmentsRequired}
                groupTarget={draft.groupTarget}
            />
        </Flex>
    )
}

export default SupportPage
