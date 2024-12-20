import Axios from "axios"

export const SimpleRequestHttp = Axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache",
    },
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
})
