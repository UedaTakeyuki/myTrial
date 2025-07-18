import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Alert } from './Alert'; 

function App() {
  return (
    <Alert type="information" heading="Success" closable>
      Everything is really good!
    </Alert>
  );
}

export default App
