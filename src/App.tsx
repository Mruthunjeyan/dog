import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; 
import Names from './Names'; 
import DogImages from './DogImages';
function App() {
  return (
   <>
    <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/name" element={<Names />} />
                <Route path="/images" element={<DogImages />} />
            </Routes>
        </Router>
   </>
  );
}

export default App;
