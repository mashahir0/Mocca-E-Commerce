import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLoginPage from './pages/user/UserLoginPage';
import UserRegPage from './pages/user/UserRegPage';
import ForgotPage from './pages/user/ForgotPage';
import HomePage from './pages/user/HomePage';

function App() {
 
  return (
    <>
     <Router>
      <Routes>
        <Route path='/login' element={<UserLoginPage/>}/>
        <Route path='/register' element={<UserRegPage/>}/>
        <Route path='/forgotpass' element={<ForgotPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
     </Router>

     
    </>
  )
}

export default App
