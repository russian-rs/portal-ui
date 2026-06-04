import { Badge } from "@mantine/core"

export function IDBadge(props: { id: number }) {
    return (
        <Badge color="teal" variant="light" radius="sm" mt={4} style={{ alignSelf: "flex-start" }}>
            RDV-{props.id}
        </Badge>
    )
}
