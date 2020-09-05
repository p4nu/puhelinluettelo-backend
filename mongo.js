const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please enter a password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.yaykz.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });

      return person
        .save()
        .then(() => console.log('Person saved!'))
        .catch(error => console.error('Person not saved:', error))
        .finally(() => mongoose.connection.close());
    }

    Person
      .find({})
      .then(people => {
        console.log('Phonebook:');

        people.forEach(person => console.log(person.name, person.number));
      })
      .catch(error => console.error('Finding people collection failed:', error))
      .finally(() => mongoose.connection.close());
  })
  .catch(error => console.error('Database connection error:', error));
