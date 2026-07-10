import React, { createContext, useState, useEffect } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('cp_role') || 'student'; // 'student' | 'admin'
  });

  useEffect(() => {
    localStorage.setItem('cp_role', currentRole);
  }, [currentRole]);

  const toggleRole = () => {
    setCurrentRole((prev) => (prev === 'student' ? 'admin' : 'student'));
  };

  const setRole = (role) => {
    if (role === 'student' || role === 'admin') {
      setCurrentRole(role);
    }
  };

  return (
    <RoleContext.Provider value={{ currentRole, toggleRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
