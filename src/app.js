import express from 'express';
import bodyParser from 'body-parser';

import routerApiGS from './routes/api/google_sheets/json';
import routerApiMisis from './routes/api/parser/misis';

const app = express();
app.use(bodyParser.json());

app.use('/api/google_sheets', routerApiGS);
app.use('/api/misis', routerApiMisis);

app.listen(3000, () => {
  console.log('app is listening to port 3000');
});
