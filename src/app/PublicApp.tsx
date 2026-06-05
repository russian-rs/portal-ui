import { AppShell, AppShellHeader, Flex, Group, ScrollArea } from "@mantine/core"
import { ProgramsProvider } from "src/app/providers/ProgramsProvider"
import { ProjectsProvider } from "src/app/providers/ProjectsProvider"
import PublicRouter from "src/app/router/PublicRouter"
import classes from "src/app/styles/public.module.scss"
import { PublicProgramsApiService } from "src/shared/api/PublicProgramsApiService"
import { PublicProjectsApiService } from "src/shared/api/PublicProjectsApiService"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import { LoginButton } from "src/shared/ui/loginButton/LoginButton"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"

// @ts-ignore
const PublicApp = () => {
    return (
        <>
            <ProgramsProvider apiService={PublicProgramsApiService}>
                <ProjectsProvider apiService={PublicProjectsApiService}>
                    <AppShell className={classes.appShell}>
                        <AppShellHeader className={classes.appShellHeader}>
                            <Group justify="space-between">
                                <Group>
                                    <LoginButton />
                                </Group>
                                <Group justify="flex-end">
                                    <LocaleSwitcher />
                                    <ThemeSwitcher />
                                </Group>
                            </Group>
                        </AppShellHeader>
                        <ScrollArea className={classes.appShellMainScroll}>
                            <Flex className={classes.appShellMainScroll}>
                                <Flex className={classes.appShellMain} align="center" justify="center">
                                    <PublicRouter />
                                </Flex>
                            </Flex>
                        </ScrollArea>
                    </AppShell>
                </ProjectsProvider>
            </ProgramsProvider>
        </>
    )
}

export default PublicApp
