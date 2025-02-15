import React from 'react';
import Sidebar from './components/sidebar/Sidebar.js';

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        {/* Your main content here */}
      </main>
    </div>
  );
};

export default App;