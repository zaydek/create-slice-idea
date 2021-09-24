// import {
// 	createSlice,
// 	getSlice,
// } from "./createSlice"

////////////////////////////////////////////////////////////////////////////////

// Creates a reference to check whether a store is a store.
const _STORE_KEY = {}

function _isArray(value) {
	return Array.isArray(value)
}

function _isFunction(value) {
	return typeof value === "function"
}

function _isStore(store) {
	return store?.key === _STORE_KEY
}

// function _areKeysValid(keys) {
// 	return keys !== undefined
// }

////////////////////////////////////////////////////////////////////////////////

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
		subscriptions: new Map(),
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

// export function useStore(store, keys) {
// 	React.useMemo(() => {
// 		// Guard store
// 		if (!_isStore(store)) {
// 			throw new Error("useStore: First argument is not a store. " +
// 				"Use `createStore` to create a store.")
// 		}
// 		// Guard keys
// 		if (_areKeysValid(keys)) {
// 			let focusRef = store.cachedState
// 			for (const key of keys) {
// 				if (!(key in focusRef)) {
// 					const path = keys.map(key => `[${JSON.stringify(key)}]`).join("")
// 					throw new Error(`useStore: Unreachable path \`state${path}\`.`)
// 				}
// 				focusRef = focusRef[key]
// 			}
// 		}
// 	}, [])
//
// 	// Create a `useState` from the cached state
// 	const [state, setState] = React.useState(store.cachedState)
// 	let slice = null
// 	if (_areKeysValid(keys)) {
// 		slice = getSlice(state, keys)
// 	}
//
// 	// Add `setState` to the store's subscriptions and create a cleanup function
// 	// to remove `setState` from the store's subscriptions
// 	React.useEffect(() => {
// 		store.subscriptions.set(setState, keys)
// 		return () => {
// 			store.subscriptions.delete(setState)
// 		}
// 	}, [keys])
//
// 	// Decorate `setState` so state changes propagate to subscribed components
// 	//
// 	// TODO: If we use `React.useCallback` without dependencies, React errs:
// 	//
// 	//   Warning: Encountered two children with the same key, `...`. Keys should
// 	//   be unique so that components maintain their identity across updates. Non-
// 	//   unique keys may cause children to be duplicated and/or omitted — the
// 	//   behavior is unsupported and could change in a future version.
// 	//
// 	// TODO: We should probably use something like zustand's `shallow`
// 	// implementation to check whether keys are shallowly the same because keys
// 	// are reference types and therefore always change
// 	//
// 	// Reference implementation: https://github.com/pmndrs/zustand/blob/main/src/shallow.ts
// 	function setStore(updater) {
// 		const keysAreValid = _areKeysValid(keys)
//
// 		// Get the next state
// 		let nextState = null
// 		let nextSlice = null
// 		if (keysAreValid) {
// 			const [currentSlice, setSlice] = createSlice(store.cachedState, keys)
// 			nextSlice = updater
// 			if (_isFunction(updater)) {
// 				nextSlice = updater(currentSlice)
// 			}
// 			nextState = setSlice(nextSlice)
// 		} else {
// 			nextState = updater
// 			if (_isFunction(updater)) {
// 				nextState = updater(store.cachedState)
// 			}
// 		}
// 		// Invalidate components
// 		setState(nextState)
// 		for (const [otherSetState, otherKeys] of store.subscriptions) {
// 			// Dedupe `setState`
// 			if (otherSetState !== setState) {
// 				if (_areKeysValid(otherKeys)) {
// 					// Suppress useless rerenders
// 					const prevSlice = getSlice(state, otherKeys)
// 					const nextSlice = getSlice(nextState, otherKeys)
// 					if (prevSlice !== nextSlice) {
// 						otherSetState(nextState)
// 					}
// 				} else {
// 					otherSetState(nextState)
// 				}
// 			}
// 		}
// 		// Cache the current state
// 		store.cachedState = nextState
// 	}
//
// 	return [
// 		slice ?? state,
// 		setStore,
// 	]
// }

function _getSelected(state, selector) {
	let selected = state
	for (const id of selector) {
		selected = selected[id]
	}
	return selected
}

export function useStoreSelector(store, selector) {
	React.useMemo(() => {
		// Guard store
		if (!_isStore(store)) {
			throw new Error("useStoreSelector: First argument is not a store. " +
				"Use `createStore` to create a store.")
		}
		// Guard selector
		if (!_isArray(selector)) {
			throw new Error("useStoreSelector: Second argument is not a selector.")
		}
		// Guard selector
		let focusRef = store.cachedState
		for (const id of selector) {
			if (!(id in focusRef)) {
				throw new Error(`useStoreSelector: Selector \`${selector.join(", ")}\` is unreachable.`)
			}
			focusRef = focusRef[id]
		}
	}, [])

	// Create a `useState` from the cached state
	const [state, setState] = React.useState(store.cachedState)
	const selected = _getSelected(state, selector)

	// Add `setState` to the store's subscriptions and create a cleanup function
	// to remove `setState` from the store's subscriptions
	React.useEffect(() => {
		store.subscriptions.set(setState, selector)
		return () => {
			store.subscriptions.delete(setState)
		}
	}, [selector])

	return selected
}

export function useStoreSelectors(store, selectors) {
	const selectedSet = []
	for (const selector of selectors) {
		selectedSet.push(useStoreSelector(store, selector))
	}
	return selectedSet
}

function _useStoreReducerImpl(store, reducer, dispatchOnly) {
	React.useMemo(() => {
		// Guard store
		if (!_isStore(store)) {
			throw new Error("useStoreReducer: First argument is not a store. " +
				"Use `createStore` to create a store.")
		}
		// Guard reducer
		if (!_isFunction(reducer)) {
			throw new Error("useStoreReducer: Second argument is not a reducer.")
		}
	}, [])

	// Create a `useState` from the cached state
	const [state, setState] = React.useState(store.cachedState)

	// Add `setState` to the store's subscriptions and create a cleanup function
	// to remove `setState` from the store's subscriptions
	React.useEffect(() => {
		if (dispatchOnly) {
			// Suppress useless rerenders
			return
		}
		store.subscriptions.set(setState, undefined /* selector */)
		return () => {
			store.subscriptions.delete(setState)
		}
	}, [dispatchOnly])

	const reduceStore = React.useCallback(action => {
		const currState = store.cachedState

		// Get the next state
		const nextState = reducer(currState, action)
		// Invalidate components
		setState(nextState)
		for (const [otherSetState, otherSelector] of store.subscriptions) {
			// Dedupe `setState`
			if (otherSetState !== setState) {
				if (_isArray(otherSelector)) {
					// Suppress useless rerenders
					const currSelected = _getSelected(currState, otherSelector)
					const nextSelected = _getSelected(nextState, otherSelector)
					if (currSelected !== nextSelected) {
						otherSetState(nextState)
					}
				} else {
					otherSetState(nextState)
				}
			}
		}
		// Cache the current state
		store.cachedState = nextState
	}, [])

	return [
		state,
		reduceStore,
	]
}

export function useStoreReducer(store, reducer) {
	return _useStoreReducerImpl(store, reducer, false)
}

export function useStoreReducerDispatchOnly(store, reducer) {
	return _useStoreReducerImpl(store, reducer, true)[1]
}
