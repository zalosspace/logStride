import { useEffect, useState } from "react"
import { supabase } from './Supabase'

import type { Day } from "./Types"
import HourChart from './HourChart'
import Timer from './Timer'
import LogData from './LogData'
import Heatmap from './Heatmap/Heatmap'
import Todo from './Todo'

export default function App() {

    const [user, setUser] = useState<any>(null)
    const [data, setData] = useState<Day[]>([])
    const [showLogModal, setShowLogModal] = useState(false)

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
            <nav className="w-full border-b border-zinc-800 bg-black/40">
                <div className="max-w-[1400px] mx-auto 
                    flex items-center justify-between px-8 py-4">

                    <h1 className="font-bold text-2xl tracking-tight">
                        Log<span className="text-[var(--hint)]">Stride</span>
                    </h1>

                    <div className="flex items-center gap-4">

                        {user ? (
                            <>
                                <button
                                    className="bg-[var(--hint)] hover:scale-105
                                    text-white px-4 py-2 rounded-xl text-sm font-medium
                                    transition-all duration-200 shadow-lg hover:shadow-[0_0_10px_var(--hint)] 
                                    active:scale-95"
                                    onClick={() => setShowLogModal(true)}
                                >
                                    Log Day
                                </button>

                                <div className="flex items-center gap-3 bg-zinc-900 px-3 py-1.5 rounded-xl">

                                    <img
                                        src={user.user_metadata?.avatar_url}
                                        alt="profile"
                                        className="w-8 h-8 rounded-full border border-zinc-700"
                                    />

                                    <span className="text-sm text-zinc-300 max-w-[120px] truncate">
                                        {user.user_metadata?.full_name || user.email}
                                    </span>
                                </div>
                            </>
                        ) : (
                                <button
                                    onClick={signInWithGoogle}
                                    className="bg-white text-black px-4 py-2 rounded-xl 
                                    text-sm font-medium hover:bg-zinc-200 transition"
                                >
                                    Sign in with Google
                                </button>
                            )}

                    </div>
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto px-4 py-6">

                <div id="grid-layout" 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 
                    min-h-0 
                    ">
                    {/* h-[calc(100vh-130px)]"> */}
                    <div className="widget grid place-items-center
                        aspect-square sm:aspect-auto">
                        <Timer />
                    </div>
                    <div className="widget aspect-square sm:aspect-auto">
                        <Todo />
                    </div>
                    <div className="widget grid place-items-center aspect-square sm:aspect-auto">
                        <Heatmap user={user}/>
                    </div>
                    <div className="widget aspect-square sm:aspect-auto col-span-1 lg:col-span-3 grid place-items-center">
                        <HourChart data={data} fetchHours={fetchHours}/>
                    </div>
                </div>

                {/* Log Data Modal */}
                {showLogModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
                        <LogData onClose={() => setShowLogModal(false)} />
                    </div>
                )}            
            </div>

        </>
    )
}
