import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Grocery from './Grocery';
import Foods from './Foods';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/Grocery' element={<Grocery />} />
        <Route path='/foods' element={<Foods />} />
      </Routes>
    </Router>
  )
};

export default App;
