const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  number: String,
});
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
