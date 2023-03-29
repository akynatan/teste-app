import React from 'react';
import Loader from '../Loader/Loader';
import StatusIndicatorButton from './StatusIndicatorButton';
import './style.css';

const StatusIndicator = ({ action, subject, status, renderButtonSuccess, renderButtonFailure }) => (
  <div className="StatusIndicator">
    <span className="StatusIndicator__Action">{action}</span>
    <span className="StatusIndicator__Subject">{subject}</span>
    {status === 'loading' && <Loader />}
    {status === 'success' && renderButtonSuccess && renderButtonSuccess()}
    {status === 'failure' && renderButtonFailure && renderButtonFailure()}
  </div>
);

StatusIndicator.StatusIndicatorButton = StatusIndicatorButton;

export default StatusIndicator;
