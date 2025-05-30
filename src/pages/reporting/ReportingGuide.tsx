import { Flex } from "@mantine/core"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import LocalizedMarkdown from "src/shared/ui/markdown/LocalizedMarkdown"
import classes from "./ReportingGuide.module.scss"
import { locales } from "./lib/locales"

export const ReportingGuide = () => {
    setDocumentTitleByLocale(locales.title)

    return (
        <Flex className={classes.root} direction="column">
            <LocalizedMarkdown id={locales.text} />
        </Flex>
    )
}

export default ReportingGuide 