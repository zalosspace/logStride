import { useEffect, useState, useMemo } from "react"
import { fetchAllDays, fetchThisMonth } from "./Supabase"
import type { Day } from "./Types"

export default function useAnalytics(user: any) {

    const [data, setData] = useState<Day[]>([])
    const [yearlyData, setYearlyData] = useState<Day[]>([])
    const [selectedYear, setSelectedYear] = useState<number | null>(null)

    // Fetch current month
    useEffect(() => {
        if (user) {
            fetchThisMonth().then(setData)
        }
    }, [user])

    // Fetch all 
    const fetchYearly = async () => {
        const res = await fetchAllDays()
        setYearlyData(res)
    }

    // Years list
    const years = useMemo(() => {
        return Array.from(
            new Set(yearlyData.map(d => new Date(d.date).getFullYear()))
        ).sort((a, b) => b - a)
    }, [yearlyData])

    useEffect(() => {
        if (years.length > 0) {
            setSelectedYear(years[0])
        }
    }, [years])

    // Filter by year
    const filteredData = useMemo(() => {
        if (!selectedYear) return []
        return yearlyData.filter(
            d => new Date(d.date).getFullYear() === selectedYear
        )
    }, [yearlyData, selectedYear])

    // Group by month
    const monthlyData = useMemo(() => {
        const months: { [key: number]: Day[] } = {}

        filteredData.forEach(d => {
            const m = new Date(d.date).getMonth()
            if (!months[m]) months[m] = []
            months[m].push(d)
        })

        return months
    }, [filteredData])

    return {
        data,
        yearlyData,
        monthlyData,
        years,
        selectedYear,
        setSelectedYear,
        fetchYearly
    }
}
