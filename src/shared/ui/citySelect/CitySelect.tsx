import { Autocomplete, AutocompleteProps } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { CitiesApiService } from "src/shared/api/CitiesApiService"

const isCyrillic = (text: string): boolean => {
    return /[\u0400-\u04FF]/.test(text)
}

export const CitySelect = ({ onChange, ...props }: AutocompleteProps) => {
    const intl = useIntl()
    const [search, setSearch] = useState<string>("")

    const { data: cities = [] } = useQuery({
        queryKey: ["cities"],
        queryFn: () => CitiesApiService.getCities().then((response) => response.data),
    })

    const cityOptions = useMemo(() => {
        return cities.map((city) => (isCyrillic(search) ? city.nameCyrillic : city.name))
    }, [cities, search])

    const handleChange = (newValue: string) => {
        setSearch(newValue)
        const city = cities.find((c) => c.name === newValue || c.nameCyrillic === newValue)

        if (city) {
            onChange?.(city.name)
        } else {
            onChange?.("")
        }
    }

    return (
        <Autocomplete
            placeholder={intl.formatMessage({ id: "common.city-select.placeholder" })}
            data={cityOptions}
            value={search}
            onChange={handleChange}
            {...props}
        />
    )
}
