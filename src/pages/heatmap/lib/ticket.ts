import dayjs from "dayjs"

interface VolunteerHoursWarningParams {
    startDate: dayjs.Dayjs
    required: number
    worked: number
}

export function getTicketBody({ startDate, required, worked }: VolunteerHoursWarningParams): string {
    const startStr = startDate.format("DD.MM.YYYY")
    const nowStr = dayjs().format("DD.MM.YYYY")
    const deficit = Math.max(required - worked, 0)

    const deficitPart = deficit > 0 ? ` (недостача <strong>${deficit}</strong> часов)` : ""

    return `
        <p>Добрый день,</p>
       
        <p>
        За период с <strong>${startStr}</strong> по <strong>${nowStr}</strong> по вашему волонтёрскому контракту 
        должно быть отработано <strong>${required}</strong> часов. По принятым отчётам за данный период зафиксировано 
        <strong>${worked}</strong> часов${deficitPart}.
        </p>
        
        <p>
        В соответствии с Законом о волонтирању ("Службени гласник РС", бр. 36/2010) и договором продолжительность 
        (рабочее время волонтера) определяется в размере не менее 10 часов в неделю в течение срока договора.
        </p>
        
        <p>
        Просим в течение трёх рабочих дней ответным письмом направить ваш план по отработке недостающих часов и, при 
        необходимости, пояснения по текущей нагрузке. Если вы считаете, что расчеты ошибочны, просьба нам сообщить.
        </p>
    `.trim()
}
