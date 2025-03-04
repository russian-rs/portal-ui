import React from "react";
import { Button, Checkbox, Paper, Text } from "@mantine/core";

interface TermsProps {
    onAccepted: () => void;
}

const Terms: React.FC<TermsProps> = ({ onAccepted }) => {
    const [checked, setChecked] = React.useState(false);

    return (
        <Paper shadow="md">
            <Text>Прочитайте условия и примите их:</Text>
            <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                label="Я принимаю условия"
            />
            <Button onClick={onAccepted} disabled={!checked} style={{ marginTop: "10px" }}>
                Принять
            </Button>
        </Paper>
    );
};

export default Terms;