export const getLocalizedName = (
    item: { nameRu?: string; nameEn?: string; nameSr?: string },
    locale: string
): string => {
    switch (locale) {
        case "ru":
            return item.nameRu || item.nameEn || item.nameSr || ""
        case "en":
            return item.nameEn || item.nameRu || item.nameSr || ""
        case "sr":
            return item.nameSr || item.nameEn || item.nameRu || ""
        default:
            return item.nameEn || item.nameRu || item.nameSr || ""
    }
}
