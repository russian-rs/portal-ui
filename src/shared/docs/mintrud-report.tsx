import { PDFDocument, PDFFont, PDFForm } from 'pdf-lib'
import { saveAs } from 'file-saver'
import fontkit from '@pdf-lib/fontkit'
import { Statistics } from '@russian-rs/portal-api-axios'

import { MONTSERRAT_BOLD_BOLD } from 'src/shared/docs/fonts/Montserrat-Bold-bold'
import { MONTSERRAT_MEDIUM_NORMAL } from 'src/shared/docs/fonts/Montserrat-Medium-normal'

/**
 * Generate Mintrud report PDF (Unicode safe)
 */
export default async function generateMintrudReport(
    stats: Statistics | undefined
) {
    if (!stats) {
        throw new Error('Statistics are required to generate Mintrud report')
    }

    const FIELDS = {
        REPORT_YEAR: 'topmostSubform[0].Page1[0].TextField1[0]',
        ORGANIZATION_NAME: 'topmostSubform[0].Page1[0].TextField1[1]',
        ADDRESS: 'topmostSubform[0].Page1[0].TextField1[2]',
        PHONE: 'topmostSubform[0].Page1[0].TextField1[3]',
        REGISTRY_NUMBER: 'topmostSubform[0].Page1[0].TextField1[4]',
        REGISTRY_DATE: 'topmostSubform[0].Page1[0].TextField1[5]',
    } as const

    // Load template
    const templateBytes = await fetch('/resources/mintrudreport.pdf')
        .then(r => r.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templateBytes)

    // Required for Unicode fonts
    pdfDoc.registerFontkit(fontkit)

    const form = pdfDoc.getForm()

    // Load fonts (Unicode, subset)
    const { bold, regular } = await loadFonts(pdfDoc)

    // ---- Fill fields ----

    setText(
        form,
        FIELDS.REPORT_YEAR,
        String(stats.year ?? ''),
        regular,
        12
    )

    setText(
        form,
        FIELDS.ORGANIZATION_NAME,
        'Удружене грађана «РУСКА ДИЈАСПОРА У СРБИJИ»',
        bold,
        10
    )

    // ---- finalize ----
    form.flatten()

    const pdfBytes = await pdfDoc.save()

    saveAs(
        new Blob([pdfBytes], { type: 'application/pdf' }),
        `mintrud-report-${stats.year}.pdf`
    )
}

/**
 * Load Unicode fonts properly
 */
async function loadFonts(
    pdfDoc: PDFDocument
): Promise<{
    bold: PDFFont
    regular: PDFFont
}> {
    const bold = await pdfDoc.embedFont(
        Uint8Array.from(atob(MONTSERRAT_BOLD_BOLD), c => c.charCodeAt(0)),
        { subset: true }
    )

    const regular = await pdfDoc.embedFont(
        Uint8Array.from(atob(MONTSERRAT_MEDIUM_NORMAL), c => c.charCodeAt(0)),
        { subset: true }
    )

    return { bold, regular }
}

/**
 * Unicode-safe AcroForm text setter
 */
function setText(
    form: PDFForm,
    fieldName: string,
    value: string,
    font: PDFFont,
    fontSize = 12
) {
    const field = form.getTextField(fieldName)

    // 1. set text
    field.setText(value)

    // 2. set font size (официальный API)
    field.setFontSize(fontSize)

    // 3. regenerate appearance with Unicode font
    field.updateAppearances(font)
}
