import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Root } from "src/app/Root"
import { jsConfig } from "src/config/newrelic"

if (process.env.NODE_ENV === "production") {
    new BrowserAgent(jsConfig)
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Root />
    </StrictMode>
)
