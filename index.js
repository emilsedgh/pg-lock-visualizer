const pg = require('pg')
const fs = require('fs')

const GET_LOCKS = fs.readFileSync('./query.sql', 'UTF-8')
const SAVE_LOCKS = fs.readFileSync('./save.sql', 'UTF-8')

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const getLocks = async db => {
	const { rows } = await db.query(GET_LOCKS)
	return rows
}

const getConnection = async connectionString => {
  console.log(connectionString)

	const db = new pg.Client({
		connectionString,
		ssl: {
			rejectUnauthorized: false
		}
	})
	await db.connect()
  return db
}

const save = async (db, locks) => {
	const { rows } = await db.query(SAVE_LOCKS, [JSON.stringify(locks)])
  for(const row of rows)
    console.log('Released', row.id)
}

const run = async() => {
  const target = await getConnection(process.env.TARGET_DATABASE_URL)
  const storage = await getConnection(process.env.STORAGE_DATABASE_URL)

  while(true) {
    const locks = await getLocks(target)
    await save(storage, locks)

    await wait(1000)
  }
}

run().then(() => {
	process.exit()
}).catch(e => {
	console.log(e)
	process.exit()
})