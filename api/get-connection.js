const pg = require('pg')

const getConnection = async connectionString => {
	const db = new pg.Client({
		connectionString,
		ssl: {
			rejectUnauthorized: false
		}
	})
	await db.connect()
  return db
}

module.exports = getConnection