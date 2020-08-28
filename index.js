const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

morgan.token('body', req => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    id: 0,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 1,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 2,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 3,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

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
  const duplicatePerson = persons.find(person => person.name === body.name);

  if (duplicatePerson) {
    return res.status(400).json({
      error: `${duplicatePerson.name} already exists in the phonebook!`
    }).end();
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find(person => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Server running on port ${port}`);
