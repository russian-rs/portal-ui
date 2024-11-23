import { UserApi, UserInfoDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const UserApiService = new UserApi(undefined, undefined, RequestHttp)

export const resolveUsers = (logins: (string | undefined | null)[]) => {
    const filteredLogins: string[] = logins.filter((it) => it != undefined)
    return useQuery({
        enabled: filteredLogins.length > 0,
        initialData: {},
        queryKey: ["resolveUsers", logins],
        queryFn: () =>
            UserApiService.resolveUsers(filteredLogins).then((response) => {
                return response.data.reduce(
                    (acc, item) => {
                        acc[item.username] = item
                        return acc
                    },
                    {} as Record<string, UserInfoDto>
                )
            }),
    })
}
