import MainPage from './pages/MainPage'
import './output.css'

// arquivo para controlar qual pagina sera exibida no momento


function App(){
  return(
    <div className='flex flex-col h-screen overflow-y-auto bg-gray-200'>
      <MainPage />
    </div>
  )
}

export default App
