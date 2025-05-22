import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export interface ProgramDto {
  code: string
  nameRu: string
  nameEn: string
  nameSr: string
}

const ProgramsContext = createContext<ProgramDto[]>([])

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery<ProgramDto[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('API /api/programs FETCHED')
      const { data } = await axios.get<ProgramDto[]>("/api/programs")
      return data
    },
    staleTime: Infinity,
  })

  return (
    <ProgramsContext.Provider value={data ?? []}>
      {children}
    </ProgramsContext.Provider>
  )
}

export function usePrograms() {
  return useContext(ProgramsContext)
} 