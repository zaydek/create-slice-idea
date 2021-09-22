const createSlice = require("./createSlice")

////////////////////////////////////////////////////////////////////////////////

test("works without keys", () => {
	const data1 = {
		a: "foo",
	}
	const [slice, setSlice] = createSlice(data1)
	expect(slice).toEqual({
		a: "foo",
	})
	const data2 = setSlice({
		a: "bar",
	})
	expect(data2).toEqual({
		a: "bar",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works without keys repeatedly", () => {
	const data1 = {
		a: "foo",
	}
	const [slice, setSlice] = createSlice(data1)
	expect(slice).toEqual({
		a: "foo",
	})
	const data2 = setSlice({
		a: "bar",
	})
	expect(data2).toEqual({
		a: "bar",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice({
		a: "baz",
	})
	expect(data3).toEqual({
		a: "baz",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})

////////////////////////////////////////////////////////////////////////////////

test("works with 1 key", () => {
	const data1 = {
		a: "foo",
	}
	const [slice, setSlice] = createSlice(data1, ["a"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: "bar",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works with 1 key repeatedly", () => {
	const data1 = {
		a: "foo",
	}
	const [slice, setSlice] = createSlice(data1, ["a"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: "bar",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice("baz")
	expect(data3).toEqual({
		a: "baz",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})

test("works with 1 key among many", () => {
	const data1 = {
		a: "foo",
		b: "etc",
	}
	const [slice, setSlice] = createSlice(data1, ["a"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: "bar",
		b: "etc",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works with 1 key repeatedly among many", () => {
	const data1 = {
		a: "foo",
		b: "etc",
	}
	const [slice, setSlice] = createSlice(data1, ["a"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: "bar",
		b: "etc",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice("baz")
	expect(data3).toEqual({
		a: "baz",
		b: "etc",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})

////////////////////////////////////////////////////////////////////////////////

test("works with 2 keys", () => {
	const data1 = {
		a: {
			b: "foo",
		},
	}
	const [slice, setSlice] = createSlice(data1, ["a", "b"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: {
			b: "bar",
		},
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works with 2 keys repeatedly", () => {
	const data1 = {
		a: {
			b: "foo",
		},
	}
	const [slice, setSlice] = createSlice(data1, ["a", "b"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: {
			b: "bar",
		},
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice("baz")
	expect(data3).toEqual({
		a: {
			b: "baz",
		},
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})

test("works with 2 keys among many", () => {
	const data1 = {
		a: {
			b: "foo",
			c: "etc",
		},
		d: "etc",
	}
	const [slice, setSlice] = createSlice(data1, ["a", "b"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: {
			b: "bar",
			c: "etc",
		},
		d: "etc",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
})

test("works with 2 keys repeatedly among many", () => {
	const data1 = {
		a: {
			b: "foo",
			c: "etc",
		},
		d: "etc",
	}
	const [slice, setSlice] = createSlice(data1, ["a", "b"])
	expect(slice).toEqual("foo")
	const data2 = setSlice("bar")
	expect(data2).toEqual({
		a: {
			b: "bar",
			c: "etc",
		},
		d: "etc",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	const data3 = setSlice("baz")
	expect(data3).toEqual({
		a: {
			b: "baz",
			c: "etc",
		},
		d: "etc",
	})
	expect(data1).not.toBe(data2)    // Shallow equality
	expect(data1).not.toEqual(data2) // Deep equality
	expect(data2).not.toBe(data3)    // Shallow equality
	expect(data2).not.toEqual(data3) // Deep equality
})
