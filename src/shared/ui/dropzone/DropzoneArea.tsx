import { Flex, Group, rem, Text } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { IconFiles, IconUpload, IconX } from "@tabler/icons-react"

export const DropzoneArea = () => {
    return (
        <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={10 * 1024 ** 2}
        >
            <Group justify="center" gap="xl" style={{ pointerEvents: "none" }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-blue-6)",
                        }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-red-6)",
                        }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconFiles
                        style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-dimmed)",
                        }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    style={{ textAlign: "center" }}
                >
                    <Text size="md" inline>
                        Перенесите файлы или нажмите для выбора
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Можно приложить до 4-х файлов, макс. размер 10 Мб
                    </Text>
                </Flex>
            </Group>
        </Dropzone>
    )
}
