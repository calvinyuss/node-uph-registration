const mongoose = require('mongoose');
db = 'mongodb+srv://cyawashere:cywashere@cluster0-eymg3.mongodb.net/test?retryWrites=true&w=majority';
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

