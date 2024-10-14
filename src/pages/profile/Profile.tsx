import {
    Anchor,
    Avatar,
    Button,
    Container,
    Flex,
    SimpleGrid,
    Text,
} from "@mantine/core"
import { IconBrandTelegram, IconPhone } from "@tabler/icons-react"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"
import classes from "./Profile.module.scss"

export const Profile = () => {
    const { user } = useContext(UserContext)

    return (
        <>
            <Flex direction="column">
                <Container className={classes.upperSpace} />
                <SimpleGrid
                    cols={{ base: 1, sm: 1, lg: 2 }}
                    spacing={{ base: "md", sm: "xl" }}
                    verticalSpacing="sm"
                >
                    <Flex direction="column" className={classes.commonInfo}>
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
                            <Text mt={4}>{user?.email}</Text>
                        </Flex>
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Город
                            </Text>
                            <Text mt={4}>Beograd</Text>
                        </Flex>
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Дата рождения
                            </Text>
                            <Text mt={4}>03.11.1998</Text>
                        </Flex>
                        <Container className={classes.divider} />
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Telegram
                            </Text>
                            <Flex align="center" mt={4}>
                                <IconBrandTelegram size={18} />
                                <Anchor
                                    href="https://t.me/zortan3302"
                                    target="_blank"
                                >
                                    <Text ms="sm">aminovmaksim</Text>
                                </Anchor>
                            </Flex>
                        </Flex>
                        <Flex
                            className={classes.propertyBox}
                            direction="column"
                        >
                            <Text c="dimmed" size="xs">
                                Телефон
                            </Text>
                            <Flex align="center" mt={4}>
                                <IconPhone size={18} />
                                <Text ms="sm">+381677621034</Text>
                            </Flex>
                        </Flex>
                        <Button
                            className={classes.prolongationButton}
                            variant="light"
                            mt="md"
                        >
                            Редактировать
                        </Button>
                    </Flex>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Profile
