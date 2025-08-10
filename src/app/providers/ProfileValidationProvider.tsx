import { UserInfoDto } from "@russian-rs/portal-api-axios"
import React, { createContext, ReactNode, useContext, useMemo } from "react"
import { UserContext } from "./UserContext"
import { useIntl } from "react-intl"
import dayjs from "dayjs"

interface ProfileValidationContextType {
    isProfileComplete: boolean
    missingFields: string[]
    showProfileModal: boolean
    setShowProfileModal: (show: boolean) => void
    openEditProfile: () => void
}

const defaultContextValue: ProfileValidationContextType = {
    isProfileComplete: true,
    missingFields: [],
    showProfileModal: false,
    setShowProfileModal: () => {},
    openEditProfile: () => {},
}

export const ProfileValidationContext = createContext<ProfileValidationContextType>(defaultContextValue)

export const ProfileValidationProvider = ({ children }: { children?: ReactNode }) => {
    const { user } = useContext(UserContext)
    const [showProfileModal, setShowProfileModal] = React.useState(false)
    const intl = useIntl()

    const { isProfileComplete, missingFields } = useMemo(() => {
        if (!user) {
            return { isProfileComplete: true, missingFields: [] }
        }

        const missing: string[] = []

        if (!user.avatar?.link) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.avatar" }))
        }

        if (!user.city?.trim()) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.city" }))
        }

        if (!user.address?.trim()) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.address" }))
        }

        if (!user.birthDate) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.birthDate" }))
        }

        if (!user.telegram?.trim()) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.telegram" }))
        }

        if (!user.phone?.trim()) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.phone" }))
        }

        if (!user.program?.code) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.program" }))
        }

        if (!user.project?.code) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.project" }))
        }

        return {
            isProfileComplete: missing.length === 0,
            missingFields: missing,
        }
    }, [user, intl])

    // Автоматически скрываем модальное окно, когда профиль заполнен
    React.useEffect(() => {
        if (isProfileComplete && showProfileModal) {
            setShowProfileModal(false)
        }
    }, [isProfileComplete, showProfileModal])

    const openEditProfile = () => {
        setShowProfileModal(false)
        const editButton = document.querySelector('[data-edit-profile-button]') as HTMLButtonElement
        if (editButton) {
            editButton.click()
        }
    }

    const contextValue: ProfileValidationContextType = {
        isProfileComplete,
        missingFields,
        showProfileModal,
        setShowProfileModal,
        openEditProfile,
    }

    return (
        <ProfileValidationContext.Provider value={contextValue}>
            {children}
        </ProfileValidationContext.Provider>
    )
}

export const useProfileValidation = () => {
    const context = useContext(ProfileValidationContext)
    if (!context) {
        throw new Error("useProfileValidation must be used within ProfileValidationProvider")
    }
    return context
} 