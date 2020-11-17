const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: "Artos Hellas ",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "781-222-3334",
    }, {
        id: 3,
        name: "Danny Abramov",
        number: "219-415-2345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "004-343-22344",
    }

]
const names = persons.map(person => person.name)
const numbers = persons.map(num => num.number)

app.use(express.json())
app.use(cors())

const morganLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


app.use(morgan('tiny'))
app.use(morganLogger)


app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/info', (request, response) => {
    response.send(`Phonebook has ${persons.length} people ${date}`)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personEntry = persons.find(personEntry => personEntry.id === id)

    if (personEntry) {
        response.json(personEntry)
    } else {
        response.status(404).send()
    }
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.floor(Math.random() * (10000 - 4 + 1)) + 4
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (names.includes(body.name) || numbers.includes(body.number)) {
        response.status(400)
        throw new Error("this person already exist");
        return response.json('this person exist already')
    }

    if (!body.name || !body.number) {
        response.status(400)
        throw new Error("Missing name and/or number fields");
        return response.json('Missing name and number')
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number || 0,

    }

    persons = persons.concat(person)

    response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})