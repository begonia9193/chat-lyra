import { useEffect, useRef, useState } from 'react'
import './App.css'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'


function App() {
  const controlBarIsActiveRef = useRef(false)
  const [translateText, setTranslateText] = useState('')

  useEffect(() => {
    const windowUnActiveListener = () => {
      if (!controlBarIsActiveRef.current) {
        invoke('translate_hide_window')
      }
    }

    window.addEventListener('blur', windowUnActiveListener)

    const translateTextChangeListener = listen('translate_text_change', (event: { payload: string }) => {
      setTranslateText(event.payload)
    })

    return () => {
      window.removeEventListener('blur', windowUnActiveListener)
      translateTextChangeListener.then((unlisten) => unlisten())
    }
  }, [])

  return (
    <main className="w-full h-full">
      <div
        onMouseEnter={() => controlBarIsActiveRef.current = true}
        onMouseLeave={() => controlBarIsActiveRef.current = false}
        data-tauri-drag-region className='w-full h-32px'>
        <span>

        </span>
      </div>
      <h1>{translateText}</h1>，
    </main>
  )
}

export default App
