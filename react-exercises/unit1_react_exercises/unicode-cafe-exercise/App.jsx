import { useState } from 'react'

const Button = ({ onClick, text }) => (
    <button onClick={onClick}>{text}</button>
)

const Statistics = ({ good, neutral, bad }) => {

    const total = good + neutral + bad
    const average = total ? (good - bad) / total : 0
    const percentage = total ? (good * 100 / total) : 0

    if (total === 0) {
        return <div>No feedback given</div>
    }

    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={total} />
                <StatisticLine text="average" value={average} />
                <StatisticLine text="percentage" value={`${percentage}%`} />
            </tbody>
        </table>
    )
}

const StatisticLine = ({ text, value }) => (
    <tr>
        <td>{text}</td> 
        <td>{value}</td>
    </tr>
)

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    
    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={() => setGood(value => value + 1)} text="good" />
            <Button onClick={() => setNeutral(value => value + 1)} text="neutral" />
            <Button onClick={() => setBad(value => value + 1)} text="bad" />
            <h1>statistics</h1>
            <Statistics 
                good={good}
                neutral={neutral}
                bad={bad}
            />
        </div>
    )
}

export default App