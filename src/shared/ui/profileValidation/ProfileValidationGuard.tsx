import { useEffect } from "react"
import { useLocation } from "react-router"
import { useProfileValidation } from "src/app/providers/ProfileValidationProvider"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"

interface ProfileValidationGuardProps {
    children: React.ReactNode
}

export const ProfileValidationGuard = ({ children }: ProfileValidationGuardProps) => {
    const { isProfileComplete, setShowProfileModal } = useProfileValidation()
    const { user } = useContext(UserContext)
    const location = useLocation()

    useEffect(() => {
        // Если пользователь не авторизован, не проверяем профиль
        if (!user) {
            return
        }

        // Показываем модалку только если профиль не заполнен и мы не на странице профиля
        const isOnOwnProfile = location.pathname === `/profile/${user.username}`
        
        if (!isProfileComplete && !isOnOwnProfile) {
            setShowProfileModal(true)
        } else if (isOnOwnProfile) {
            // Если на странице профиля, скрываем модальное окно
            setShowProfileModal(false)
        }
    }, [isProfileComplete, user, location.pathname, setShowProfileModal])

    return <>{children}</>
} 