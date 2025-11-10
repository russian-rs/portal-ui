import fontkit from "@pdf-lib/fontkit"
import { ApplicationDto } from "@russian-rs/portal-api-axios"
import dayjs from "dayjs"
import { saveAs } from "file-saver"
import { PDFDocument, rgb } from "pdf-lib"
import { MONTSERRAT_BOLD_BOLD } from "src/shared/docs/fonts/Montserrat-Bold-bold"
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal"

function getFullAddress(city: string, address: string, postalCode: string): string {
    return [city, address, postalCode].join(", ")
}

export default async function generateQuestionnairePdf(application: ApplicationDto) {
    const fullName = must(application.name, "Name")
    const birthDate = fmt(application.birthDate, "Birth date")
    const passport = must(application.passport, "Passport")
    const age = dayjs().diff(dayjs(application.birthDate), "year").toString()
    const phone = must(application.phone, "Phone").replace(/^\+381\s*/, "")
    const email = must(application.email, "Email")
    const telegram = must(application.telegram, "Telegram")
    const address = getFullAddress(
        must(application.city, "City"),
        must(application.address, "Address"),
        must(application.postalCode, "Postal code")
    )
    const city = application.city ?? "—"
    const currentDate = dayjs().format("DD.MM.YYYY")

    const templateBytes = await fetch("/resources/template.pdf").then((r) => r.arrayBuffer())
    const pdf = await PDFDocument.load(templateBytes)
    pdf.registerFontkit(fontkit)

    const mediumFont = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_MEDIUM_NORMAL), (c) => c.charCodeAt(0)),
        { subset: true }
    )
    const boldFont = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_BOLD_BOLD), (c) => c.charCodeAt(0)),
        { subset: true }
    )

    const page = pdf.getPages()[0]
    const { height } = page.getSize()

    const px = (v: number) => v
    const fromTop = (yPx: number, fontSize = 10) => height - px(yPx) - fontSize
    // x, y coordinates could be checked in adobe
    const drawPx = (text: string, xPx: number, yPx: number, font = mediumFont, size = 8) =>
        page.drawText(text, {
            x: px(xPx),
            y: fromTop(yPx, size),
            font,
            size,
            color: rgb(0, 0, 0),
        })

    drawPx(fullName, 327, 277)
    drawPx(passport, 109, 308)
    drawPx(birthDate, 168, 328)
    drawPx(age, 150, 350)
    drawPx(city, 312, 372)
    drawPx(address, 62, 415)
    drawPx(phone, 263, 435)
    drawPx(email, 101, 458)
    drawPx(telegram, 290, 458)
    drawPx(currentDate, 96, 720)

    const pdfBytes = await pdf.save()
    saveAs(
        new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
        `Upitnik_${fullName.replace(/\s+/g, "_")}.pdf`
    )
}

function must(value: string | null | undefined, name: string): string {
    if (!value) throw new Error(`${name} is empty`)
    return value
}

function fmt(value: string | null | undefined, name: string) {
    return dayjs(must(value, name)).format("DD.MM.YYYY")
}
