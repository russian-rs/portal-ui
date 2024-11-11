import { Container, Flex, SimpleGrid, Skeleton, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import commonClasses from "src/app/styles/private.module.scss"
import { ProfileAvatar } from "src/pages/profile/ui/avatar/ProfileAvatar"
import { CommonInfoContainer } from "src/pages/profile/ui/CommonInfoContainer"
import { UserApiService } from "src/shared/api/UserApiService"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import classes from "./Profile.module.scss"

export const Profile = () => {
    useSetDocumentTitleByLocale("pages.profile.documentTitle")

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
                            <ProfileAvatar link={userInfo?.avatar?.link} />
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
