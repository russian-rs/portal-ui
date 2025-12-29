import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Root } from "./Root"

describe("Root", () => {
    it("renders without crashing", () => {
        render(<Root />)
        expect(document.body).toBeTruthy()
    })
})
