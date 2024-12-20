import { Menu } from "@mantine/core"
import { ApplicationDto } from "@russian-rs/portal-api-axios"
import { IconDotsVertical, IconEye, IconMail } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import classes from "./ApplicationMenu.module.scss"
import { locales } from "./lib/locales"

interface ApplicationMenuProps {
    applicationDto: ApplicationDto
}

export const ApplicationMenu = (props: ApplicationMenuProps) => {
    return (
        <Menu shadow="md" width={200} closeOnItemClick={false}>
            <Menu.Target>
                <IconDotsVertical size={16} className={classes.dots} />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => window.open(`/application/${props.applicationDto.id}`)}
                >
                    <FormattedMessage id={locales.view} />
                </Menu.Item>
                <Menu.Item disabled={true} leftSection={<IconMail size={14} />}>
                    <FormattedMessage id={locales.contact} />
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
