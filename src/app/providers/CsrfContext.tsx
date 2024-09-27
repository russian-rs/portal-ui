import { createContext, ReactNode, useEffect, useState } from "react"
import { RequestHttp } from "src/shared/http/RequestHttp"
import { getCookie } from "src/shared/http/Cookies"

export const CsrfContext = createContext<String>("")

export const CsrfContextProvider = ({ children }: { children?: ReactNode }) => {
    const [token, setToken] = useState<string>("")

    useEffect(() => {
        // Request is dummy, after first POST request, server returns CSRF token in response cookie
        RequestHttp.post("/csrf").then(
            (_) => {
                setToken(getCookie("XSRF-TOKEN"))
            },
            (_) => {}
        )
    }, [])

    return <CsrfContext.Provider value={token}>{children}</CsrfContext.Provider>
}
