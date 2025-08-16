import { Container, Flex, SimpleGrid, Skeleton } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ContractInfo } from "src/pages/profile/contract/ContractInfo"
import { ProfileInfo } from "src/pages/profile/info/ProfileInfo"
import { UserApiService } from "src/shared/api/user/UserApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import classes from "./Profile.module.scss"

export const Profile = () => {
    setDocumentTitleByLocale("pages.profile.documentTitle")

    const { login } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

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
                        <Flex direction="column">
                            {userInfo?.contracts && <ContractInfo userInfo={userInfo} contracts={userInfo.contracts} />}
                        </Flex>
                    </Skeleton>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Profile
