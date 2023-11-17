var express = require('express');
var gSpreadsheet = require("../../utils/google_spread");
var router = express.Router();

/* GET home page. */
router.get('/json', function(req, res, next) {
  let gs = new gSpreadsheet('1NlUU1ulotC5Kjiz-ctVhzwyAcyEWbK2ZY5eA4Z2PKoQ');
  let result = {}
  gs.parse().then(items => {
    res.json(items);
  })
  /*res.render('index', { title: 'Express' });*/
});

module.exports = router;
