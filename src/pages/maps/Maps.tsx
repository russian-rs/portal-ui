import { Flex } from "@mantine/core"
import React from "react"
import MapComponent from "./components/MapComponent"
import classes from "./Maps.module.scss"

export const Maps = () => {
    return (
        <Flex className={classes.root}>
            <MapComponent />
        </Flex>
    )
}

export default Maps
