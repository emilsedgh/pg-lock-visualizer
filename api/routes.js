const Locks = require('./models/Locks')

const getLocks = async (req, res) => {
  const locks = await Locks.find({
    from: req.query.from,
    to: req.query.to
  })
  res.json(locks)
}

module.exports = function(app) {
  app.get('/api/locks.json', getLocks)
};