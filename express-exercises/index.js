const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', request => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const generateNewId = () => {
    return Math.floor(Math.random() * 100)
}

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const entryCount = persons.length
    const time = new Date()
    response.send(`
        <p>Phonebook has info for ${entryCount} people</p>
        <p>${time}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else { 
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name && !body.number) {
        return response.status(404).json({
            error: 'name and number missing'
        })
    }
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateNewId()
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})