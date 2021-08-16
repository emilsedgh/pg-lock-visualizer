const pg = require('pg')
const fs = require('fs')
const graphviz = require('graphviz')
const { sortBy } = require('lodash')

const query = fs.readFileSync('./query.sql', 'UTF-8')

const getLocks = async () => {
	const db = new pg.Client({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		}

	})
	await db.connect()

	const { rows } = await db.query(query)
	return rows
}

const draw = async locks => {
	const graph = graphviz.digraph('G')

	const nodes = {}

	const getNode = id => {
		if (nodes[id])
			return nodes[id]

		const node = graph.addNode(id)
		node.blocked = 0
		node.blocking = 0
		node.set('style', 'filled')
		nodes[id] = node
		return node
	}


	for(const locked of locks) {
		const blocked = getNode(locked.blocked_pid)
		const blocking = getNode(locked.blocking_pid)

		blocked.blocked++
		blocking.blocking++

		graph.addEdge(blocked, blocking)
	}

	const sorted = sortBy(Object.values(nodes), 'blocking')
	const worst = sorted[sorted.length - 1]

	if (worst) {
		worst.set('bgcolor', 'red')
		worst.set('color', 'red')
		worst.set('center', true)
	}

	Object.values(nodes).forEach(node => {
		node.set('xlabel', `${node.blocking}, ${node.blocked}`)
		if (node.blocked === 0)
			node.set('color', 'green')
	})


	return new Promise((resolve, reject) => {
		const callback = buffer => {
			fs.promises.writeFile(process.argv[2], buffer).then(resolve).catch(reject)
		}
		graph.output('png', callback, reject)
	})
}

const run = async() => {
	const locks = await getLocks()
	await draw(locks)
}

run().then(() => {
	process.exit()
}).catch(e => {
	console.log(e)
	process.exit()
})