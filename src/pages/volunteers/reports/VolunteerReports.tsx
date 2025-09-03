import { locales } from "../lib/locales"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { Flex, Text } from "@mantine/core"
import classes from "./VolunteerReports.module.scss"
import { FormattedMessage } from "react-intl"
import React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useNavigate } from "react-router"

export default function VolunteerReports() {
    setDocumentTitleByLocale(locales.titleReports)
    const navigate = useNavigate()


    return (
        <Flex direction="column">
            <Flex className={classes.root}>
                <Text className={classes.title} variant="gradient">
                    <FormattedMessage id={locales.titleReports} />
                </Text>
                <Flex className={classes.reportContainer}>
                    <Flex
                        className={classes.report}
                        onClick={() => navigate("/volunteers/reports/mintrud")}
                    >
                        <IconChevronRight className={classes.iconLeft} />
                        <Text className={classes.reportName}>
                            <FormattedMessage id={locales.titleMintrud} />
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
