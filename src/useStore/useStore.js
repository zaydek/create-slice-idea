import {
	createSlice,
	getSlice,
} from "./createSlice"

// Creates a reference to check whether a store is a store.
const _STORE_KEY = {}

// Returns whether a value is a function.
function _isFunction(value) {
	return typeof value === "function"
}

// Checks whether a store is a store.
function _isStore(store) {
	return store?.key === _STORE_KEY
}

function _areKeysValid(keys) {
	return keys !== undefined
}

export function createStore(initialStateOrInitializer) {
	// Flag for the returned object
	const initializerIsFunction = _isFunction(initialStateOrInitializer)

	// Get the initial state
	let initialState = initialStateOrInitializer
	if (initializerIsFunction) {
		initialState = initialStateOrInitializer()
	}

	return {
		// Reference for checking whether a store is a store
		key: _STORE_KEY,
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

export function useStore(store, keys) {
	React.useMemo(() => {
		// Guard store
		if (!_isStore(store)) {
			throw new Error("useStore: First argument is not a store. " +
				"Use `createStore` to create a store.")
		}
		// Guard keys
		if (_areKeysValid(keys)) {
			let focusRef = store.cachedState
			for (const key of keys) {
				if (!(key in focusRef)) {
					const path = keys.map(key => `[${JSON.stringify(key)}]`).join("")
					throw new Error(`useStore: Unreachable path \`state${path}\`.`)
				}
				focusRef = focusRef[key]
			}
		}
	}, [])

	// Create a `useState` tuple from the cached state
	const [state, setState] = React.useState(store.cachedState)
	let slice = null
	if (_areKeysValid(keys)) {
		slice = getSlice(state, keys)
	}

	// Add `setState` to the store's subscriptions and create a cleanup function
	// to remove `setState` from the store's subscriptions
	React.useEffect(() => {
		store.subscriptions.add(setState)
		return () => {
			store.subscriptions.delete(setState)
		}
	}, [])

	// Decorate `setState` so state changes propagate to subscribed components
	//
	// TODO: If we use `React.useCallback` without dependencies, React errs:
	//
	//   Warning: Encountered two children with the same key, `...`. Keys should
	//   be unique so that components maintain their identity across updates. Non-
	//   unique keys may cause children to be duplicated and/or omitted — the
	//   behavior is unsupported and could change in a future version.
	//
	// TODO: We should probably use something like zustand's `shallow`
	// implementation to check whether keys are shallowly the same because keys
	// are reference types and therefore always change
	//
	// Reference implementation: https://github.com/pmndrs/zustand/blob/main/src/shallow.ts
	//
	const setStore = React.useCallback((updater) => {
		// Get the next state
		let nextState = null
		if (_areKeysValid(keys)) {
			const [currentSlice, setSlice] = createSlice(store.cachedState, keys)
			let nextSlice = updater
			if (_isFunction(updater)) {
				nextSlice = updater(currentSlice)
			}
			nextState = setSlice(nextSlice)
		} else {
			nextState = updater
			if (_isFunction(updater)) {
				nextState = updater(store.cachedState)
			}
		}
		// Invalidate components
		setState(nextState)
		for (const otherSetState of store.subscriptions) {
			// Dedupe `setState`
			if (otherSetState !== setState) {
				otherSetState(nextState)
			}
		}
		// Cache the current state
		store.cachedState = nextState
	}, [keys])

	return [
		slice ?? state,
		setStore,
	]
}
