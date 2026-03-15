import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from "react"
import HourChart from './hour_chart'
import Timer from './Timer'
import LogData from './LogData'
import WorkHeatmap from './Heatmap'
import Todo from './Todo'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

export default function App() {

    const [user, setUser] = useState<any>(null)

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

    return (
        <div className="max-w-[1400px] mx-auto">
            {user ? (
                <h2>Welcome {user.email}</h2>
            ) : (
                <button onClick={signInWithGoogle}>
                    Sign in with Google
                </button>
            )}

            <div id="grid-layout" 
                className="grid grid-cols-3 grid-rows-2 gap-2 h-[93vh]
                min-h-0">
                <div className="widget">
                    <Timer />
                </div>
                <div className="widget">
                    <WorkHeatmap />
                </div>
                <div className="widget">
                    <Todo />
                </div>
                <div className="widget col-span-3">
                    <HourChart />
                </div>
            </div>

            <LogData />
        </div>
    )
}
