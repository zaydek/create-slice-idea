function _isArray(value) {
	return Array.isArray(value)
}

function _areKeysValid(keys) {
	return keys !== undefined
}

function _createNextState(state, keys, newValue) {
	// The focus reference for the current state
	let stateRef = state
	// The next state
	let nextState = { ...state }
	// The focus reference for the next state
	let nextStateFocusRef = nextState
	for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
		const key = keys[keyIndex]
		const keyIsAtEnd = keyIndex + 1 === keys.length

		if (!keyIsAtEnd) {
			Object.assign(nextStateFocusRef, {
				// Allocate new references for arrays and objects
				[key]: _isArray(stateRef[key])
					? [...stateRef[key]]    // Array
					: { ...stateRef[key] }, // Object
			})
		} else {
			Object.assign(nextStateFocusRef, {
				// The deepest element needs to copy all properties
				...stateRef,     // Old properties
				[key]: newValue, // New property
			})
		}
		// Update the focus references
		stateRef = stateRef[key]
		nextStateFocusRef = nextStateFocusRef[key]
	}
	return nextState
}

// Gets a slice from a state and a set of keys. Note that `getSlice` doesn't err
// on unreachable paths.
export function getSlice(state, keys) {
	let focusRef = state
	if (_areKeysValid(keys)) {
		for (const key of keys) {
			focusRef = focusRef[key]
		}
	}
	return focusRef
}

// Creates a slice and slice setter for an object-based data structure.
export function createSlice(state, keys) {
	const slice = getSlice(state, keys)

	let cachedState = state
	function setSlice(newValue) {
		if (!_areKeysValid(keys)) {
			return newValue
		} else {
			const nextState = _createNextState(cachedState, keys, newValue)
			cachedState = nextState
			return nextState
		}
	}

	return [
		slice,
		setSlice,
	]
}
