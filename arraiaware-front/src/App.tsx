import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center text-center text-white">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold text-sky-400">Vite + React</h1>

      <div className="card my-8"> 
        <button
          className="bg-sky-500 hover:bg-sky-600 text-red-500 font-bold py-2 px-4 rounded-lg"
          onClick={() => setCount((count) => count + 1)}
        >
        count is {count}
        </button>
        <p className="mt-4"> 
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-slate-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
