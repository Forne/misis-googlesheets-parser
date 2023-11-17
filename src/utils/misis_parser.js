import GoogleSheets from './google_sheets';

const monthsMap = {
  Январь: 1,
  Февраль: 2,
  Март: 3,
  Апрель: 4,
  Май: 5,
  Июнь: 6,
  Июль: 7,
  Август: 8,
  Сентябрь: 9,
  Октябрь: 10,
  Ноябрь: 11,
  Декабрь: 12,
};

class MisisParser {
  static parse() {
    const gs = new GoogleSheets('1NlUU1ulotC5Kjiz-ctVhzwyAcyEWbK2ZY5eA4Z2PKoQ');
    return gs.parse().then((items) => {
      // Var for iterations
      const currentYear = 2023;
      let currentMonth = '';
      let currentSubject = '';
      let currentTypeOfCert = '';
      const events = [];

      // Process months
      const months = items.table.cols;
      for (let i = 0; i < months.length; i += 1) {
        if (months[i] && months[i].label !== '') {
          let t = months[i].label.split(' ');
          t = t[t.length - 1];
          if (monthsMap[t]) {
            currentMonth = monthsMap[t];
          }
        }
        months[i] = currentMonth;
      }

      // TODO: Check meta [C4:F4]

      // Process days
      const days = items.table.rows[2].c;
      for (let i = 0; i < days.length; i += 1) {
        if (days[i] && days[i].v) {
          const t = Date.parse(`${currentYear}-${months[i]}-${days[i].v} 00:00:00 GMT`);
          if (t > 1693508400000) {
            // TODO: check for 2024y
            days[i] = t;
          } else {
            days[i] = null;
          }
        }
      }

      // Process subjects [C:C]
      for (let i = 3; i < items.table.rows.length; i += 1) {
        // Check time in row [F:F]
        if (items.table.rows[i].c[5]) {
          // Check for present subject title
          let pair = '';
          if (items.table.rows[i].c[2] && items.table.rows[i].c[2].v) {
            currentSubject = items.table.rows[i].c[2].v.trim();
          }

          if (items.table.rows[i].c[3] && items.table.rows[i].c[3].v) {
            currentTypeOfCert = items.table.rows[i].c[3].v.trim();
          }

          if (items.table.rows[i].c[4] && items.table.rows[i].c[4].v) {
            pair = items.table.rows[i].c[4].v;
          }

          // Detect time
          const time = items.table.rows[i].c[5].v.split(' - ');
          const start = Date.parse(`Thu, 01 Jan 1970 ${time[0]} GMT+0300`);
          const end = Date.parse(`Thu, 01 Jan 1970 ${time[1]} GMT+0300`);

          // Iterate days
          for (let j = 7; j < months.length; j += 1) {
            if (items.table.rows[i].c[j] && items.table.rows[i].c[j].v) {
              const e = {
                start: days[j] + start,
                end: days[j] + end,
                subject: currentSubject,
                pair,
                typeOfCert: currentTypeOfCert,
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

export default MisisParser;
