import { Container, Flex, SimpleGrid, Skeleton } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { useProfileValidation } from "src/app/providers/ProfileValidationProvider"
import { UserContext } from "src/app/providers/UserContext"
import { ContractInfo } from "src/pages/profile/contract/ContractInfo"
import { ProfileInfo } from "src/pages/profile/info/ProfileInfo"
import { ResidencePermitInfo } from "src/pages/profile/residencePermit/ResidencePermitInfo"
import { UserApiService } from "src/shared/api/user/UserApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import classes from "./Profile.module.scss"

export const Profile = () => {
    setDocumentTitleByLocale("pages.profile.documentTitle")

    const { login } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const { setShowProfileModal } = useProfileValidation()
    const { user: currentUser } = useContext(UserContext)
    const intl = useIntl()

    if (!login) {
        navigate("/not-found")
    }

    const {
        data: userInfo,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["getInfo", login],
        queryFn: () =>
            UserApiService.getInfo(login!!).then((response) => {
                setLoading(false)
                return response.data
            }),
    })

    const handleUserInfoUpdate = () => {
        refetch()
    }

    // Показываем модальное окно при загрузке страницы профиля, если это профиль текущего пользователя и он не заполнен
    useEffect(() => {
        if (userInfo && currentUser && userInfo.username === currentUser.username) {
            const missingFields = []

            if (!userInfo.avatar?.link)
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.avatar" }))
            if (!userInfo.city?.trim())
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.city" }))
            if (!userInfo.postalCode?.trim())
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.postalCode" }))
            if (!userInfo.address?.trim())
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.address" }))
            if (!userInfo.birthDate)
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.birthDate" }))
            if (!userInfo.telegram?.trim())
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.telegram" }))
            if (!userInfo.phone?.trim())
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.phone" }))
            if (!userInfo.program?.code)
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.program" }))
            if (!userInfo.project?.code)
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.project" }))
            if (!userInfo.gender)
                missingFields.push(intl.formatMessage({ id: "pages.profile.validation.fields.gender" }))

            if (missingFields.length > 0) {
                setShowProfileModal(true)
            }
        }
    }, [userInfo, currentUser, setShowProfileModal, intl])

    if (loading) {
        return <CustomLoader visible={true} className={classes.loader} />
    }

    return (
        <>
            <Flex direction="column">
                <CustomLoader visible={isFetching} className={classes.loader} />
                <Container className={classes.upperSpace} />
                <SimpleGrid
                    cols={{ base: 1, "40rem": 2, "70rem": 3 }}
                    spacing={{ base: "1rem" }}
                    type="container"
                    className={classes.root}
                >
                    <Skeleton visible={isFetching} radius="lg">
                        <ProfileInfo userInfo={userInfo} onUserInfoUpdate={handleUserInfoUpdate} />
                    </Skeleton>
                    <Skeleton visible={isFetching} radius="lg">
                        <Flex direction="column" gap="md">
                            {userInfo?.contracts && <ContractInfo userInfo={userInfo} contracts={userInfo.contracts} />}
                            {userInfo && (
                                <ResidencePermitInfo
                                    userInfo={userInfo}
                                    residencePermits={(userInfo as any).residencePermits || []}
                                    onUpdate={handleUserInfoUpdate}
                                />
                            )}
                        </Flex>
                    </Skeleton>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Profile
