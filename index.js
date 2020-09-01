require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('body', req => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
  res.send(`
    <p>
      Phonebook has info for ${persons.length} people.
    </p>
    
    <p>
      ${new Date()}
    </p>
  `);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'The name is missing!'
    }).end();
  } else if (!body.number) {
    return res.status(400).json({
      error: 'The number is missing!'
    }).end();
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => console.error('Person save failed!', error.message));

  /*
  const duplicatePerson = persons.find(person => person.name === body.name);

  if (duplicatePerson) {
    return res.status(400).json({
      error: `${duplicatePerson.name} already exists in the phonebook!`
    }).end();
  }
   */
});

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(people => {
      res.json(people);
    })
    .catch(error => console.error('Cannot find Person document from database:',error.message));
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find(person => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error))
});

const port = process.env.PORT;
app.listen(port);

console.log(`Server running on port ${port}`);
