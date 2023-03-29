import { postApi } from './api';

export const SCHEDULE_STATUSES = {
  DRAFT: 9,
};

const buildPost = ({ title, message, date, profiles, channels, images, videos }) => ({
  data: {
    attributes: {
      title,
      message,
      status: SCHEDULE_STATUSES.DRAFT,
      options: [],
      'publish-now': false,
      'profile-ids': profiles,
      'channel-source-ids': channels,
      dates: [
        {
          date,
          'channel-source-ids': channels,
          'post-now': false,
        },
      ],
      'image-objects-attributes': images,
      'video-objects-attributes': videos,
    },
    type: 'schedules',
  },
});

export const createSchedule = async (data) => {
  return postApi.post('/schedules', buildPost(data));
};

export const updateSchedule = async (scheduleId, data) => {
  return postApi.patch('/schedules/' + scheduleId, buildPost(data));
};
