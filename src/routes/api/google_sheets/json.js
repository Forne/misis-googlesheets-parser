import express from 'express';
import googleSheets from '../../../utils/google_sheets';

let router = express.Router();

router.get('/json', function(req, res, next) {
  let gs = new googleSheets('1NlUU1ulotC5Kjiz-ctVhzwyAcyEWbK2ZY5eA4Z2PKoQ');
  gs.parse().then(items => {
    res.json(items);
  })
});

module.exports = router;
