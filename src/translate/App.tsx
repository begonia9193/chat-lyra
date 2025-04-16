import { useEffect, useRef } from 'react'
import './App.css'
import { invoke } from '@tauri-apps/api/core'


function App() {
  const controlBarIsActiveRef = useRef(false)

  useEffect(() => {
    const windowUnActiveListener = () => {
      if (!controlBarIsActiveRef.current) {
        invoke('translate.hide_window')
      }
    }

    window.addEventListener('blur', windowUnActiveListener)
    return () => {
      window.removeEventListener('blur', windowUnActiveListener)
    }
  }, [])

  return (
    <main className="w-full h-full">
      <div
        onMouseEnter={() => controlBarIsActiveRef.current = true}
        onMouseLeave={() => controlBarIsActiveRef.current = false}
        data-tauri-drag-region className='w-full h-40px bg-gray'>

      </div>
      <h1>Welcome to Translate Page</h1>
    </main>
  )
}

export default App
