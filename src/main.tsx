import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Root } from "src/app/Root"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Root />
    </StrictMode>
)
