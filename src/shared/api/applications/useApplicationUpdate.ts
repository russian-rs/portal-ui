import { ApplicationDto, ApplicationPageResponse } from "@russian-rs/portal-api-axios"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { PrivateApplicationApiService } from "./PrivateApplicationApiService"

export const cacheApplication = (queryClient: QueryClient, application: ApplicationDto) => {
    queryClient.setQueryData(["getApplication", application.id], application)
    queryClient.setQueriesData<ApplicationPageResponse>({ queryKey: ["getApplications"] }, (page) =>
        page
            ? { ...page, content: page.content.map((item) => (item.id === application.id ? application : item)) }
            : page
    )
    void queryClient.invalidateQueries({ queryKey: ["getApplications"] })
}

export const useApplicationUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["writeApplication"],
        mutationFn: (patch: ApplicationDto) =>
            PrivateApplicationApiService.updateApplication(patch).then((r) => r.data),
        onSuccess: (application) => cacheApplication(queryClient, application),
    })
}
