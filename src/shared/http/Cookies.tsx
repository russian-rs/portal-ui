export function getCookie(name: string): string {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) {
        return match[2]
    } else {
        return ""
    }
}
