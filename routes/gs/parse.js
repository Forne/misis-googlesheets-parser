var express = require('express');
var misis = require("../../utils/misis_parser");
var ical = require('../../utils/ical.cjs');
var router = express.Router();


/* GET home page. */
router.get('/parse', function(req, res, next) {
    let events = misis.parse().then(i => {
      res.json(i);
    })
});

router.get('/ical', function(req, res, next) {
  let events = misis.parse().then(i => {
      const calendar = new ical.ICalCalendar({name: 'МИСИС МИСТ-23-3'});
      for (let j = 0; j < i.length; j++) {
          var index = i[j]['subject'].indexOf('\n');
          var splits = [i[j]['subject'].slice(0,index), i[j]['subject'].slice(index+1)];
          const event = calendar.createEvent({
              start: new Date(i[j]['start']),
              end: new Date(i[j]['end']),
              summary: splits[0],
              description: splits[1],
          });
          event.createCategory({name: 'EDUCATION'});
      }
      res.writeHead(200, {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="calendar.ics"'
      });
      res.end(calendar.toString());
  })
});

module.exports = router;
