import { ApplicationDto } from "@russian-rs/portal-api-axios"
import dayjs from "dayjs"
import { jsPDF as JsPdf } from "jspdf"
import { MONTSERRAT_BOLD_BOLD } from "src/shared/docs/fonts/Montserrat-Bold-bold"
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal"

/**
 * Договор о волонтерстве
 */
export default function generateQuestionnairePdf(application: ApplicationDto) {
    const fullName = errorIfEmpty("Name", application.name)
    const birthDate = dayjs(errorIfEmpty("Birth date", application.birthDate)).format("DD.MM.YYYY")
    const passport = errorIfEmpty("Passport", application.passport)
    const phone = errorIfEmpty("Phone", application.phone)
    const email = errorIfEmpty("Email", application.email)
    const address = errorIfEmpty("Address", application.address)
    const contractFrom = dayjs(errorIfEmpty("Contract start date", application.contract?.startDate))
    const contractUntil = dayjs(errorIfEmpty("Contract end date", application.contract?.endDate!!))


    const pdf = new JsPdf({
        orientation: "p",
        unit: "mm",
        format: "a5",
        putOnlyUsedFonts: true,
    })

    pdf.addFileToVFS("Montserrat-Medium-normal.ttf", MONTSERRAT_MEDIUM_NORMAL)
    pdf.addFont("Montserrat-Medium-normal.ttf", "Montserrat-Medium", "normal")
    pdf.addFileToVFS("Montserrat-Bold-bold.ttf", MONTSERRAT_BOLD_BOLD)
    pdf.addFont("Montserrat-Bold-bold.ttf", "Montserrat-Bold", "bold")

    pdf.save(`Upitnik_${fullName.replace(" ", "_")}.pdf`)
}

function wrapText(
    pdf: JsPdf,
    text: string,
    maxWidth: number,
    startX: number,
    startY: number,
    lineHeight: number
): number {
    const words = text.split(" ")
    let line = ""
    let y = startY

    words.forEach((word) => {
        let testLine = line + (line ? " " : "") + word
        let testWidth = pdf.getTextWidth(testLine)

        if (testWidth > maxWidth && line) {
            pdf.text(line, startX, y)
            line = word
            y += lineHeight
        } else {
            line = testLine
        }
    })

    if (line) {
        pdf.text(line, startX, y)
    }

    return y
}

function errorIfEmpty(name: string, str: string | null | undefined): string {
    if (str == null || str === "") {
        alert(name + " is empty")
        throw name + " is empty"
    }
    return str
}
