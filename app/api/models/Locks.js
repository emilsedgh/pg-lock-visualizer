const fs = require('fs')

const getConnection = require('../get-connection')

const FIND = fs.readFileSync(`${__dirname}/find.sql`, 'UTF-8')

const find = async ({ from, to }) => {
  const db = await getConnection(process.env.STORAGE_DATABASE_URL)
  await db.query('SET TIME ZONE \'UTC\'')
  const { rows } = await db.query(FIND, [from || null, to || null])
  await db.end()
  
  return rows
}

module.exports = { find }