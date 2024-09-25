export const SimpleLocalStorageService = {
    getItem(key: string): any {
        const persistValue = window.localStorage.getItem(key)
        if (persistValue == null) {
            return null
        } else {
            return JSON.parse(persistValue)
        }
    },

    hasItem: (key: string) => Boolean(localStorage.getItem(key)),

    removeItem: (key: string) => localStorage.removeItem(key),

    setItem(key: string, value: any) {
        if (value == null) {
            this.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    },
}
