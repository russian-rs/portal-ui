
import { locales } from "../lib/locales"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { Flex, Text } from "@mantine/core"
import classes from "src/pages/applications/Applications.module.scss"
import { FormattedMessage } from "react-intl"
import React from "react"

export default function MintrudReport() {
    setDocumentTitleByLocale(locales.titleMintrud)
    return (
        <Flex direction="column">
            <Flex className={classes.root}>
                <Text className={classes.title} variant="gradient">
                    <FormattedMessage id={locales.titleMintrud} />
                </Text>
            </Flex>
        </Flex>
    )
}