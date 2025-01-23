export const openTab = (path: string) => {
    const newTab = window.open()
    if (newTab) {
        // Open in new tab using React Router path
        newTab.opener = null // Security measure to prevent reverse communication
        newTab.location.href = path
    }
}
