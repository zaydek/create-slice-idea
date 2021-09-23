import {
	createSlice,
	getSlice,
} from "./createSlice"

import "./App.css"

////////////////////////////////////////////////////////////////////////////////

// Creates a reference to check whether a store is a store.
const STORE_KEY = {}

// Returns whether a value is a function.
function _isFunction(value) {
	return typeof value === "function"
}

// // Freezes an object once.
// function _freezeOnce(object) {
// 	let frozenReference = object
// 	if (!Object.isFrozen(object)) {
// 		frozenReference = Object.freeze(object)
// 	}
// 	return frozenReference
// }

// Checks whether a store is a store.
function _isStore(store) {
	return store?.key === STORE_KEY
}

function createStore(initialStateOrInitializer) {
	// Flag for the returned object
	const initializerIsFunction = _isFunction(initialStateOrInitializer)

	// Get the initial state
	let initialState = initialStateOrInitializer
	if (initializerIsFunction) {
		initialState = initialStateOrInitializer()
	}

	return {
		// Reference for checking whether a store is a store
		key: STORE_KEY,
		// Subscriptions for all setters (`setState`)
		subscriptions: new Set(),
		// Initial state
		initialState: initialState,
		// Initializer
		initializer: !initializerIsFunction
			? () => initialState
			: initialStateOrInitializer,
		// Cached state
		cachedState: initialState,
	}
}

function useStore(store) {
	// Check whether the store is a store once
	React.useMemo(() => {
		if (!_isStore(store)) {
			throw new Error("useStore: First argument is not a store. " +
				"Use `createStore` to create a store.")
		}
	}, [])

	// Create a `useState` tuple from the cached state
	const [state, setState] = React.useState(store.cachedState)

	// Add `setState` to the store's subscriptions and create a cleanup function
	// to remove `setState` from the store's subscriptions
	React.useEffect(() => {
		store.subscriptions.add(setState)
		return () => {
			store.subscriptions.delete(setState)
		}
	}, [])

	// Create a memoized function that decorates `setState` so state changes are
	// propagated to the current `setState` and the store's subscriptions
	const setStore = React.useCallback(nextStateOrUpdater => {
		// Get the next slice state
		let nextState = nextStateOrUpdater
		if (_isFunction(nextStateOrUpdater)) {
			// We don't need to add `store.cachedState` as a dependency because
			// `store` is a reference type. This is functionally equivalent to
			// `React.useRef`.
			nextState = nextStateOrUpdater(store.cachedState)
		}
		// Dispatch the next state to the current `setState` and the store's
		// subscriptions
		setState(nextState)
		for (const otherSetState of store.subscriptions) {
			// Dedupe the current `setState`
			if (otherSetState !== setState) {
				otherSetState(nextState)
			}
		}
		// Cache the current state
		store.cachedState = nextState
	}, [])

	return [state, setStore]
}

function useStoreSlice(store, keys) {
	// Guard keys once
	React.useMemo(() => {
		let focusRef = store.cachedState
		if (keys !== undefined && keys.length > 0) {
			for (const key of keys) {
				if (!(key in focusRef)) {
					const path = keys.map(key => `[${JSON.stringify(key)}]`).join("")
					throw new Error(`useStoreSlice: Unreachable path \`state${path}\`.`)
				}
				focusRef = focusRef[key]
			}
		}
	}, [])

	const [state, setState] = useStore(store)
	const slice = getSlice(state, keys)

	return [
		slice,
		nextSliceOrUpdater => {
			const [current, setSlice] = createSlice(store.cachedState, keys)
			let nextSlice = nextSliceOrUpdater
			if (_isFunction(nextSliceOrUpdater)) {
				nextSlice = nextSliceOrUpdater(current)
			}
			setState(setSlice(nextSlice))
		},
	]
}

////////////////////////////////////////////////////////////////////////////////

const todosStore = createStore({
	form: {
		checked: false,
		value: "",
	},
	todos: [],
})

function Todo({ todoIndex }) {
	const [todo, setTodo] = useStoreSlice(todosStore, ["todos", todoIndex])
	const [todos, setTodos] = useStoreSlice(todosStore, ["todos"])

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
	const [todos] = useStoreSlice(todosStore, ["todos"])

	return todos.map((todo, todoIndex) => (
		<Todo
			key={todo.id}
			todoIndex={todoIndex}
		/>
	))
}

function TodoApp() {
	const [form, setForm] = useStoreSlice(todosStore, ["form"])
	const [todos, setTodos] = useStoreSlice(todosStore, ["todos"])

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
