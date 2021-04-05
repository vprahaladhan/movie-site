let path = require('path');
let express = require('express');

const app = express();

if (process.env.NODE_ENV == 'development') {
  console.log('Deve mode? ', process.env.NODE_ENV);
  require('dotenv').config({ silent: true });
}

app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});