import { ApplicationDto, GenderEnumDto } from "@russian-rs/portal-api-axios"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import dayjs from "dayjs"
import { saveAs } from "file-saver"
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal"
import { DEJAVU_SANS } from "src/shared/docs/fonts/DejaVuSans"


type AppWithGender = ApplicationDto & { gender?: GenderEnumDto | null }

export default async function generateQuestionnairePdf(application: ApplicationDto) {
    // TODO temporary. Delete after api update with gender in ApplicationDto
    const appWithMale: AppWithGender = {
        ...application,
        gender: GenderEnumDto.Female,
    };
    const fullName = must(application.name, "Name")
    const birthDate = fmt(application.birthDate, "Birth date")
    const passport = must(application.passport, "Passport")
    const age = dayjs().diff(dayjs(application.birthDate), "year").toString()
    const phone = must(application.phone, "Phone").replace(/^\+381\s*/, "")
    const email = must(application.email, "Email")
    const telegram = must(application.telegram, "Telegram")
    const address = must(application.address, "Address")
    const city = application.address?.split(",")[1]?.trim() ?? "—"
    const gender = (appWithMale as AppWithGender).gender ?? null
    const currentDate = dayjs().format("DD.MM.YYYY")
    const templateBytes = await fetch("/resources/template.pdf").then((r) => r.arrayBuffer())
    const pdf = await PDFDocument.load(templateBytes)

    const GENDER_MALE_BOX   = { x:  134, y: 556 }
    const GENDER_FEMALE_BOX = { x: 186, y: 556 }

    pdf.registerFontkit(fontkit)

    const mediumFont = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_MEDIUM_NORMAL), (c) => c.charCodeAt(0)),
        { subset: true }
    )

    const symbolFont = await pdf.embedFont(
        Uint8Array.from(atob(DEJAVU_SANS), (c) => c.charCodeAt(0)),
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

    const drawMark = (x: number, y: number) => drawPx("✔", x, y, symbolFont, 9)


    drawPx(fullName, 350, 285)
    drawPx(passport, 109, 315)
    drawPx(birthDate, 173, 335)
    drawPx(age, 155, 360)
    drawPx(city, 335, 380)
    drawPx(address, 62, 425)
    drawPx(phone, 268, 445)
    drawPx(email, 101, 468)
    drawPx(telegram, 290, 468)
    if (gender === GenderEnumDto.Male) {
        drawMark(GENDER_MALE_BOX.x, GENDER_MALE_BOX.y)
    } else if (gender === GenderEnumDto.Female) {
        drawMark(GENDER_FEMALE_BOX.x, GENDER_FEMALE_BOX.y)
    }
    drawPx(currentDate, 96, 730)

    const pdfBytes = await pdf.save()
    saveAs(new Blob([pdfBytes as BlobPart], { type: "application/pdf" }), `Upitnik_${fullName.replace(/\s+/g, "_")}.pdf`)
}

function must(value: string | null | undefined, name: string): string {
    if (!value) throw new Error(`${name} is empty`)
    return value
}

function fmt(value: string | null | undefined, name: string) {
    return dayjs(must(value, name)).format("DD.MM.YYYY")
}
