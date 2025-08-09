// import logo from './assets/method-logo.png'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import AdminPage from './pages/AdminPage.jsx'
import MenuPage from './pages/menu/MenuPage.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { AppContextProvider } from './contexts/AppContext.jsx'

function App() {
  return (
    <AppContextProvider>
      <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <Router>
          <Routes>
            <Route path="/" element={<ComingSoon />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </Router>
      </div>
    </AppContextProvider>
  )
}

export default App
