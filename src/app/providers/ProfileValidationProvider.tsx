import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react"
import { useIntl } from "react-intl"
import { useLocation, useNavigate } from "react-router"
import { UserContext } from "./UserContext"

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
    const navigate = useNavigate()
    const location = useLocation()

    const { isProfileComplete, missingFields } = useMemo(() => {
        if (!user) {
            return { isProfileComplete: true, missingFields: [] }
        }

        const missing: string[] = []

        // if (!user.avatar?.link) {
        //     missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.avatar" }))
        // }

        if (!user.city?.trim()) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.city" }))
        }

        if (!user.postalCode?.trim()) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.postalCode" }))
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

        if (!user.gender) {
            missing.push(intl.formatMessage({ id: "pages.profile.validation.fields.gender" }))
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

    // Проверяем профиль при заходе на сайт и делаем редирект если не заполнен
    useEffect(() => {
        if (user && !isProfileComplete) {
            const isOnOwnProfile = location.pathname === `/profile/${user.username}`
            const isOnLoginPage = location.pathname === "/login"

            if (!isOnOwnProfile && !isOnLoginPage) {
                navigate(`/profile/${user.username}`, { replace: true })
            }
        }
    }, [user, isProfileComplete, location.pathname, navigate])

    const openEditProfile = () => {
        setShowProfileModal(false)
        if (user) {
            navigate(`/profile/${user.username}`)
        }
    }

    const contextValue: ProfileValidationContextType = {
        isProfileComplete,
        missingFields,
        showProfileModal,
        setShowProfileModal,
        openEditProfile,
    }

    return <ProfileValidationContext.Provider value={contextValue}>{children}</ProfileValidationContext.Provider>
}

export const useProfileValidation = () => {
    const context = useContext(ProfileValidationContext)
    if (!context) {
        throw new Error("useProfileValidation must be used within ProfileValidationProvider")
    }
    return context
}
