const gSpreadsheet = require('./google_sheets');

const monthsMap = {
  'Январь': 1,
  'Февраль': 2,
  'Март': 3,
  'Апрель': 4,
  'Май': 5,
  'Июнь': 6,
  'Июль': 7,
  'Август': 8,
  'Сентябрь': 9,
  'Октябрь': 10,
  'Ноябрь': 11,
  'Декабрь': 12,
};

class misisParser {
  static parse() {
    let gs = new gSpreadsheet('1NlUU1ulotC5Kjiz-ctVhzwyAcyEWbK2ZY5eA4Z2PKoQ');
    return gs.parse().then(items => {
      // Var for iterations
      let currentYear = 2023;
      let currentMonth = '';
      let currentSubject = '';
      let events = [];

      // Process months
      let months = items['table']['cols'];
      for (let i = 0; i < months.length; i++) {
        if (months[i] && months[i]['label'] !== '') {
          let t = months[i]['label'].split(' ');
          t = t[t.length - 1];
          if (monthsMap[t]) {
            currentMonth = monthsMap[t];
          }
        }
        months[i] = currentMonth;
      }

      // TODO: Check meta [C4:F4]

      // Process days
      let days = items['table']['rows'][2]['c'];
      for (let i = 0; i < days.length; i++) {
        if (days[i] && days[i]['v']) {
          let t = Date.parse(`${currentYear}-${months[i]}-${days[i]['v']} 00:00:00 GMT`);
          if (t > 1693508400000) {
            // TODO: check for 2024y
            days[i] = t;
          } else {
            days[i] = null;
          }
        }
      }

      // Process subjects [C:C]
      for (let i = 3; i < items['table']['rows'].length; i++) {
        // Check time in row [F:F]
        if (items['table']['rows'][i]['c'][5]) {
          // Check for present subject title
          if (items['table']['rows'][i]['c'][2] && items['table']['rows'][i]['c'][2]['v']) {
            currentSubject = items['table']['rows'][i]['c'][2]['v'].trim();
          }

          // Detect time
          let time = items['table']['rows'][i]['c'][5]['v'].split(' - ');
          let start = Date.parse(`Thu, 01 Jan 1970 ${time[0]} GMT+0300`);
          let end = Date.parse(`Thu, 01 Jan 1970 ${time[1]} GMT+0300`);

          // Iterate days
          for (let j = 7; j < months.length; j++) {
            if (items['table']['rows'][i]['c'][j] && items['table']['rows'][i]['c'][j]['v']) {
              let e = {
                start: days[j] + start,
                end: days[j] + end,
                subject: currentSubject,
              };
              events.push(e);
            }
          }
        }
      }
      return events;
    });
  }
}

module.exports = misisParser;