import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppContext } from '../../AppProvider';
import { PUBLICACAO_URL } from '../../config';
import {
  trackPowerUpDraftScheduleCreated,
  trackPowerUpDraftScheduleError,
  trackPowerUpDraftScheduleUpdated,
  trackPowerUpLink,
  trackPowerUpRequired,
  trackPowerUpSelectChannel,
  trackPowerUpSelectProfile,
  trackPowerUpTryAgain
} from '../../services/EventTracking';
import { uploadImage, uploadVideo } from '../../services/FilesService';
import { createSchedule, updateSchedule } from '../../services/PostService';
import Channels from '../Channels';
import Profiles from '../Profiles';
import StatusIndicator from '../StatusIndicator';
import './style.css';

const Schedule = () => {
  const {
    isFirstPost,
    getCurrentCard,
    token,
    profileId,
    channelId,
    setProfileId,
    setChannelId,
    storeScheduleId,
    getStoredScheduleId,
    registerFirstPost,
  } = useContext(AppContext);

  const [uploadError, setUploadError] = useState(false);

  const [scheduleStep, setScheduleStep] = useState(null);

  const [scheduleId, setScheduleId] = useState(null);

  const [scheduleStatus, setScheduleStatus] = useState({
    action: <FormattedMessage id="creating_your" />,
    subject: <FormattedMessage id="schedule" />,
    status: 'loading',
  });

  const uploadMedias = async (attachments) => {
    try {
      setScheduleStep('upload');

      setScheduleStatus({
        action: <FormattedMessage id="uploading" />,
        subject: <FormattedMessage id="attachments" />,
        status: 'loading',
      });

      const medias = await Promise.all(
        attachments.map(async (attachment, position) => {
          try {
            if (/\.(mp4|mkv|divx)$/.test(attachment.url)) {
              const data = await uploadVideo(attachment);
              return { type: 'video', data: { ...data, position } };
            } else {
              const data = await uploadImage(attachment);
              return { type: 'image', data: { ...data, position } };
            }
          } catch (err) {
            setUploadError(true);

            return {};
          }
        })
      );

      return medias.reduce(
        (all, current) => {
          if (current.type === 'video') {
            return {
              images: [...all.images],
              videos: [...all.videos, current.data],
            };
          } else if (current.type === 'image') {
            return {
              images: [...all.images, current.data],
              videos: [...all.videos],
            };
          }

          return all;
        },
        {
          images: [],
          videos: [],
        }
      );
    } catch (err) {
      return {
        images: [],
        videos: [],
      };
    }
  };

  const handleSchedule = async () => {
    try {
      const card = await getCurrentCard();
      const scheduleId = await getStoredScheduleId();

      setScheduleId(scheduleId);

      if (!card.desc || !card.due) {
        setScheduleStep('require');

        setScheduleStatus({
          action: <FormattedMessage id="description_and_date" />,
          subject: <FormattedMessage id="required" />,
          status: 'failure',
        });

        await trackPowerUpRequired();

        return;
      }

      let medias = {
        images: [],
        videos: [],
      };

      if (card.attachments && card.attachments.length > 0) {
        medias = await uploadMedias(card.attachments.reverse());
      }

      if (uploadError) {
        setScheduleStep('failure');

        setScheduleStatus({
          action: <FormattedMessage id="failure_at" />,
          subject: 'upload',
          status: 'failure',
        });

        return;
      }

      const data = {
        title: card.title,
        message: card.desc,
        date: card.due,
        profiles: [profileId],
        channels: [channelId],
        images: medias.images.map((media, index) => ({
          id: null,
          'image-id': media.image_id,
          position: media.position,
        })),
        videos: medias.videos.map((media, index) => ({
          id: null,
          'video-id': media.video_id,
          position: media.position,
        })),
      };

      let draft = {};

      if (scheduleId) {
        setScheduleStatus({
          action: <FormattedMessage id="updating_your" />,
          subject: <FormattedMessage id="schedule" />,
          status: 'loading',
        });

        draft = await updateSchedule(scheduleId, data);
      } else {
        setScheduleStatus({
          action: <FormattedMessage id="creating_your" />,
          subject: <FormattedMessage id="schedule" />,
          status: 'loading',
        });

        draft = await createSchedule(data);
      }

      if (draft) {
        await storeScheduleId(draft.data.data.id);

        setScheduleId(draft.data.data.id);

        setScheduleStep('done');

        if (isFirstPost) {
          setScheduleStatus({
            action: <FormattedMessage id="congratulations" values={{ br: <br /> }} />,
            subject: <FormattedMessage id="schedule" />,
            status: 'success',
          });

          registerFirstPost();
        } else {
          setScheduleStatus({
            action: scheduleId ? (
              <FormattedMessage id="Draft" />
            ) : (
              <FormattedMessage id="scheduled_as" />
            ),
            subject: scheduleId ? (
              <FormattedMessage id="updated" />
            ) : (
              <FormattedMessage id="draft" />
            ),
            status: 'success',
          });
        }

        if (scheduleId) {
          await trackPowerUpDraftScheduleUpdated();
        } else {
          await trackPowerUpDraftScheduleCreated();
        }
      } else {
        setScheduleStep('failure');

        setScheduleStatus({
          action: <FormattedMessage id="failure_to" />,
          subject: <FormattedMessage id="to_schedule" />,
          status: 'failure',
        });

        await trackPowerUpDraftScheduleError();
      }
    } catch (err) {
      setScheduleStatus({
        action: <FormattedMessage id="failure_to" />,
        subject: <FormattedMessage id="to_schedule" />,
        status: 'failure',
      });

      await trackPowerUpDraftScheduleError();
    }
  };

  const handleScheduleRetry = () => {
    setScheduleStep('create');

    setScheduleStatus({
      action: <FormattedMessage id="creating_your" />,
      subject: <FormattedMessage id="schedule" />,
      status: 'loading',
    });

    trackPowerUpTryAgain();
  };

  const handleSelectProfile = (profile) => {
    setProfileId(profile.id);

    trackPowerUpSelectProfile(profile.name);
  };

  const handleSelectChannel = (channel) => {
    setChannelId(channel.id);

    trackPowerUpSelectChannel(channel.name);

    setScheduleStep('create');
  };

  const generateScheduleLink = () => {
    if (scheduleId) {
      return `${PUBLICACAO_URL}/session/new/${token}?profileId=${profileId}&routeTo=schedule.edit&id=${scheduleId}`;
    }

    return `${PUBLICACAO_URL}/session/new/${token}?profileId=${profileId}&routeTo=schedules`;
  };

  const redirectToSchedule = () => {
    trackPowerUpLink();
  };

  const renderProfileSelection = () => <Profiles onClick={handleSelectProfile} />;

  const renderChannelSelection = () => <Channels onClick={handleSelectChannel} />;

  const renderScheduleStatus = () => {
    return (
      <StatusIndicator
        action={scheduleStatus.action}
        subject={scheduleStatus.subject}
        status={scheduleStatus.status}
        renderButtonSuccess={() => (
          <StatusIndicator.StatusIndicatorButton
            text={<FormattedMessage id="open_mlabs" />}
            href={generateScheduleLink()}
            onClick={redirectToSchedule}
          />
        )}
        renderButtonFailure={() => (
          <StatusIndicator.StatusIndicatorButton
            text={<FormattedMessage id="try_again" />}
            onClick={handleScheduleRetry}
          />
        )}
      />
    );
  };

  useEffect(() => {
    if (scheduleStep === 'create') {
      handleSchedule();
    }
  }, [scheduleStep]);

  if (!profileId) {
    return <div className="Schedule">{renderProfileSelection()}</div>;
  }

  if (!channelId) {
    return <div className="Schedule">{renderChannelSelection()}</div>;
  }

  return <div className="Schedule">{renderScheduleStatus()}</div>;
};

export default Schedule;
