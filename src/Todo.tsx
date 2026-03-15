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
    <div className="flex flex-col h-full max-w-md">

      {/* Todo list */}
      <ul className="flex-1 overflow-y-auto space-y-2 mb-3">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex justify-between items-center border rounded px-3 py-2"
          >
            <span>{todo.text}</span>

            <input
              type="checkbox"
              onChange={() => removeTodo(todo.id)}
            />
          </li>
        ))}
      </ul>

      {/* Input */}
      <form onSubmit={addTodo} className="flex gap-2 mt-auto">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Write a task..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 border rounded"
        >
          Add
        </button>
      </form>

    </div>
  )
}
