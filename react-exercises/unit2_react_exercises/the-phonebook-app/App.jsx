import { useState, useEffect } from 'react'
import personsService from './services/persons'

const Persons = ({ persons, handleDelete }) =>
  persons.map(person =>
    <div key={person.id}>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
    </div>
  )

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with:
    <input
      value={filter}
      onChange={handleFilterChange}
    />
  </div>
)

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name:
      <input
        value={newName}
        onChange={handleNameChange}
      />
    </div>
    <div>
      number:
      <input
        value={newNumber}
        onChange={handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Notification = ({ message, status }) => {
  if (message === null) return null

  return (
    <div className='notification' style={{ color: status === 'success' ? 'green' : 'red' }}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, status: 'success' })

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personsService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNotification({ message: `Updated ${updatedPerson.name}'s number.`, status: 'success' })
            setTimeout(() => {
              setNotification({ message: null, status: 'success' })
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setNotification({ message: `Failed to update ${updatedPerson.name}.`, status: 'fail' })
            setTimeout(() => {
              setNotification({ message: null, status: 'fail' })
            }, 5000)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personsService
        .create(newPerson)
        .then(person => {
          setPersons(persons.concat(person))
          setNotification({ message: `Added ${newPerson.name} to the server.`, status: 'success' })
          setTimeout(() => {
            setNotification({ message: null, status: 'success' })
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          setNotification({ message: `Failed to add ${newPerson.name}.`, status: 'fail' })
          setTimeout(() => {
            setNotification({ message: null, status: 'fail' })
          }, 5000)
        })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setTimeout(() => {
            setNotification({ message: `${name} has successfully been deleted from the server.`, status: 'success' })
          }, 5000)
        })
        .catch(() => {
          setNotification({ message: `${name} has already been deleted from the server.`, status: 'fail' })
          setTimeout(() => {
            setNotification({ message: null, status: 'fail' })
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToDisplay = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} status={notification.status} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a New</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} handleDelete={handleDelete} />
    </div>
  )
}

export default App
