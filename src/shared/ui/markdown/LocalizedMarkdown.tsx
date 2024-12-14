import { useContext, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { LocaleContext } from "src/app/providers/LocaleContext"

interface LocalizedMarkdownProps {
    id: string
}

export const LocalizedMarkdown = ({ id }: LocalizedMarkdownProps) => {
    const { locale } = useContext(LocaleContext)
    const [markdownContent, setMarkdownContent] = useState()

    useEffect(() => {
        import(`src/shared/locales/markdown/${locale}/${id}.md`).then((file) => {
            setMarkdownContent(file.markdown)
        })
    }, [])

    return (
        <div>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    )
}

export default LocalizedMarkdown
