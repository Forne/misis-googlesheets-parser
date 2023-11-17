import express from 'express';

import misis from '../../../utils/misis_parser';
import ical from 'ical-generator'

let router = express.Router();

router.get('/json', function(req, res, next) {
  misis.parse().then(i => {
    res.json(i);
  });
});

router.get('/ics', function(req, res, next) {
  misis.parse().then(i => {
    const calendar = ical({ name: 'МИСИС МИСТ-23-3' });
    for (let j = 0; j < i.length; j++) {
      let index = i[j]['subject'].indexOf('\n');
      let splits = [i[j]['subject'].slice(0, index), i[j]['subject'].slice(index + 1)];
      const event = calendar.createEvent({
        start: new Date(i[j]['start']),
        end: new Date(i[j]['end']),
        summary: splits[0],
        description: splits[1],
      });
      event.createCategory({ name: 'EDUCATION' });
    }
    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    });
    res.end(calendar.toString());
  });
});

module.exports = router;
