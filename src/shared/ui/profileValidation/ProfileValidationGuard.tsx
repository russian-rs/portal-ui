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
        if (!user) {
            return
        }
        const isOnOwnProfile = location.pathname === `/profile/${user.username}`

        if (!isProfileComplete && isOnOwnProfile) {
            setShowProfileModal(true)
        } else {
            setShowProfileModal(false)
        }
    }, [isProfileComplete, user, location.pathname, setShowProfileModal])

    return <>{children}</>
}
