import { useEffect, useState } from "react"

type Todo = {
    id: string
    text: string
}

export default function Todo() {

    const [todos, setTodos] = useState<Todo[]>(() => {
        try {
            const stored = localStorage.getItem("todo")
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    const [input, setInput] = useState("")

    // persist todos
    useEffect(() => {
        localStorage.setItem("todo", JSON.stringify(todos))
    }, [todos])

    function addTodo(e: React.FormEvent) {
        e.preventDefault()

        const task = input.trim()
        if (!task) return

        setTodos(prev => [
            ...prev,
            { id: crypto.randomUUID(), text: task }
        ])

        setInput("")
    }

    function removeTodo(id: string) {
        setTodos(prev => prev.filter(t => t.id !== id))
    }

    return (
        <div className="w-full">
            {/* Todo list */}
            <ul className="overflow-y-scroll text-xl space-y-2 mb-5">
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        className="flex items-center rounded px-3 py-2"
                    >

                        <input
                            type="checkbox"
                            className="
                            appearance-none mr-3 size-5 rounded-md 
                            border  
                            checked:bg-[var(--hint)] checked:border-[var(--hint)]
                            cursor-pointer transition-all
                            relative
                            "
                            onChange={() => {
                                setTimeout(() => removeTodo(todo.id), 300)
                            }}
                        />
                        <span>{todo.text}</span>
                    </li>
                ))}
            </ul>

            {/* Input */}
<form onSubmit={addTodo} className="flex gap-2 sticky bottom-0 w-full">
    <input
        className="border rounded px-3 py-2 flex-1 min-w-0"
        placeholder="Write a task..."
        value={input}
        onChange={e => setInput(e.target.value)}
    />
    <button
        type="submit"
        className="px-4 py-2 border rounded shrink-0"
    >
        Add
    </button>
</form>
        </div>
    )
}
