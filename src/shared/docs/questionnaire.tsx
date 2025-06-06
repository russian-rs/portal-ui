import { ApplicationDto } from "@russian-rs/portal-api-axios";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import dayjs from "dayjs";
import { saveAs } from 'file-saver';
import { MONTSERRAT_BOLD_BOLD } from "src/shared/docs/fonts/Montserrat-Bold-bold";
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal";

export default async function generateQuestionnairePdf(application: ApplicationDto) {

    const fullName     = must(application.name,  "Name");
    const birthDate    = fmt(application.birthDate,   "Birth date");
    const passport     = must(application.passport,   "Passport");
    const phone        = must(application.phone,      "Phone");
    const email        = must(application.email,      "Email");
    const address      = must(application.address,    "Address");
    const contractFrom = fmt(application.contract?.startDate, "Contract start date");
    const contractTill = fmt(application.contract?.endDate,   "Contract end date");

    const templateBytes = await fetch("/resources/template.pdf").then(r => r.arrayBuffer());
    const pdf           = await PDFDocument.load(templateBytes);
    pdf.registerFontkit(fontkit);

    const mediumFont = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_MEDIUM_NORMAL), c => c.charCodeAt(0)),
        { subset: true }
    );
    const boldFont   = await pdf.embedFont(
        Uint8Array.from(atob(MONTSERRAT_BOLD_BOLD), c => c.charCodeAt(0)),
        { subset: true }
    );

    const page = pdf.getPages()[0];
    const { height } = page.getSize();

    const px = (v: number) => v;
    const fromTop = (yPx: number, fontSize = 10) =>
        height - px(yPx) - fontSize;

    const drawPx = (
        text: string,
        xPx: number,
        yPx: number,
        font = mediumFont,
        size = 10,
    ) =>
        page.drawText(text, {
            x: px(xPx),
            y: fromTop(yPx, size),
            font,
            size,
            color: rgb(0, 0, 0),
        });

    drawPx(fullName,327,  277);

    const pdfBytes = await pdf.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `Upitnik_${fullName.replace(/\s+/g, "_")}.pdf`);
}

function must(value: string | null | undefined, name: string): string {
    if (!value) throw new Error(`${name} is empty`);
    return value;
}
function fmt(value: string | null | undefined, name: string) {
    return dayjs(must(value, name)).format("DD.MM.YYYY");
}


