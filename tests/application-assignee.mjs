// Start Vite first; all API traffic is mocked. No live application data is changed.
import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import { chromium } from "playwright"

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3017"
const output = process.env.TEST_OUTPUT_DIR || "/tmp/portal-assignee-browser"
await mkdir(output, { recursive: true })
const photo =
    "data:image/svg+xml," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#1971c2"/><circle cx="32" cy="24" r="12" fill="#ffe0bd"/><path d="M8 64a24 24 0 0 1 48 0" fill="#ddd"/></svg>'
    )
const employee = {
    id: 1,
    username: "employee",
    fullName: "Elena Petrova",
    email: "elena@example.com",
    groups: ["ADMIN_VOLUNTEER"],
    avatar: { link: photo },
    city: "Belgrade",
    postalCode: "11000",
    address: "Test Street",
    birthDate: "1990-01-01",
    telegram: "elena",
    phone: "+3811111111",
    gender: "FEMALE",
    program: { code: "IT" },
    project: { code: "PORTAL" },
}
const other = {
    ...employee,
    id: 2,
    username: "interviewer",
    fullName: "Ivan Ivanov",
    groups: ["INTERVIEWER"],
    avatar: null,
}
const browser = await chromium.launch({ headless: true, channel: process.env.TEST_BROWSER_CHANNEL || undefined })
try {
    for (const viewport of [
        { width: 1440, height: 1000 },
        { width: 390, height: 844 },
    ]) {
        const context = await browser.newContext({ viewport })
        await context.addInitScript(
            ({ employee }) => {
                localStorage.setItem("user", JSON.stringify(employee))
                localStorage.setItem("lastLogin", JSON.stringify(new Date()))
                localStorage.setItem("locale", JSON.stringify("en"))
            },
            { employee }
        )
        const page = await context.newPage()
        page.on("requestfailed", (request) => console.error("FAILED", request.url(), request.failure()?.errorText))
        page.on("response", async (response) => {
            if (response.status() >= 400 && !response.url().includes("/api/"))
                console.error(response.status(), response.url(), (await response.text()).slice(0, 500))
        })
        const errors = []
        page.on("pageerror", (error) => errors.push(error.message))
        let application = {
            id: "11111111-1111-4111-8111-111111111111",
            name: "Test Applicant",
            email: "applicant@example.com",
            created: "2026-09-01T12:00:00Z",
            status: "CREATED",
            type: "NEW",
            assignee: "employee",
            notes: [],
        }
        const writes = []
        let failNextUpdate = false
        let failNextAssignment = false
        await page.route(`${baseURL}/api/**`, async (route) => {
            const request = route.request()
            const path = new URL(request.url()).pathname.replace(/^\/api/, "")
            const data = request.postDataJSON()
            let response = []
            if (path === "/applications")
                response = {
                    content: [
                        application,
                        {
                            ...application,
                            id: "22222222-2222-4222-8222-222222222222",
                            name: "Unassigned Applicant",
                            assignee: null,
                        },
                    ],
                    page: { pageNumber: 0, pageSize: 25, totalElements: 2, totalPages: 1 },
                }
            else if (path === "/user/resolve")
                response = [employee, other].filter((user) => data.includes(user.username))
            else if (path === "/application/assignees") response = [employee, other]
            else if (path === `/application/${application.id}/assignee`) {
                writes.push({ path, data })
                if (failNextAssignment) {
                    failNextAssignment = false
                    await route.fulfill({ status: 500, json: { message: "Test assignment failed" } })
                    return
                }
                application = { ...application, assignee: data.assignee }
                response = application
            } else if (path === "/application/update") {
                writes.push({ path, data })
                if (failNextUpdate) {
                    failNextUpdate = false
                    await route.fulfill({ status: 500, json: { message: "Test update failed" } })
                    return
                }
                application = {
                    ...application,
                    ...data,
                    assignee:
                        data.status && data.status !== application.status ? employee.username : application.assignee,
                }
                response = application
            } else if (path === `/application/${application.id}`) response = application
            else if (path === `/application/${application.id}/note`) {
                writes.push({ path, data })
                const note = {
                    id: "33333333-3333-4333-8333-333333333333",
                    text: data.text,
                    createdBy: employee.username,
                    createTime: new Date().toISOString(),
                }
                application = { ...application, notes: [note] }
                response = note
            }
            await route.fulfill({ json: response })
        })
        await page.goto(`${baseURL}/applications`)
        const assignedAvatar = page.getByLabel("Assignee: Elena Petrova", { exact: true })
        await assignedAvatar.waitFor().catch(async (error) => {
            console.error(page.url(), errors, await page.locator("body").innerText())
            await page.screenshot({ path: `${output}/failure.png`, fullPage: true })
            throw error
        })
        await page.getByLabel("Unassigned", { exact: true }).waitFor()
        assert.equal(await assignedAvatar.locator("img").getAttribute("src"), photo)
        const radius = await assignedAvatar.evaluate((el) => getComputedStyle(el).borderRadius)
        assert.notEqual(radius, "0px")
        await assignedAvatar.hover()
        await page.getByRole("tooltip", { name: "Assignee: Elena Petrova" }).waitFor()
        await page.mouse.move(0, 0)
        assert.equal(writes.length, 0, "Loading list must not write")
        await page.screenshot({ path: `${output}/list-${viewport.width}.png`, fullPage: true })

        await page.goto(`${baseURL}/application/${application.id}`)
        const select = page.getByRole("textbox", { name: "Assignee", exact: true })
        await select.waitFor()
        await page.waitForLoadState("networkidle")
        assert.equal(writes.length, 0, "Loading detail must not write")
        await select.click()
        await page.getByRole("option", { name: "Ivan Ivanov" }).click()
        await page.waitForFunction(() => document.querySelector('input[value="Ivan Ivanov"]'))
        assert.equal(writes.length, 1, "Manual selection sends only one request")
        assert.deepEqual(writes[0].data, { assignee: "interviewer" })
        await page.goto(`${baseURL}/applications`)
        const initialsAvatar = page.getByLabel("Assignee: Ivan Ivanov", { exact: true })
        await initialsAvatar.waitFor()
        assert.equal(await initialsAvatar.locator("img").count(), 0, "Employee without photo uses initials")
        assert.equal(await initialsAvatar.innerText(), "II")
        await page.screenshot({ path: `${output}/list-initials-${viewport.width}.png`, fullPage: true })
        await page.goto(`${baseURL}/application/${application.id}`)
        await select.waitFor()
        await page.waitForLoadState("networkidle")
        assert.equal(writes.length, 1, "Reload must not save")
        assert.equal(await select.inputValue(), "Ivan Ivanov")
        await page.screenshot({ path: `${output}/detail-${viewport.width}.png`, fullPage: true })
        await page.getByRole("button", { name: "Created", exact: true }).click()
        await page.getByRole("option", { name: "Created", exact: true }).click()
        assert.equal(writes.length, 1, "Selecting same status must not write")
        await page.getByRole("button", { name: "Created", exact: true }).click()
        await page.getByRole("option", { name: "In Progress", exact: true }).click()
        await page.waitForFunction(() => document.querySelector('input[value="Elena Petrova"]'))
        assert.deepEqual(writes.at(-1).data, { id: application.id, status: "IN_PROGRESS" })
        assert.equal(writes.length, 2, "Status response must not trigger another write")
        failNextUpdate = true
        await page.getByRole("button", { name: "In Progress", exact: true }).click()
        await page.getByRole("option", { name: "Clarification", exact: true }).click()
        await page.getByText("Test update failed").waitFor()
        assert.equal(
            await page.getByRole("button", { name: "In Progress", exact: true }).count(),
            1,
            "Failed status update must display persisted status"
        )
        assert.equal(await select.inputValue(), "Elena Petrova")
        await page
            .getByLabel("Clear assignment", { exact: true })
            .click()
            .catch(async (error) => {
                console.error(await select.evaluate((el) => el.parentElement.parentElement.outerHTML))
                await page.screenshot({ path: `${output}/clear-failure.png`, fullPage: true })
                throw error
            })
        await page.waitForFunction(() => document.querySelector('input[placeholder="Unassigned"]')?.value === "")
        assert.equal(application.assignee, null)
        await page.waitForLoadState("networkidle")
        assert.equal(await select.inputValue(), "")
        failNextAssignment = true
        await select.click()
        await page.getByRole("option", { name: "Ivan Ivanov" }).click()
        await page.getByText("Test assignment failed").waitFor()
        await page.waitForLoadState("networkidle")
        assert.equal(await select.inputValue(), "", "Failed assignment must retain unassigned display")
        const beforeNote = writes.length
        await page.getByPlaceholder("Add note", { exact: true }).fill("Regression test note")
        await page.getByPlaceholder("Add note", { exact: true }).press("Enter")
        await page.getByText("Regression test note", { exact: true }).waitFor()
        await page.waitForLoadState("networkidle")
        assert.equal(writes.length, beforeNote + 1, "Note refresh must not write application")
        assert.equal(application.assignee, null)
        const beforeContract = writes.length
        await page.getByRole("button", { name: "Add", exact: true }).click()
        await page.getByRole("button", { name: "Save", exact: true }).click()
        await page.waitForLoadState("networkidle")
        assert.equal(writes.length, beforeContract + 1)
        assert.deepEqual(Object.keys(writes.at(-1).data).sort(), ["contract", "id"])
        assert.equal(application.assignee, null, "Contract edit must not assign employee")
        await page.goto(`${baseURL}/applications`)
        const beforeListStatus = writes.length
        await page.getByRole("button", { name: "In Progress", exact: true }).first().click()
        await page.getByRole("option", { name: "Created", exact: true }).click()
        await page.getByLabel("Assignee: Elena Petrova", { exact: true }).waitFor()
        assert.equal(writes.length, beforeListStatus + 1)
        assert.deepEqual(writes.at(-1).data, { id: application.id, status: "CREATED" })
        assert.deepEqual(errors, [], "No browser runtime errors")
        console.log(
            `PASS ${viewport.width}px: avatar, tooltip, fallback, no load writes, manual assignment, same/new status, failure, clearing, note/contract isolation, list status`
        )
        await context.close()
    }
} finally {
    await browser.close()
}
