export const getFullAddress = (
    postalCode: string | undefined,
    city: string | undefined,
    address: string | undefined
) => {
    return [postalCode, city, address].filter(Boolean).join(", ")
}
