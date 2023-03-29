import React from 'react';

const StatusIndicatorButton = ({ text, onClick, href }) =>
  href ? (
    <a
      className="StatusIndicator__Button"
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
    >
      {text}
    </a>
  ) : (
    <button className="StatusIndicator__Button" type="button" onClick={onClick}>
      {text}
    </button>
  );

export default StatusIndicatorButton;
