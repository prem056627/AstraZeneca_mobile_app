// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import './index.css'
// import App from './App'

// async function enableMocking() {
//   if (process.env.NODE_ENV === 'development') {
//     const { worker } = await import('./mocks/browser')
//     return worker.start({
//       onUnhandledRequest: 'bypass'
//     })
//   }
// }

// enableMocking().then(() => {
//   const root = ReactDOM.createRoot(document.getElementById('root'))
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   )
// })

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

async function enableMocking() {
  if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass'
    })
  }
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})