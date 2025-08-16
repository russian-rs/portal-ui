import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProgramDto } from "@russian-rs/portal-api-axios"
import { ProgramsApiService } from "src/shared/api/ProgramsApiService"

const ProgramsContext = createContext<ProgramDto[]>([])

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
    const { data } = useQuery<ProgramDto[]>({
        queryKey: ["programs"],
        queryFn: async () => {
            const response = await ProgramsApiService.getPrograms()
            return response.data
        },
        staleTime: Infinity,
    })

    return <ProgramsContext.Provider value={data ?? []}>{children}</ProgramsContext.Provider>
}

export function usePrograms() {
    return useContext(ProgramsContext)
}
