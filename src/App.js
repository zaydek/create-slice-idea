// import {
// 	createStore,
// 	useStore,
// 	useStoreSelector,
// 	useStoreSelectors,
// 	useStoreStateOnly,
// 	useStoreDispatchOnly,
// } from "./useStore"

import * as store from "./useStore"

import {
	initialState,
	reducer,
} from "./reducer"

const todosStore = store.createStore(initialState)

const MemoTodo = React.memo(function Todo({ todoIndex }) {
	console.log("Rerendered <Todo>")
	const todo = store.useStoreSelector(todosStore, ["todos", todoIndex])
	const dispatch = store.useStoreDispatchOnly(todosStore, reducer)

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

const MemoTodos = React.memo(function Todos() {
	console.log("Rerendered <Todos>")
	const todos = store.useStoreSelector(todosStore, ["todos"])

	return todos.map((todo, todoIndex) => (
		<MemoTodo
			key={todo.id}
			todoIndex={todoIndex}
		/>
	))
})

function TodoApp() {
	console.log("Rerendered <TodoApp>")
	const form = store.useStoreSelector(todosStore, ["form"])

	const $state = store.useStoreStateOnly(todosStore)
	const dispatch = store.useStoreDispatchOnly(todosStore, reducer)

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
			<MemoTodos />

			{/* DEBUG */}
			<pre>
				{JSON.stringify(
					$state,
					null,
					2,
				)}
			</pre>

		</>
	)
}

export default function Top() {
	return (
		<>
			<TodoApp />
			<TodoApp />
		</>
	)
}
