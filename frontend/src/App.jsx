import './App.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import adminRoutes from './routes/AdminRoutes';

function App() {
   const routes =[...UserRoutes,...adminRoutes]
   const router = createBrowserRouter(routes)
  return (
    <>
      
      <RouterProvider router={router}/>
     
    </>
  )
}

export default App
