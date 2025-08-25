import { Flex } from "@mantine/core"
import classes from "./CustomLoader.module.scss"

export const CustomLoader = ({ visible, className }: { visible?: boolean; className?: string }) => {
    if (visible !== undefined && !visible) {
        return <Flex className={`${className} ${classes.loaderDisabled}`} />
    }
    return <Flex className={`${className} ${classes.loader}`} />
}

export default CustomLoader
