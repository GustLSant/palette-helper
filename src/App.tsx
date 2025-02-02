import MainPage from './pages/MainPage'
import './output.css'

// arquivo para controlar qual pagina sera exibida no momento


function App(){
  return(
    <div className='min-h-screen max-w-[2000px] m-auto pb-6 bg-gray-200'>
      <MainPage />
    </div>
  )
}

export default App
