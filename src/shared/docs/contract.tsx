import { ApplicationDto } from "@russian-rs/portal-api-axios"
import dayjs from "dayjs"
import { jsPDF as JsPdf } from "jspdf"
import { MONTSERRAT_BOLD_BOLD } from "src/shared/docs/fonts/Montserrat-Bold-bold"
import { MONTSERRAT_MEDIUM_NORMAL } from "src/shared/docs/fonts/Montserrat-Medium-normal"
import { getFullAddress } from "src/shared/utils/getFullAddress"

/**
 * Договор о волонтерстве
 */

export default function generateContractPdf(application: ApplicationDto) {
    const fullName = errorIfEmpty("Name", application.name)
    const birthDate = dayjs(errorIfEmpty("Birth date", application.birthDate)).format("DD.MM.YYYY")
    const passport = errorIfEmpty("Passport", application.passport)
    const phone = errorIfEmpty("Phone", application.phone)
    const email = errorIfEmpty("Email", application.email)
    const address = getFullAddress(
        errorIfEmpty("Postal code", application.postalCode),
        errorIfEmpty("City", application.city),
        errorIfEmpty("Address", application.address)
    )
    const contractFrom = dayjs(errorIfEmpty("Contract start date", application.contract?.startDate))
    const contractUntil = dayjs(errorIfEmpty("Contract end date", application.contract?.endDate))

    let startX = 15
    let startY = 25

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

    pdf.setFont("Montserrat-Bold", "bold")
    pdf.setFontSize(6)
    pdf.text("УГОВОР О  ВОЛОНТИРАЊУ", 75, startY, { align: "center" }, null)
    startY = startY + 10

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(new Date().toLocaleDateString(), 15, startY)

    pdf.text("град Нови Сад", 140, startY, { align: "right" }, null)
    startY = startY + 5

    pdf.text("На основу Закона о волонтирању („Службени гласник РС“, бр. 36/2010), уговорне стране:", 15, startY)
    startY = startY + 3
    if ((fullName + address).length < 80) {
        const value1 = "**" + fullName + "** рођен **" + birthDate + "** , адреса **" + address + "** ,  Србиjа,"
        value1.split("**").map((text1, i) => {
            pdf.setFont("Montserrat-Bold", "bold")
            if (i % 2 === 0) {
                pdf.setFont("Montserrat-Medium", "normal")
            }
            pdf.text(text1, startX, startY)
            startX = startX + pdf.getStringUnitWidth(text1) * 2.1
        })
        startY = startY + 3
        startX = 15
    } else {
        const value2 = "**" + fullName + "** рођен **" + birthDate + "**, адреса"
        value2.split("**").map((text1, i) => {
            pdf.setFont("Montserrat-Bold", "bold")
            if (i % 2 === 0) {
                pdf.setFont("Montserrat-Medium", "normal")
            }
            pdf.text(text1, startX, startY)
            startX = startX + pdf.getStringUnitWidth(text1) * 2.1
        })

        startX = 15
        startY = startY + 3
        const value3 = "**" + address + "**  Serbia,"
        value3.split("**").map((text1, i) => {
            pdf.setFont("Montserrat-Bold", "bold")
            if (i % 2 === 0) {
                pdf.setFont("Montserrat-Medium", "normal")
            }
            pdf.text(text1, startX, startY)
            startX = startX + pdf.getStringUnitWidth(text1) * 2.1
        })
        startY = startY + 3
        startX = 15
    }

    const value4 = "пасош **" + passport + "**, (у даљем тексту: Волонтер) и "
    value4.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 15
    startY = startY + 5

    const value5 = '**Удружење грађана "РУСКА ДИЈАСПОРА У СРБИJИ"**,  матични број (МБ): 28355122 ПИБ: 113526376,'
    value5.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })
    startX = 15
    startY = startY + 3

    pdf.text(
        "Шифра активности: 9499 које заступа директор Леонид Стеценко (у даљем тексту: Организатор \n" +
            "волонтирања) уговорне стране су се договориле о следећем. \n\n" +
            "Уговорне стране, у горе наведеном својству, сагласне су да волонтер има релевантна стручна знања \n" +
            "неопходна за обављање волонтерских активности у организацији организатора волонтирања, те да \n" +
            "волонтер испуњава услове предвиђене одредбама Закона о волонтирању (у даљем тексту: Закон).",
        15,
        startY
    )
    startY = startY + 18

    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text("ЧЛАН 1. ПРЕДМЕТ УГОВОРА", 15, startY)
    startY = startY + 5

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(
        "1.1. Волонтирање у смислу овог уговора је организовано добровољно пружање услуга или активности од \n" +
            "општег интереса за опште добро или у корист другог лица без плаћања новчане накнаде или захтева за \n" +
            "другу имовинску корист. \n\n" +
            "1.2. Овим уговором волонтер се обавезује да ће пружати услуге учешћа у активностима и догађајима \n" +
            "Организатора волонтирања у области заступања интереса дијаспоре руског говорног подручја у \n" +
            "Републици Србији, у циљу остваривања циљева дефинисаних Законом, Статутом организације у складу \n" +
            "са Законом, овим уговором, програмом волонтирања, упутствима за волонтере, правилима струке. \n\n" +
            "1.3. Главне области волонтирања су: \n\n" +
            "- медијско волонтирање (информативна подршка сајта и друштвених мрежа); \n" +
            "- јавна површина, заштита животне средине; \n" +
            "- психолошко-педагошка подршка; \n" +
            "- промоција здравих стилова живота; \n" +
            "- образовне активности; \n" +
            "- слободне и креативне активности; \n",
        15,
        startY
    )
    startY = startY + 48

    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text("ЧЛАН 2. РОК ТРАЈАЊА УГОВОРА", 15, startY)
    startY = startY + 5

    pdf.setFont("Montserrat-Medium", "normal")
    const value6 = "2.1. Овај Уговор подразумева континуирано, ** дугорочно волонтирање."
    value6.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 15
    startY = startY + 3

    const value7 =
        "2.2. Волонтирање ће се вршити од ** " +
        contractFrom.format("DD.MM.YYYY") +
        " ** до ** " +
        contractUntil.format("DD.MM.YYYY") +
        " ** године."
    value7.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 15
    startY = startY + 5

    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text("ЧЛАН 3. МЕСТО И ВРЕМЕ ВОЛОНТИРАЊА", 15, startY)
    startY = startY + 5

    const value8 = "**3.1. Место волонтирања одређује се у граду пребивалишта**  или  боравишта волонтера, у зависности"
    value8.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 15
    startY = startY + 3

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(
        "од облика волонтирања (трајање волонтирања укључујући и онлајн), програма (или програма) у којима \n" +
            "волонтер учествује. Наведене информације су приказане у документима о обрачуну волонтирања од \n" +
            "стране Организатора волонтирања.",
        15,
        startY
    )
    startY = startY + 11

    const value9 = "**3.2. Трајање (време волонтерске службе)** одређује се у износу **од најмање 10 часова недељно.**"
    value9.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 15
    startY = startY + 5

    pdf.text(
        "3.3. Волонтер може бити укључен у догађаје у другом граду ван места пребивалишта или  боравишта. \n\n" +
            "3.4. Волонтер има право на накнаду путних трошкова до места волонтирања и назад, ако се \n" +
            "волонтирање одвија ван места наведеног у тачки 3.1. \n\n" +
            "3.5. Волонтер се обавезује да ће о промени пребивалишта или  боравишта одмах обавестити \n" +
            "Организатора волонтирања са навођењем новог пребивалишта или  боравишта најкасније 5 дана унапред.",
        15,
        startY
    )
    startY = 20

    pdf.addPage()
    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text("ЧЛАН 4. ПРАВА И ОБАВЕЗЕ СТРАНАКА", 15, startY)
    startY = startY + 5

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(
        "4.1. Волонтер има право да се упозна са условима волонтирања, услугама и активностима које ће \n" +
            "обављати;",
        15,
        startY
    )
    startY = startY + 8

    pdf.text(
        "4.2. Уколико волонтер нема осигурање за случај повреде и професионалне болести током волонтирања, \n" +
            "осигурање обезбеђује организатор волонтирања.",
        15,
        startY
    )
    startY = startY + 8

    const value10 = "4.2.1. **Место и облик волонтирања** и друга питања утврђују се на основу упитника / изјаве о"
    value10.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 15
    startY = startY + 3

    pdf.text(
        "приступању.  \n\n" +
            "4.3. Волонтер није у обавези да волонтира у складу са упутствима организатора волонтирања:  \n\n" +
            "- ако извршење налога може угрозити живот и здравље волонтера, корисника волонтирања или других лица; \n\n" +
            "- ако је садржина упутства морално неприхватљива за волонтера, корисника волонтирања или другог лица; \n\n" +
            "- ако је упутство супротно закону или овом уговору о волонтирању; \n\n" +
            "- ако примена упутства може проузроковати штету волонтеру, кориснику волонтирања или трећем лицу, \n\n" +
            "у том случају волонтер је дужан да писменим путем упозори Организатора волонтирања. \n\n" +
            "4.4. Волонтер је у потпуности одговоран за штету коју намерно или крајњом непажњом проузрокује \n" +
            "организатору волонтирања, обављањем волонтерске службе или активности. \n\n" +
            "4.5. Волонтер се обавезује да чува информације и личне податке добијене током волонтирања и да неће \n" +
            "дозволити откривање било каквих информација добијених у интеракцији са Организатором волонтирања, \n" +
            "обављањем волонтерских активности без писмене сагласности Организатора волонтирања. \n\n" +
            "4.6. Волонтер има право на безбедне и здраве услове рада и средства и опрему за личну заштиту, у \n" +
            "складу са природом волонтерских услуга и активности које се обављају у складу са законом о праву о \n" +
            "безбедности и здрављу на раду („Службени гласник РС“, бр. 35/2023). \n\n" +
            "4.7. Волонтер се обавезује да обавести организатора волонтирања о битним околностима које утичу или \n" +
            "могу утицати на обављање волонтерских услуга и активности или које угрожавају његов живот или \n" +
            "здравље, односно живот или здравље лица са којима контактира током волонтирања. \n\n" +
            "4.8. Волонтер је дужан да услуге пружа лично и непосредно у складу са правилима струке и \n" +
            "професионалне етике, када је за пружање услуга потребно стручно знање, непристрасно, без обзира на \n" +
            "лична својства корисника; \n\n" +
            "4.9. Организатор волонтирања је дужан да води евиденцију о волонтирању. \n\n" +
            "4.10. Организатор волонтирања, при првој организацији волонтирања, дужан је да поднесе \n" +
            "Министарству рада пријаву за организовање волонтирања које се спроводи у складу са одредбама овог \n" +
            "Закона о волонтирању. \n\n" +
            "4.11. Организатор волонтирања се обавезује да волонтеру изда потврду о волонтирању \n" +
            "са наведеним временом волонтирања. \n\n" +
            "4.12. Организатор волонтерских активности обезбеђује волонтеру одговарајућу обуку о волонтирању. \n" +
            "Обука се може одвијати у формату редовне, ванредне или онлајн обуке. Облик, методе, време потребно  \n" +
            "за обуку утврђује Организатор волонтирања.",
        15,
        startY
    )
    startY = startY + 110

    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text("ЧЛАН 5. УСЛОВИ РАСКИДА УГОВОРА", 15, startY)
    startY = startY + 6

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(
        "5.1. Волонтер може у свако доба раскинути уговор о волонтирању на начин прописан за његово\n" +
            "закључење, без обавезе навођења разлога. \n\n" +
            "5.2. Организатор волонтирања може раскинути уговор о волонтерству:",
        15,
        startY
    )
    startY = 20

    pdf.addPage()

    pdf.text(
        "1) када нестане потребе за волонтирањем; \n\n" +
            "2) ако не може да обезбеди услове за даље волонтирање; \n\n" +
            "3) ако волонтер не испуњава уговорне обавезе;  \n\n" +
            "4) ако волонтер својом активношћу ствара опасност за корисника волонтирања;",
        15,
        startY
    )
    startY = startY + 24

    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text("ЧЛАН 6. ПРИМЕНА ЗАКОНА И СЛУЧАЈ  СПОРА", 15, startY)
    startY = startY + 6

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(
        "6.1. На сва питања која нису уређена овим уговором примењују се одредбе Закона и других важећих \n" +
            "правила у Републици Србији. \n\n" +
            "6.2. Уговорне стране сагласне су да сваки спор из овог уговора или у вези са овим уговором биће коначно \n" +
            "решен арбитражом у складу са правилником сталне арбитраже при Удружењу \n" +
            '"Руска дијаспора у Србији" у Новом Саду. \n\n' +
            "6.3. Овај Уговор ступа на снагу даном потписивања од стране овлашћених лица уговорних страна. \n\n" +
            "6.4. Овај уговор је сачињен у 2 (два) истоветна примерка, по један за сваку уговорну страну.",
        15,
        startY
    )
    startY = startY + 26

    pdf.setFontSize(4.5)
    pdf.text("Прилог 1. из тачке 4.2.1. члана 4 овог  уговора ", 15, startY)
    startY = startY + 10

    pdf.setFontSize(6)
    pdf.setFont("Montserrat-Bold", "bold")
    pdf.text('Удружење грађана "РУСКА ДИЈАСПОРА   \n' + 'У СРБИJИ" ', 15, startY)
    startY = startY + 9

    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text(
        "Број текућег рачуна 200-3624860101038-38  \n\n" +
            "Банка Поштанска Штедионица,   \n\n" +
            "матични број: 28355122 ПИБ: 113526376,  \n\n" +
            "Телефон 062 154 78 93 \n\n" +
            "Председник  \n\n" +
            "потпис ______________ ЛЕОНИД СТЕЦЕНКО ",
        15,
        startY
    )
    startY = startY - 9

    pdf.line(70, startY, 70, startY + 35)

    startX = 80
    const value11 = "**" + fullName + "** рођен **" + birthDate + "** "
    value11.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 80
    startY = startY + 5
    pdf.setFont("Montserrat-Medium", "normal")
    pdf.text("Адреса: ", startX, startY)

    startY = startY + 3
    pdf.setFont("Montserrat-Bold", "bold")
    startY = wrapText(pdf, "Србиjа, " + address, 45, startX, startY, 3)

    startY = startY + 6
    const value13 = "Пасош: **" + passport + "** "
    value13.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 80
    startY = startY + 6

    const value14 = "Телефон: **" + phone + "** "
    value14.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 80
    startY = startY + 6

    const value15 = "E-mail: **" + email + "** "
    value15.split("**").map((text1, i) => {
        pdf.setFont("Montserrat-Bold", "bold")
        if (i % 2 === 0) {
            pdf.setFont("Montserrat-Medium", "normal")
        }
        pdf.text(text1, startX, startY)
        startX = startX + pdf.getStringUnitWidth(text1) * 2.1
    })

    startX = 80
    startY = startY + 9

    pdf.text("потпис __________________ " + fullName, 80, startY)

    pdf.save(`Ugovor_${fullName.replace(" ", "_")}.pdf`)
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
