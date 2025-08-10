import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { useProfileValidation } from "src/app/providers/ProfileValidationProvider"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"

interface ProfileValidationGuardProps {
    children: React.ReactNode
}

export const ProfileValidationGuard = ({ children }: ProfileValidationGuardProps) => {
    const { isProfileComplete, setShowProfileModal } = useProfileValidation()
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Если пользователь не авторизован, не проверяем профиль
        if (!user) {
            return
        }

        // Если профиль не заполнен и мы не на странице профиля текущего пользователя
        const isOnOwnProfile = location.pathname === `/profile/${user.username}`
        if (!isProfileComplete && !isOnOwnProfile) {
            // Перенаправляем на страницу профиля
            navigate(`/profile/${user.username}`)
            // Модальное окно будет показано на странице профиля
        }
    }, [isProfileComplete, user, location.pathname, navigate])

    return <>{children}</>
} 