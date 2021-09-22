// Returns whether a value is an array.
function _isArray(value) {
	return Array.isArray(value)
}

// Returns whether a value is strictly an object (not including arrays).
function _isStrictObject(value) {
	return typeof value === "object" && !_isArray(value)
}

function _createAssignmentReference(originalRef, keys, newValue) {
	let focusRef = originalRef
	let assignRef = {}
	let assignFocusRef = assignRef
	for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
		const key = keys[keyIndex]
		const keyIsAtEnd = keyIndex + 1 === keys.length

		if (!keyIsAtEnd) {
			Object.assign(assignFocusRef, {
				// Allocate new references for arrays and objects
				[key]: _isArray(focusRef[key])
					? [...focusRef[key]]    // Array
					: { ...focusRef[key] }, // Object
			})
		} else {
			Object.assign(assignFocusRef, {
				// The deepest element needs to copy all properties
				...focusRef,     // Old properties
				[key]: newValue, // New property
			})
		}
		// Update the focus references
		focusRef = focusRef[key]
		assignFocusRef = assignFocusRef[key]
	}
	return assignRef
}

// Creates a slice and slice setter for an object-based data structure.
function createSlice(originalRef, keys) {
	if (!_isStrictObject(originalRef)) {
		throw new Error("createSlice: First argument must be an object.")
	}

	if (!Object.isFrozen(originalRef)) {
		Object.freeze(originalRef)
	}

	let slice = originalRef
	if (Array.isArray(keys) && keys.length > 0) {
		for (const key of keys) {
			if (!(key in slice)) {
				// originalRef["a"]["b"][...]
				const strKeys = keys.map(key => `[${JSON.stringify(key)}]`).join("")
				throw new Error(`createSlice: Unreachable path \`originalRef${strKeys}\`.`)
			}
			slice = slice[key]
		}
	}

	// Capture the last reference
	let lastRef = originalRef
	return [
		slice,
		newValue => {
			if (keys === undefined || keys.length === 0) {
				return newValue
			}
			const newRef = {}
			const assignRef = _createAssignmentReference(originalRef, keys, newValue)
			Object.assign(newRef, lastRef, assignRef)
			Object.freeze(newRef)
			lastRef = newRef
			return newRef
		},
	]
}

module.exports = createSlice
