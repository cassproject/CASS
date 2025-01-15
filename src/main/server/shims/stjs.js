
if (!String.prototype.startsWith) {
	String.prototype.startsWith=function(start, from){
		var f = from != null ? from : 0;
		return this.substring(f, f + start.length) == start;
	}
}

if (!Promise.map) {
	Promise.map = function (iterable, mapper, options = {}) {
		let concurrency = options.concurrency || Infinity

		let index = 0
		const results = []
		const pending = []
		const iterator = iterable[Symbol.iterator]()

		while (concurrency-- > 0) {
			const thread = wrappedMapper()
			if (thread) pending.push(thread)
			else break
		}

		return Promise.all(pending).then(() => results)

		function wrappedMapper() {
			const next = iterator.next()
			if (next.done) return null
			const i = index++
			const mapped = mapper(next.value, i)
			return Promise.resolve(mapped).then(resolved => {
				results[i] = resolved
				return wrappedMapper()
			})
		}
	}
}