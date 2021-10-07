var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res) {
  res.json({ message: 'API no ar' })
})

router.get('/detail', function (req, res) {
  res.json({ name: 'Jamal', Experience: 5 })
})

module.exports = router
