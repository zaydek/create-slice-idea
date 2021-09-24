const esbuild = require("esbuild")

module.exports = {
	process(contents, filename) {
		let loader = "jsx"
		if (filename.endsWith(".ts")) {
			loader = "ts"
		} else if (filename.endsWith(".tsx")) {
			loader = "tsx"
		}
		const { code } = esbuild.transformSync(contents, {
			format: "cjs",
			loader,
			sourcefile: filename,
			sourcemap: "inline",
		})
		return code
	},
}
