import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient()
queryClient.setDefaultOptions({
    queries: {
        retry: false,
        refetchOnWindowFocus: false,
    },
})
