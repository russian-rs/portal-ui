import { useContext, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { LocaleContext } from "src/app/providers/LocaleContext"

interface LocalizedMarkdownProps {
    id: string
}

export const LocalizedMarkdown = ({ id }: LocalizedMarkdownProps) => {
    const { locale } = useContext(LocaleContext)
    const [markdownContent, setMarkdownContent] = useState("")

    useEffect(() => {
        fetch(`src/shared/locales/markdown/${locale}/${id}.md`)
            .then((response) => response.text())
            .then((text) => setMarkdownContent(text))
    }, [])

    return (
        <div>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    )
}

export default LocalizedMarkdown
