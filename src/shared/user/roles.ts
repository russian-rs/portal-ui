import { UserInfoDto } from "@russian-rs/portal-api-axios"

export const hasPermission = (user: UserInfoDto | null, allowed: string[] | undefined | null): boolean => {
    if (allowed === undefined || allowed === null || allowed.length === 0) {
        return true
    }
    if (user) {
        const groups = user.groups
        return groups.some((group) => allowed.includes(group))
    }
    return false
}
