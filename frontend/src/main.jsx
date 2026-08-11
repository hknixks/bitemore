import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <HashRouter > */}
      <BrowserRouter >
        <App />
      </BrowserRouter >
      {/* </HashRouter > */}
    </Provider>
  </React.StrictMode>,
)
