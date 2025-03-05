import image1 from "/resources/cleaning/1.png"
import image2 from "/resources/cleaning/2.png"
import image3 from "/resources/cleaning/3.png"
import image4 from "/resources/cleaning/4.png"
import image5 from "/resources/cleaning/5.png"
import image6 from "/resources/cleaning/6.png"
import image7 from "/resources/cleaning/7.png"
import { Flex, Image } from "@mantine/core"
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
            <LocalizedMarkdown id={locales.text} />
            <Image src={image1} />
            <Image src={image2} />
            <Image src={image3} />
            <Image src={image4} />
            <Image src={image5} />
            <Image src={image6} />
            <Image src={image7} />
        </Flex>
    )
}

export default CleaningHowTo
