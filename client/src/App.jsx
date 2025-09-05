import { useState } from 'react'
import ResumeUploader from './Components/ResumeUploader'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ResumeUploader/>        
    </>
  )
}

export default App
