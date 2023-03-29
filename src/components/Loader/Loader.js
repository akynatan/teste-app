import React from 'react';
import './style.css';

const Loader = ({ theme }) => (
  <div className={`Loader ${theme && 'Loader--' + theme}`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Loader;
