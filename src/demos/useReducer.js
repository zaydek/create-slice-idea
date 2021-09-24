import {
	createStore,
	useStoreSelector,
	useStoreSelectors,
	useStoreReducer,
	useStoreReducerDispatchOnly,
} from "../useStore"

import {
	initialState,
	reducer,
} from "./reducer"

const todosStore = createStore(initialState)

const MemoTodo = React.memo(function Todo({ todo, todoIndex }) {
	console.log("Rerendered <Todo>")
	const dispatch = useStoreReducerDispatchOnly(todosStore, reducer)

	return (
		<div id={todo.id}>
			<input
				type="checkbox"
				checked={todo.checked}
				onChange={e => {
					dispatch({
						type: "EDIT_CHECKED_BY_INDEX",
						data: {
							checked: e.target.checked,
							todoIndex,
						},
					})
				}}
			/>
			<input
				type="text"
				value={todo.value}
				onChange={e => {
					dispatch({
						type: "EDIT_VALUE_BY_INDEX",
						data: {
							value: e.target.value,
							todoIndex,
						},
					})
				}}
			/>
			<button
				onClick={e => {
					dispatch({
						type: "REMOVE_TODO_BY_INDEX",
						data: {
							todoIndex,
						}
					})
				}}
			>
				-
			</button>
		</div>
	)
})

const MemoTodos = React.memo(function Todos({ todos }) {
	console.log("Rerendered <Todos>")

	return todos.map((todo, todoIndex) => (
		<MemoTodo
			key={todo.id}
			todo={todo}
			todoIndex={todoIndex}
		/>
	))
})

function TodoApp() {
	console.log("Rerendered <TodoApp>")

	// const form = useStoreSelector(todosStore, ["form"])
	// const todos = useStoreSelector(todosStore, ["todos"])

	// const form = useStoreSelector(todosStore, ["form"])
	// const todos = useStoreSelector(todosStore, ["todos"])
	const [form, todos] = useStoreSelectors(todosStore, [["form"], ["todos"]])
	const dispatch = useStoreReducerDispatchOnly(todosStore, reducer)
	// const [state, dispatch] = useStoreReducer(todosStore, reducer)

	return (
		<>

			{/* App */}
			<form
				onSubmit={e => {
					e.preventDefault()
					dispatch({
						type: "ADD_TODO",
					})
				}}
			>
				<input
					type="checkbox"
					checked={form.checked}
					onChange={e => {
						dispatch({
							type: "EDIT_CHECKED",
							data: {
								checked: e.target.checked,
							},
						})
					}}
				/>
				<input
					type="text"
					value={form.value}
					onChange={e => {
						dispatch({
							type: "EDIT_VALUE",
							data: {
								value: e.target.value,
							},
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
			<MemoTodos todos={todos} />

			{/* DEBUG */}
			{/* <pre>
				{JSON.stringify(state, null, 2)}
			</pre> */}

		</>
	)
}

export default function Top() {
	return (
		<>

			<TodoApp />
			{/* <br />

			<TodoApp /> */}

		</>
	)
}
