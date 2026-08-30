import { notifications } from "@mantine/notifications"
import fontkit from "@pdf-lib/fontkit"
import { ApplicationDto, GenderEnumDto, ProgramDto } from "@russian-rs/portal-api-axios"
import dayjs from "dayjs"
import { saveAs } from "file-saver"
import { PDFDocument, rgb } from "pdf-lib"
import { DEJAVU_SANS } from "src/shared/docs/fonts/DejaVuSans"
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal"
import { fillQuestionnairePage } from "src/shared/docs/questionnaire"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { getFullAddress } from "src/shared/utils/getFullAddress"

const ACTIVITY_CHECKBOX_MAP: Record<string, { x: number; fromTop: number }> = {
    // TODO: fill in after verifying prijava.pdf visually
}

export default async function generateCombinedPdf(application: ApplicationDto, program?: ProgramDto) {
    const fullName = must(application.name, "Name")
    const birthDate = fmt(application.birthDate, "Birth date")
    const passport = must(application.passport, "Passport")
    const age = dayjs().diff(dayjs(application.birthDate), "year").toString()
    const phone = must(application.phone, "Phone").replace(/^\+381\s*/, "")
    const email = must(application.email, "Email")
    const telegram = must(application.telegram, "Telegram")
    const address = getFullAddress(
        must(application.postalCode, "Postal code"),
        must(application.city, "City"),
        must(application.address, "Address")
    )
    const city = must(application.city, "City")
    const gender = application.gender ?? null

    const [templateBytes, prijavaBytes] = await Promise.all([
        fetch("/resources/template.pdf").then((r) => r.arrayBuffer()),
        fetch("/resources/prijava.pdf").then((r) => r.arrayBuffer()),
    ])

    const questionnairePdf = await PDFDocument.load(templateBytes)
    await fillQuestionnairePage(questionnairePdf, application)

    // ── Page 2: prijava
    const prijavaDoc = await PDFDocument.load(prijavaBytes)
    prijavaDoc.registerFontkit(fontkit)

    const mediumFont = await prijavaDoc.embedFont(
        Uint8Array.from(atob(MONTSERRAT_MEDIUM_NORMAL), (c) => c.charCodeAt(0)),
        { subset: true }
    )
    const symbolFont = await prijavaDoc.embedFont(
        Uint8Array.from(atob(DEJAVU_SANS), (c) => c.charCodeAt(0)),
        { subset: true }
    )

    const prijavaPage = prijavaDoc.getPages()[0]
    const { height } = prijavaPage.getSize()

    const fromTopP = (yPx: number, size = 8) => height - yPx - size

    const drawPxP = (text: string, xPx: number, yPx: number, font = mediumFont, size = 8) =>
        prijavaPage.drawText(text, {
            x: xPx,
            y: fromTopP(yPx, size),
            font,
            size,
            color: rgb(0, 0, 0),
        })

    const drawMarkP = (x: number, yFromTop: number) => drawPxP("✔", x, yFromTop, symbolFont, 9)

    // 1. Ime i prezime
    drawPxP(fullName, 185, 125)

    // 2. Пасош
    drawPxP(passport, 142, 142)

    // 3. Рођен (DD.MM.YYYY)
    drawPxP(birthDate, 138, 158)

    // 4. Старости
    drawPxP(age, 155, 174)

    // 5. Волонтирање је обављено у (град/општина)
    drawPxP(city, 270, 190)

    // 6. Адреса седишта
    drawPxP(address, 194, 222)

    // 7. Телефон (stripped +381)
    drawPxP(phone, 181, 253)

    // 8. E-mail
    drawPxP(email, 149, 269)

    // 8.1 Телеграм — on the line below e-mail (y=550 native → fromTop 284).
    // If it appears on the same line as e-mail, move to: drawPxP(telegram, 397, 269)
    drawPxP(telegram, 86, 284)

    // 9. Волонтерске активности — tick the box matching the application's program.
    if (program?.code && ACTIVITY_CHECKBOX_MAP[program.code]) {
        const { x, fromTop } = ACTIVITY_CHECKBOX_MAP[program.code]
        drawMarkP(x, fromTop)
    }

    // 10. Пол/Род
    if (gender === GenderEnumDto.Male) {
        drawMarkP(157, 386)
    } else if (gender === GenderEnumDto.Female) {
        drawMarkP(227, 386)
    } else if (gender != null) {
        // Other / Друго — the form has a third checkbox that template.pdf lacks
        drawMarkP(295, 386)
    }

    // Date

    const day = dayjs().format("DD")
    const year2 = dayjs().format("YY")
    drawPxP(day, 200, 675)
    drawPxP(year2, 311, 675)

    // Signature

    const combinedPdf = await PDFDocument.create()
    const [questionnairePage] = await combinedPdf.copyPages(questionnairePdf, [0])
    const [prijavaFilledPage] = await combinedPdf.copyPages(prijavaDoc, [0])
    combinedPdf.addPage(questionnairePage)
    combinedPdf.addPage(prijavaFilledPage)

    const pdfBytes = await combinedPdf.save()
    saveAs(
        new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
        `Prijava_i_Upitnik_${fullName.replace(/\s+/g, "_")}.pdf`
    )
}

function must(value: string | null | undefined, name: string): string {
    if (!value) {
        notifications.show(
            ErrorNotification(`${name} is empty`, "Please fill in all required fields before generating the PDF.")
        )
        throw new Error(`${name} is empty`)
    }
    return value
}

function fmt(value: string | null | undefined, name: string) {
    return dayjs(must(value, name)).format("DD.MM.YYYY")
}
