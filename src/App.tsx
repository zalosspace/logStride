import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from "react"
import HourChart from './hour_chart'
import Timer from './Timer'
import LogData from './LogData'
import Heatmap from './Heatmap/Heatmap'
import Todo from './Todo'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

type Day = {
    date: string
    hours: number
    mood: number
}

export default function App() {

    const [user, setUser] = useState<any>(null)
    const [data, setData] = useState<Day[]>([])

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin
            }
        })
    }

    async function createUserProfile(user: any) {

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

        if (!data) {
            await supabase.from("profiles").insert({
                id: user.id,
                email: user.email,
                name: user.user_metadata.full_name,
            })
        }
    }

    useEffect(() => {

        supabase.auth.getSession().then(({ data }) => {
            const u = data.session?.user
            if (u) {
                setUser(u)
                createUserProfile(u)
            }
        })

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                const u = session?.user
                if (u) {
                    setUser(u)
                    createUserProfile(u)
                }
            })

        return () => subscription.unsubscribe()

    }, [])

    async function fetchHours(days: number = 30) {

        const { data: rows, error } = await supabase
            .from("days")
            .select("date, hours, mood")
            .order("date", { ascending: false })
            .limit(days)

        if (error) {
            console.error(error)
            return
        }

        setData((rows as Day[]).reverse())
    }

    useEffect(() => {
        if (user) fetchHours()
    }, [user])

    return (
        <>
            <nav className="flex justify-around mb-8">
                <h1 className="font-bold text-2xl">Log Stride</h1>

            {user ? (
                <h2>Welcome {user.email}</h2>
            ) : (
                <button onClick={signInWithGoogle}>
                    Sign in with Google
                </button>
            )}
            </nav>
        <div className="max-w-[1400px] mx-auto">

            <div id="grid-layout" 
                className="grid grid-cols-3 grid-rows-2 gap-5 h-[90vh]
                min-h-0">
                <div className="widget grid place-items-center">
                    <Timer />
                </div>
                <div className="widget">
                    <Todo />
                </div>
                <div className="widget grid place-items-center">
                        <Heatmap data={data}/>
                    </div>
                <div className="widget col-span-3 grid place-items-center">
                    <HourChart data={data} fetchHours={fetchHours}/>
                </div>
            </div>

            <LogData />
        </div>
        </>
    )
}
