import logo from './assets/method-logo.png'
import './App.css'

function App() {


  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={logo} alt="" className='w-80 max-w-[500px]' />
        <h2 className='text-4xl font-black text-red-700 mt-4'>Coming Soon</h2>
      </div>
    </div>

  )
}

export default App
