// frontend/src/app/components/ui/Button.jsx

import React from 'react';

const Button = ({ children, active, onClick }) => {
  return (
    <button
      className={active ? 'button activeButton' : 'button'}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
