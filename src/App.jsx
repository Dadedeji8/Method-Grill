// import logo from './assets/method-logo.png'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import AdmionPage from './pages/AdminPage.jsx'
import MenuPage from './pages/menu/MenuPage.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
function App() {


  return (
    // <div className="App">
    //   <div className="flex flex-col items-center justify-center h-screen">
    //     <img src={logo} alt="" className='w-80 max-w-[500px]' />
    //     <h2 className='text-4xl font-black text-red-700 mt-4'>Coming Soon</h2>
    //   </div>
    // </div>
    <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <Router>
        <Routes>
          <Route path="/" element={<ComingSoon />} />
          <Route path="/admin" element={<AdmionPage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
