import { CloseButton, Combobox, Input, InputBase, useCombobox } from "@mantine/core"
import { CityDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { CitiesApiService } from "src/shared/api/CitiesApiService"

interface CitySelectProps {
    label: string
    description?: string
    value?: string
    onChange: (cityName: string) => void
    disabled?: boolean
    withAsterisk?: boolean
    className?: string
    error?: string
}

export const CitySelect = ({
    label,
    description,
    value,
    onChange,
    disabled = false,
    withAsterisk = false,
    className,
    error,
}: CitySelectProps) => {
    const intl = useIntl()
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })

    const [selectedValue, setSelectedValue] = useState(value || "")
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        setSelectedValue(value || "")
    }, [value])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        if (debouncedSearch.length >= 2) {
            combobox.openDropdown()
        }
    }, [debouncedSearch])

    const {
        data: cities = [],
        isFetching,
        error: queryError,
    } = useQuery({
        queryKey: ["cities", debouncedSearch],
        queryFn: () => {
            return CitiesApiService.findCityByName(debouncedSearch).then((response) => response.data)
        },
        enabled: debouncedSearch.length >= 2,
    })

    const handleOptionSubmit = (city: CityDto) => {
        setSelectedValue(city.name)
        onChange(city.name)
        combobox.closeDropdown()
    }

    const options = cities.map((city, index) => (
        <Combobox.Option value={index.toString()} key={index} onClick={() => handleOptionSubmit(city)}>
            {city.name}
        </Combobox.Option>
    ))

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                const index = parseInt(val)
                const city = cities[index]
                if (city) {
                    handleOptionSubmit(city)
                }
            }}
            disabled={disabled}
        >
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    label={label}
                    description={description}
                    withAsterisk={withAsterisk}
                    className={className}
                    disabled={disabled}
                    error={error}
                    onClick={() => combobox.toggleDropdown()}
                    rightSection={
                        selectedValue ? (
                            <CloseButton
                                size="sm"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setSelectedValue("")
                                    onChange("")
                                }}
                                aria-label="Clear value"
                            />
                        ) : (
                            <Combobox.Chevron />
                        )
                    }
                >
                    {selectedValue || (
                        <Input.Placeholder>
                            {intl.formatMessage({ id: "common.city-select.placeholder" })}
                        </Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search
                    placeholder={intl.formatMessage({ id: "common.city-select.search-placeholder" })}
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    onFocus={() => combobox.openDropdown()}
                />
                <Combobox.Options>
                    {isFetching ? (
                        <Combobox.Empty>
                            <FormattedMessage id="common.city-select.loading" />
                        </Combobox.Empty>
                    ) : queryError ? (
                        <Combobox.Empty>
                            <FormattedMessage id="common.city-select.loading-error" />
                        </Combobox.Empty>
                    ) : options.length > 0 ? (
                        options
                    ) : search.length < 2 ? (
                        <Combobox.Empty>
                            <FormattedMessage id="common.city-select.search-min-length" />
                        </Combobox.Empty>
                    ) : (
                        <Combobox.Empty>
                            <FormattedMessage id="common.city-select.not-found" />
                        </Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}
