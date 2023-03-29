import React, { useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppContext } from '../../AppProvider';
import { BASE_URL } from '../../config';
import Loader from '../Loader/Loader';
import './style.css';

const Channels = ({ onClick }) => {
  const channelImageRef = useRef(null);
  const { pages, isLoadingPages } = useContext(AppContext);

  const handleChannelImageError = () => {
    channelImageRef.current.src = `${BASE_URL}/mlabs-logo.svg`;
  };

  const handleClick = (channel) => () => onClick(channel);

  const renderItems = () =>
    pages.map((page) => (
      <li
        key={`channel-${page.channel.id}`}
        ref={channelImageRef}
        className="Channels__Item"
        onClick={handleClick(page.channel)}
        onError={handleChannelImageError}
      >
        <img className="Channels_Image" src={page.image} alt="" />
        <span className="text">{page.channel.name}</span>
      </li>
    ));

  const renderLoader = () => <Loader theme="dark" />;

  return (
    <div className="Channels">
      <h1 className="Title">
        <FormattedMessage id="select_channel" />
      </h1>
      <ul className="Channels__List">{isLoadingPages ? renderLoader() : renderItems()}</ul>
    </div>
  );
};

export default Channels;
