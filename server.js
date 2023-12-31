const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

mongoose.Promise = global.Promise;

const { PORT = 3001, DB_HOST, DB_HOST_TEST, BASE_URL } = process.env;

mongoose
  .connect(DB_HOST_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on ${BASE_URL}`);
    });
  })
  .catch(error => {
    console.error(error.meaage);
    process.exit(1);
  });
