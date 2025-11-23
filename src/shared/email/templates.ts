import acceptDocs from "src/assets/email_templates/accept_docs"
import denyCommon from "src/assets/email_templates/deny_common"
import onlineDocs from "src/assets/email_templates/online_docs"
import sendDocs from "src/assets/email_templates/send_docs"
import waitApplication from "src/assets/email_templates/wait_application"
import waitFee from "src/assets/email_templates/wait_fee"
import EmailTemplate from "src/shared/email/EmailTemplate"

export const applicationTemplates: EmailTemplate[] = [
    {
        name: "Ожидание анкеты",
        topic: "Ожидаем ваши документы",
        content: waitApplication,
    },
    {
        name: "Ожидание взноса",
        topic: "Ожидаем оплату членского взноса",
        content: waitFee,
    },
    {
        name: "Направляем документы",
        topic: "Направляем документы",
        content: onlineDocs,
    },
    {
        name: "Документы получены",
        topic: "Мы получили ваши документы",
        content: acceptDocs,
    },
    {
        name: "Документы отправлены",
        topic: "Мы отправили ваши документы",
        content: sendDocs,
    },
    {
        name: "Отказ (основная)",
        topic: "Ваша заявка на волонтерство",
        content: denyCommon,
    },
]

export default applicationTemplates
