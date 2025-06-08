import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Grocery from './Grocery';
import Foods from './Foods';
import './App.css';
import VegetablesAndFruits from './VegetablesAndfruits';
import Toyboxz from './ToyBoxz';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/Grocery' element={<Grocery />} />
        <Route path='/foods' element={<Foods />} />
        <Route path='/VegetablesAndFruits' element={<VegetablesAndFruits/>} />
        <Route path='/toyboxz' element={<Toyboxz/>} />
      </Routes>
    </Router>
  )
};

export default App;
