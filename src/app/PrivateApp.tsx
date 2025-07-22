import { AppShell, ScrollArea } from "@mantine/core"
import { NavbarContextProvider } from "src/app/providers/NavbarProvider"
import { ProgramsProvider } from "src/app/providers/ProgramsProvider"
import { ProjectsProvider } from "src/app/providers/ProjectsProvider"
import PrivateRouter from "src/app/router/PrivateRouter"
import classes from "src/app/styles/private.module.scss"
import AppHeader from "src/shared/ui/appHeader/AppHeader"
import { AppNavbar } from "src/shared/ui/appNavbar/AppNavbar"

const PrivateApp = () => {
    return (
        <>
            <NavbarContextProvider>
                <ProgramsProvider>
                    <ProjectsProvider>
                        <AppShell className={classes.appShell}>
                            <AppHeader />
                            <AppNavbar />
                            <AppShell.Main className={classes.appShellMain}>
                                <ScrollArea className={classes.appShellMainScroll}>
                                    <PrivateRouter />
                                </ScrollArea>
                            </AppShell.Main>
                        </AppShell>
                    </ProjectsProvider>
                </ProgramsProvider>
            </NavbarContextProvider>
        </>
    )
}

export default PrivateApp
