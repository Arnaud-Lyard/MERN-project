import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages && components
import Projects from './pages/Projects'
import Navbar from './components/Navbar'
import Login from './pages/login';
import Signup from './pages/Signup';
import ProjectDetails from './pages/ProjectDetail'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/projets" element={<Projects />}/>
            <Route path="/projets/:id" element={<ProjectDetails />}/>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
