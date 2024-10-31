import {
    Avatar,
    Container,
    Flex,
    SimpleGrid,
    Skeleton,
    Text,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "src/app/providers/UserContext"
import commonClasses from "src/app/styles/private.module.scss"
import { CommonInfoContainer } from "src/pages/profile/ui/CommonInfoContainer"
import { UserApiService } from "src/shared/api/UserApiService"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import classes from "./Profile.module.scss"

export const Profile = () => {
    useSetDocumentTitleByLocale("pages.profile.documentTitle")

    const { user } = useContext(UserContext)
    const { login } = useParams<{ login: string }>()

    const { data: userInfo, isFetching } = useQuery({
        queryKey: ["getInfo", login],
        queryFn: () =>
            UserApiService.getInfo(login).then((response) => response.data),
    })

    return (
        <>
            <Flex direction="column">
                <CustomLoader visible={isFetching} className={classes.loader} />
                <Container className={classes.upperSpace} />
                <SimpleGrid
                    cols={{ base: 1, "40rem": 2, "70rem": 3 }}
                    spacing={{ base: "1rem" }}
                    verticalSpacing="sm"
                    type="container"
                    className={classes.root}
                >
                    <Skeleton visible={isFetching} radius="lg">
                        <Flex
                            direction="column"
                            className={classes.infoContainer}
                        >
                            <Avatar
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                                className={classes.avatar}
                            />
                            <Text className={classes.userName}>
                                {userInfo?.fullName}
                            </Text>
                            <Text c="dimmed">{userInfo?.program}</Text>
                            <Container className={commonClasses.divider} />
                            <CommonInfoContainer userInfo={userInfo} />
                        </Flex>
                    </Skeleton>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Profile
