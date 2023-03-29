import React, { useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppContext } from '../../AppProvider';
import { BASE_URL } from '../../config';
import './style.css';

const Profiles = ({ onClick }) => {
  const profileImageRef = useRef(null);
  const { profiles } = useContext(AppContext);

  const handleProfileImageError = () => {
    profileImageRef.current.src = `${BASE_URL}/mlabs-logo.svg`;
  };

  const handleClick = (profile) => () => onClick(profile);

  const renderItems = () =>
    profiles.map((profile) => (
      <li key={`profile-${profile.id}`} className="Profiles__Item" onClick={handleClick(profile)}>
        <img
          className="Profiles_Image"
          src={profile.image}
          ref={profileImageRef}
          onError={handleProfileImageError}
        />
        <span className="text">{profile.name}</span>
      </li>
    ));

  return (
    <div className="Profiles">
      <h1 className="Title">
        <FormattedMessage id="select_profile" />
      </h1>
      <ul className="Profiles__List">{renderItems()}</ul>
    </div>
  );
};

export default Profiles;
