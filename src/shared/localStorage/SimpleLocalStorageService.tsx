export const SimpleLocalStorageService = {
    getItem(key: string): any {
        const persistValue = window.localStorage.getItem(key);
        return persistValue !== null && JSON.parse(persistValue);
    },

    setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    hasItem: (key: string) => Boolean(localStorage.getItem(key)),

    removeItem: (key: string) => localStorage.removeItem(key),
};
