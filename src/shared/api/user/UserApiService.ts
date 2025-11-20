import { UserApi, UserInfoDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { RequestHttp } from "src/shared/http/RequestHttp"
import { SimpleRequestHttp } from "src/shared/http/SimpleRequestHttp"
import { ResidencePermitDto } from "src/pages/profile/residencePermit/types/residencePermit"

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

export const checkUserForApplication = (): Promise<AxiosResponse<UserInfoDto>> => {
    const userApi = new UserApi(undefined, undefined, SimpleRequestHttp)
    return userApi.getCurrentAccount()
}

export const updateResidencePermits = async (
    userId: number,
    permits: ResidencePermitDto[]
): Promise<AxiosResponse<UserInfoDto>> => {
    return RequestHttp.put(`/user/account/${userId}/residence-permits`, permits)
}

export const deleteResidencePermit = async (
    userId: number,
    permitId: string
): Promise<AxiosResponse<UserInfoDto>> => {
    return RequestHttp.delete(`/user/account/${userId}/residence-permits/${permitId}`)
}
