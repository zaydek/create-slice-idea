import {
	createStore,
	useStore,
} from "./useStore"

import "./App.css"

const todosStore = createStore({
	form: {
		checked: false,
		value: "",
	},
	todos: [],
})

function Todo({ todoIndex }) {
	const [todo, setTodo] = useStore(todosStore, ["todos", todoIndex])
	const [todos, setTodos] = useStore(todosStore, ["todos"])

	return (
		<div id={todo.id}>
			<input
				type="checkbox"
				checked={todo.checked}
				onChange={e => {
					setTodo({
						...todo,
						checked: e.target.checked,
					})
				}}
			/>
			<input
				type="text"
				value={todo.value}
				onChange={e => {
					setTodo({
						...todo,
						value: e.target.value,
					})
				}}
			/>
			<button
				onClick={e => {
					setTodos([
						...todos.slice(0, todoIndex),
						...todos.slice(todoIndex + 1),
					])
				}}
			>
				-
			</button>
		</div>
	)
}

function Todos() {
	const [todos] = useStore(todosStore, ["todos"])

	return todos.map((todo, todoIndex) => (
		<Todo
			key={todo.id}
			todoIndex={todoIndex}
		/>
	))
}

function TodoApp() {
	const [form, setForm] = useStore(todosStore, ["form"])
	const [todos, setTodos] = useStore(todosStore, ["todos"])

	return (
		<>

			{/* App */}
			<form
				onSubmit={e => {
					e.preventDefault()
					if (form.value === "") {
						return
					}
					setTodos([
						{
							...form,
							id: Math.random().toString(36).slice(2, 8),
						},
						...todos,
					])
					setForm({
						...form,
						value: "", // Reset
					})
				}}
			>
				<input
					type="checkbox"
					checked={form.checked}
					onChange={e => {
						setForm({
							...form,
							checked: e.target.checked,
						})
					}}
				/>
				<input
					type="text"
					value={form.value}
					onChange={e => {
						setForm({
							...form,
							value: e.target.value,
						})
					}}
				/>
				<button
					type="submit"
				>
					+
				</button>
			</form>

			{/* Todos */}
			<Todos />

		</>
	)
}

export default function Top() {
	const [state] = useStore(todosStore)

	return (
		<>
			<TodoApp />
			<br />
			<TodoApp />
			<br />
			<pre>
				{JSON.stringify(state, null, 2)}
			</pre>
		</>
	)
}
