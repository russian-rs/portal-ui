import { ApplicationDto } from "@russian-rs/portal-api-axios"
import { PDFDocument, rgb, PDFFont } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { saveAs } from "file-saver"
import { MONTSERRAT_BOLD_BOLD } from "src/shared/docs/fonts/Montserrat-Bold-bold"
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal"

export default async function generateEnvelopPdf(application: ApplicationDto) {
    const fullName = must(application.name, "Name")
    const passport = must(application.passport, "Passport")
    const phone = must(application.phone, "Phone")
    const address = must(application.address, "Address")

    const templateBytes = await fetch("/resources/envelop.pdf").then(r => r.arrayBuffer())
    const pdf = await PDFDocument.load(templateBytes)
    pdf.registerFontkit(fontkit)

    const mediumFont = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_MEDIUM_NORMAL), c => c.charCodeAt(0)),
        { subset: true }
    )
    const boldFont = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_BOLD_BOLD), c => c.charCodeAt(0)),
        { subset: true }
    )

    const page = pdf.getPages()[0]
    const { height } = page.getSize()

    const px = (v: number) => v
    const fromTop = (yPx: number, fontSize = 10) => height - px(yPx) - fontSize

    const drawPx = (
        text: string,
        xPx: number,
        yPx: number,
        font: PDFFont = mediumFont,
        size = 8
    ) => {
        page.drawText(text, {
            x: px(xPx),
            y: fromTop(yPx, size),
            font,
            size,
            color: rgb(0, 0, 0),
        })
    }

    const drawWrappedPx = (
        text: string,
        xPx: number,
        yPx: number,
        maxXPx: number, // right boundary in px
        opts?: { font?: PDFFont; size?: number; lineGap?: number }
    ) => {
        const font = opts?.font ?? mediumFont
        const size = opts?.size ?? 8
        const lineGap = opts?.lineGap ?? 2

        const maxWidth = px(maxXPx) - px(xPx)
        const words = text.trim().split(/\s+/)
        const lines: string[] = []
        let current = ""

        const fits = (s: string) => font.widthOfTextAtSize(s, size) <= maxWidth

        for (const w of words) {
            const attempt = current ? current + " " + w : w
            if (fits(attempt)) {
                current = attempt
            } else {
                if (current) lines.push(current)
                if (!fits(w)) {
                    let start = 0
                    while (start < w.length) {
                        let end = start + 1
                        while (end <= w.length && fits(w.slice(start, end))) end++
                        lines.push(w.slice(start, end - 1))
                        start = end - 1
                    }
                    current = ""
                } else {
                    current = w
                }
            }
        }
        if (current) lines.push(current)

        lines.forEach((ln, i) => {
            page.drawText(ln, {
                x: px(xPx),
                y: fromTop(yPx + i * (size + lineGap), size),
                font,
                size,
                color: rgb(0, 0, 0),
            })
        })
    }


    drawPx(fullName, 66, 75, boldFont, 10)
    drawWrappedPx(address, 65, 102, 273, { font: mediumFont, size: 8, lineGap: 2 })
    drawPx(passport, 102, 129)
    drawPx(phone, 112, 140)

    const pdfBytes = await pdf.save()
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `Koverat ${fullName.replace(/\s+/g, "_")}.pdf`)
}

function must(value: string | null | undefined, name: string): string {
    if (!value) throw new Error(`${name} is empty`)
    return value
}
