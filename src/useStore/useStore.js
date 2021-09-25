// Reference-based key for `_isStore`
const _STORE_KEY = {}

////////////////////////////////////////////////////////////////////////////////

function _isArray(value) {
	return Array.isArray(value)
}

function _isFunction(value) {
	return typeof value === "function"
}

function _isStore(store) {
	return store?.key === _STORE_KEY
}

function _isValidSelector(selector) {
	return selector !== undefined && _isArray(selector) && selector.length > 0
}

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

function _getSelected(state, selector) {
	let selected = state
	for (const id of selector) {
		selected = selected[id]
	}
	return selected
}

function _useStoreSelector(store, selector) {
	React.useMemo(() => {
		// Guard store
		if (!_isStore(store)) {
			throw new Error("useStoreSelector: First argument is not a store. " +
				"Use `createStore` to create a store.")
		}
		// Guard selector
		if (!_isValidSelector(selector)) {
			throw new Error("useStoreSelector: Second argument is not a selector.")
		}
		// Guard selector path
		let focus = store.cachedState
		for (const id of selector) {
			if (!(id in focus)) {
				throw new Error(`useStoreSelector: Selector path \`[${selector.join(", ")}]\` is unreachable.`)
			}
			focus = focus[id]
		}
	}, [])

	// Create a `useState` from the cached state
	const [state, setState] = React.useState(store.cachedState)
	const selected = _getSelected(state, selector)

	// Add `setState` to the store's subscriptions and cleanup
	//
	// TODO: Add support for `shallow` for `selector`?
	React.useEffect(() => {
		store.subscriptions.set(setState, selector)
		return () => {
			store.subscriptions.delete(setState)
		}
	}, [selector])

	return selected
}

function _useStoreReducerImpl(store, reducer, { flagStateOnly, flagDispatchOnly }) {
	React.useMemo(() => {
		// Guard store
		if (!_isStore(store)) {
			throw new Error("useStoreReducer: First argument is not a store. " +
				"Use `createStore` to create a store.")
		}
		// Guard reducer
		if (!flagStateOnly) {
			if (!_isFunction(reducer)) {
				throw new Error("useStoreReducer: Second argument is not a reducer.")
			}
		}
	}, [])

	// Create a `useState` from the cached state
	const [state, setState] = React.useState(store.cachedState)

	// Add `setState` to the store's subscriptions and cleanup
	React.useEffect(flagDispatchOnly ? () => { /* No-op */ } : () => {
		store.subscriptions.set(setState, undefined /* selector=undefined */)
		return () => {
			store.subscriptions.delete(setState)
		}
	}, [])

	const dispatch = React.useCallback(flagStateOnly ? () => { /* No-op */ } : action => {
		const currState = store.cachedState

		// Get the next state
		const nextState = reducer(currState, action)
		// Invalidate components
		setState(nextState)
		for (const [otherSetState, otherSelector] of store.subscriptions) {
			// Dedupe `setState`
			if (otherSetState !== setState) {
				if (_isValidSelector(otherSelector)) {
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
		dispatch,
	]
}

////////////////////////////////////////////////////////////////////////////////

export function useStoreSelector(store, selector) {
	return _useStoreSelector(store, selector)
}

export function useStoreSelectors(store, selectors) {
	const arr = []
	for (const selector of selectors) {
		arr.push(_useStoreSelector(store, selector))
	}
	return arr
}

export function useStore(store, reducer) {
	return _useStoreReducerImpl(store, reducer, {
		flagStateOnly: false,
		flagDispatchOnly: false,
	})
}

export function useStoreStateOnly(store, reducer) {
	return _useStoreReducerImpl(store, reducer, {
		flagStateOnly: true,
		flagDispatchOnly: false,
	})[0]
}

export function useStoreDispatchOnly(store, reducer) {
	return _useStoreReducerImpl(store, reducer, {
		flagStateOnly: false,
		flagDispatchOnly: true,
	})[1]
}
