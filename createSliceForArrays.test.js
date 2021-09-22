const createSlice = require("./createSlice")

////////////////////////////////////////////////////////////////////////////////

test("works with 2 keys", () => {
	const data1 = {
		a: [
			"foo",
			"etc",
		],
	}
	const [slice, setSlice] = createSlice(data1, ["a", 0])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: [
			"bar",
			"etc",
		],
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works with 2 keys repeatedly", () => {
	const data1 = {
		a: [
			"foo",
			"etc",
		],
	}
	const [slice, setSlice] = createSlice(data1, ["a", 0])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: [
			"bar",
			"etc",
		],
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice("baz")
	expect(data3).toEqual({
		a: [
			"baz",
			"etc",
		],
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})

////////////////////////////////////////////////////////////////////////////////

test("works with 4 keys", () => {
	const data1 = {
		a: [
			{
				b: [
					"foo",
					"etc",
				],
			},
		],
	}
	const [slice, setSlice] = createSlice(data1, ["a", 0, "b", 0])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: [
			{
				b: [
					"bar",
					"etc",
				],
			},
		],
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works with 4 keys repeatedly", () => {
	const data1 = {
		a: [
			{
				b: [
					"foo",
					"etc",
				],
			},
		],
	}
	const [slice, setSlice] = createSlice(data1, ["a", 0, "b", 0])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: [
			{
				b: [
					"bar",
					"etc",
				],
			},
		],
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice("baz")
	expect(data3).toEqual({
		a: [
			{
				b: [
					"baz",
					"etc",
				],
			},
		],
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})
