import { useState } from 'react'
import './App.css'

function App() {
  fetchtest();

  return (
    <>
      <div className="ui-contain">

        <div className='rather-contain'>
          <div className='left-side'>
            Use neovim for every codebase forever.
          </div>

          <p className='middle-text'>OR</p>

          <div className='right-side'>
            Use vscode for every codebase forever.
          </div>
        </div>

      </div>
    </>
  )
}

async function fetchtest() {
  try {
    const response = await fetch('https://basic-would-you-rather-api.vercel.app/rathers/get/0');

    if (!response.ok) {
      throw new Error(`Request status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error('Network or parsing error: ', err);
  }
}

export default App
