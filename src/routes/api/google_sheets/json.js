import express from 'express';
import GoogleSheets from '../../../utils/google_sheets';

const router = express.Router();

router.get('/json', (req, res) => {
  const gs = new GoogleSheets('1NlUU1ulotC5Kjiz-ctVhzwyAcyEWbK2ZY5eA4Z2PKoQ');
  gs.parse().then((items) => {
    res.json(items);
  });
});

export default router;
