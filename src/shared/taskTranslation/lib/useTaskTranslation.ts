import { useMemo, useState } from "react"
import {
    getTaskDisplayDescription,
    getTaskDisplayName,
    hasTaskTranslation,
    TaskTranslationSource,
} from "./taskTranslation"

export const useTaskTranslation = (task: TaskTranslationSource) => {
    const [showTranslation, setShowTranslation] = useState(false)

    const canToggleTranslation = useMemo(() => {
        return hasTaskTranslation(task)
    }, [task])

    const displayName = useMemo(() => {
        return getTaskDisplayName(task, showTranslation)
    }, [showTranslation, task])

    const displayDescription = useMemo(() => {
        return getTaskDisplayDescription(task, showTranslation)
    }, [showTranslation, task])

    const toggleTranslation = () => {
        if (!canToggleTranslation) return

        setShowTranslation((currentValue) => !currentValue)
    }

    return {
        canToggleTranslation,
        displayDescription,
        displayName,
        showTranslation,
        toggleTranslation,
    }
}
