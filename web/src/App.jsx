// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Game from './pages/Game';
import Gamers from './pages/Gamers';
import Chat from './pages/Chat';
import ChatRoom from './pages/ChatRoom';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/game' element={<Game/>}/>
      <Route path='/gamers' element={<Gamers/>}/>
      <Route path='/chat' element={<Chat/>}/>
      <Route path='/chat/:chatId' element={<ChatRoom/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
  );
};

export default App;
