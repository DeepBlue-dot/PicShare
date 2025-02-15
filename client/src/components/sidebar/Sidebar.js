import React, { useState } from 'react';
import { FiHome, FiCompass, FiUser, FiBookmark, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Sidebar.css';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
        {isOpen && <h2 className="logo">Pinspired</h2>}
      </div>

      <nav className="sidebar-nav">
        <NavItem icon={<FiHome />} text="Home" isOpen={isOpen} />
        <NavItem icon={<FiCompass />} text="Explore" isOpen={isOpen} />
        <NavItem icon={<FiUser />} text="Profile" isOpen={isOpen} />
        <NavItem icon={<FiBookmark />} text="Saved" isOpen={isOpen} />
        <NavItem icon={<FiSettings />} text="Settings" isOpen={isOpen} />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, text, isOpen }) => {
  return (
    <button className="nav-item">
      <span className="icon">{icon}</span>
      {isOpen && <span className="text">{text}</span>}
    </button>
  );
};

export default Sidebar;