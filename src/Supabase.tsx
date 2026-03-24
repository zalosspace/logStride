import { createClient } from '@supabase/supabase-js'
import type { Day } from './Types';


export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

export async function fetchThisMonth() {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    function toDateOnly(d: Date) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    const { data: rows, error } = await supabase
        .from("days")
        .select("date, hours, mood")
        .gte("date", toDateOnly(startOfMonth))
        .lt("date", toDateOnly(startOfNextMonth))
        .order("date", { ascending: true })

    if (error) {
        console.error(error);
        return;
    }

    return rows as Day[];
}

export async function fetchAllDays(): Promise<Day[]> {
    const { data, error } = await supabase
        .from("days")
        .select("date, hours, mood")
        .order("date", { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }

    return data as Day[];
}
