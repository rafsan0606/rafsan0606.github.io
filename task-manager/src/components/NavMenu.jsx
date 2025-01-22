import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavMenu = ({ tasks }) => {
  return (
    <>
      {tasks.map(task => (
        <li key={task.id}>
          <NavLink to={`/task/${task.id}`} className={({ isActive }) => (isActive ? 'active' : '')}>
            {task.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default NavMenu;
