export interface TaskTranslationSource {
    name: string
    description: string
    nameSr?: string | null
    descriptionSr?: string | null
}

const normalizeTaskText = (value?: string | null): string => {
    return value?.trim() || ""
}

const hasAlternateText = (defaultValue?: string | null, translatedValue?: string | null): boolean => {
    const normalizedDefaultValue = normalizeTaskText(defaultValue)
    const normalizedTranslatedValue = normalizeTaskText(translatedValue)

    return normalizedTranslatedValue.length > 0 && normalizedTranslatedValue !== normalizedDefaultValue
}

export const hasTaskTranslation = (task: TaskTranslationSource): boolean => {
    return (
        hasAlternateText(task.name, task.nameSr) ||
        hasAlternateText(task.description, task.descriptionSr)
    )
}

export const getTaskDisplayName = (task: TaskTranslationSource, showTranslation: boolean): string => {
    if (showTranslation && hasAlternateText(task.name, task.nameSr)) {
        return normalizeTaskText(task.nameSr)
    }

    return normalizeTaskText(task.name)
}

export const getTaskDisplayDescription = (task: TaskTranslationSource, showTranslation: boolean): string => {
    if (showTranslation && hasAlternateText(task.description, task.descriptionSr)) {
        return normalizeTaskText(task.descriptionSr)
    }

    return normalizeTaskText(task.description)
}
