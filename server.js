require('dotenv').config()
const mongoose = require("mongoose")


mongoose.connect(process.env.DB_URL.replace("<password>",process.env.DB_PASSWORD), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) console.log(err);
  else  console.log("Database connected successfully")
});



const app = require('./app')

app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server started on port ${process.env.PORT}`);
});
