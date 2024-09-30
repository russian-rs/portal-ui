import { IconSettings, IconSettingsFilled } from "@tabler/icons-react"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"
import classes from "./Profile.module.scss"
import {
    Avatar,
    Button,
    Container,
    Flex,
    SimpleGrid,
    Text,
} from "@mantine/core"

export const Profile = () => {
    const { user } = useContext(UserContext)

    return (
        <>
            <Flex direction="column">
                <Container className={classes.upperSpace} />
                <SimpleGrid
                    cols={{ base: 1, sm: 1, lg: 2 }}
                    spacing={{ base: 10, sm: "xl" }}
                    verticalSpacing="sm"
                >
                    <Flex direction="column" className={classes.commonInfo}>
                        <Flex>
                            <Avatar
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                                className={classes.avatar}
                            />
                            <Button
                                className={classes.settingsButton}
                                leftSection={<IconSettingsFilled size={18} />}
                                variant="transparent"
                            >
                                Настройки
                            </Button>
                        </Flex>
                        <Text className={classes.userName}>
                            {user?.fullName}
                        </Text>
                        <Text c="dimmed" className={classes.programDescription}>
                            IT волонтер
                        </Text>
                        <Container className={classes.divider} />
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Email
                            </Text>
                            <Text size="sm" mt={5}>
                                {user?.email}
                            </Text>
                        </Flex>
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Город
                            </Text>
                            <Text size="sm" mt={5}>
                                Beograd
                            </Text>
                        </Flex>
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Вид на жительство
                            </Text>
                            <Text size="sm" mt={5}>
                                До 19.02.2025
                            </Text>
                        </Flex>
                        <Button
                            className={classes.prolongationButton}
                            variant="light"
                        >
                            Продлить договор
                        </Button>
                    </Flex>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Profile
