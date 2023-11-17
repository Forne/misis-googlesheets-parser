import express from 'express';

import ical from 'ical-generator';
import misis from '../../../utils/misis_parser';

const router = express.Router();

router.get('/json', (req, res) => {
  misis.parse().then((i) => {
    res.json(i);
  });
});

router.get('/ics', (req, res) => {
  misis.parse().then((i) => {
    const calendar = ical({ name: 'МИСИС МИСТ-23-3' });
    i.forEach((item) => {
      const index = (item).subject.indexOf('\n');
      const splits = [(item).subject.slice(0, index), (item).subject.slice(index + 1)];
      const event = calendar.createEvent({
        start: new Date((item).start),
        end: new Date((item).end),
        summary: splits[0],
        description: splits[1],
      });
      event.createCategory({ name: 'EDUCATION' });
    });
    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    });
    res.end(calendar.toString());
  });
});

export default router;
