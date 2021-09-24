export const initialState = {
	form: {
		checked: false,
		value: "",
	},
	todos: [],
}

////////////////////////////////////////////////////////////////////////////////

function _editValue(state, { value }) {
	return {
		...state,
		form: {
			...state.form,
			value,
		},
	}
}

function _editChecked(state, { checked }) {
	return {
		...state,
		form: {
			...state.form,
			checked,
		},
	}
}

function _addTodo(state) {
	return {
		...state,
		form: {
			...state.form,
			value: "", // Reset
		},
		todos: [
			{
				id: Math.random().toString(36).slice(2, 8),
				checked: state.form.checked,
				value: state.form.value,
			},
			...state.todos,
		],
	}
}

function _editCheckedByIndex(state, { checked, todoIndex }) {
	return {
		...state,
		todos: [
			...state.todos.slice(0, todoIndex),
			{
				...state.todos[todoIndex],
				checked,
			},
			...state.todos.slice(todoIndex + 1),
		],
	}
}

function _editValueByIndex(state, { value, todoIndex }) {
	return {
		...state,
		todos: [
			...state.todos.slice(0, todoIndex),
			{
				...state.todos[todoIndex],
				value,
			},
			...state.todos.slice(todoIndex + 1),
		],
	}
}

function _removeTodoByIndex(state, { todoIndex }) {
	return {
		...state,
		todos: [
			...state.todos.slice(0, todoIndex),
			...state.todos.slice(todoIndex + 1),
		],
	}
}

////////////////////////////////////////////////////////////////////////////////

export function reducer(state, action) {
	// console.log(`reducer: action.type=${action.type}`)
	switch (action.type) {
		case "EDIT_VALUE":
			return _editValue(state, action.data)
		case "EDIT_CHECKED":
			return _editChecked(state, action.data)
		case "ADD_TODO":
			return _addTodo(state, action.data)
		case "EDIT_CHECKED_BY_INDEX":
			return _editCheckedByIndex(state, action.data)
		case "EDIT_VALUE_BY_INDEX":
			return _editValueByIndex(state, action.data)
		case "REMOVE_TODO_BY_INDEX":
			return _removeTodoByIndex(state, action.data)
		default:
			throw new Error("Internal error")
	}
}
