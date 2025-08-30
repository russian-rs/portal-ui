import { Flex } from "@mantine/core"
import { useContext } from "react"
import { useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import LocalizedMarkdown from "src/shared/ui/markdown/LocalizedMarkdown"
import classes from "./CleaningHowTo.module.scss"
import { locales } from "./lib/locales"
import { hasAccess } from "./lib/roles"

export const CleaningHowTo = () => {
    setDocumentTitleByLocale(locales.title)
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const intl = useIntl()

    if (!hasAccess(user)) {
        navigate("/unauthorized")
    }

    return (
        <Flex className={classes.root} direction="column">
            <LocalizedMarkdown id={locales.text} className={classes.markdown} />
        </Flex>
    )
}

export default CleaningHowTo
