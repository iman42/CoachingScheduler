import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Coaches from './Coaches'
import Students from './Students';
const App = () => {
  return (
    <div>
      {/* Other common components or layout can be added here */}
      <Routes>
        <Route path="/coach/:id" element={<Coaches/> } />
        <Route path="/student/:id" element={<Students/> } />
      </Routes>
    </div>
  );
};

export default App;