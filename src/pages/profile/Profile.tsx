import { Avatar, Container, Flex, SimpleGrid, Text } from "@mantine/core"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"
import commonClasses from "src/app/styles/private.module.scss"
import { CommonInfoContainer } from "src/pages/profile/ui/CommonInfoContainer"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import classes from "./Profile.module.scss"

export const Profile = () => {
    useSetDocumentTitleByLocale("pages.profile.documentTitle")
    const { user } = useContext(UserContext)

    return (
        <>
            <Flex direction="column">
                <Container className={classes.upperSpace} />
                <SimpleGrid
                    cols={{ base: 1, "40rem": 2, "70rem": 3 }}
                    spacing={{ base: "1rem" }}
                    verticalSpacing="sm"
                    type="container"
                >
                    <Flex direction="column" className={classes.infoContainer}>
                        <Flex>
                            <Avatar
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                                className={classes.avatar}
                            />
                            <Text className={classes.idNumber} c="dimmed">
                                ID: 1240
                            </Text>
                        </Flex>
                        <Text className={classes.userName}>
                            {user?.fullName}
                        </Text>
                        <Text c="dimmed">IT волонтер</Text>
                        <Container className={commonClasses.divider} />
                        <CommonInfoContainer />
                    </Flex>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Profile
