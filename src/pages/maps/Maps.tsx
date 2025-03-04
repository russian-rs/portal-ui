import React, { useState } from "react";
import { Flex } from "@mantine/core";
import MapComponent from "./components/MapComponent";
import Terms from "./components/Terms";
import styles from "./Maps.module.scss";

export const Maps = () => {
    return (
        <Flex className={styles.root}>
            <MapComponent />
        </Flex>
    );
};

export default Maps;