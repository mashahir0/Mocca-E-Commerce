import './App.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';

function App() {
   const routes =[...UserRoutes]
   const router = createBrowserRouter(routes)
  return (
    <>
      
      <RouterProvider router={router}/>
     
    </>
  )
}

export default App
