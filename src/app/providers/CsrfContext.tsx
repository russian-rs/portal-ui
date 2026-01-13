import { createContext, ReactNode, useEffect, useState } from "react"
import { getCookie } from "src/shared/http/Cookies"

export const CsrfContext = createContext<String>("")

export const CsrfContextProvider = ({ children }: { children?: ReactNode }) => {
    const [token, setToken] = useState<string>("")

    useEffect(() => {
        // GET request to /csrf triggers the server to set XSRF-TOKEN cookie
        // Using plain fetch to avoid RequestHttp interceptors that cause redirect loops
        fetch("/api/csrf", { credentials: "include" })
            .then(() => setToken(getCookie("XSRF-TOKEN")))
            .catch(() => {})
    }, [])

    return <CsrfContext.Provider value={token}>{children}</CsrfContext.Provider>
}
