import { Image, Modal, ScrollArea } from "@mantine/core"
import React, { useState } from "react"
import classes from "./ImagePreview.module.scss"

interface ImagePreviewProps {
    link: string
    className?: string
}

export const ImagePreview = ({ link, className }: ImagePreviewProps) => {
    const [open, setOpen] = useState(false)

    return (
        <div key={link}>
            <Image
                src={link}
                className={className}
                onClick={() => {
                    setOpen(true)
                }}
            />
            <Modal
                opened={open}
                overlayProps={{
                    backgroundOpacity: 0.6,
                    blur: 5,
                }}
                styles={{
                    header: {
                        width: "100%",
                        padding: "1rem",
                        position: "absolute",
                        backgroundColor: "transparent",
                    },
                    close: {
                        marginLeft: "auto",
                        backgroundColor: "white",
                    },
                }}
                padding={0}
                onClose={() => setOpen(false)}
                className={classes.modal}
                size="auto"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <Image src={link} className={classes.fullSize} />
            </Modal>
        </div>
    )
}
