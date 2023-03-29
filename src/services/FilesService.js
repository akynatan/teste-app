import { FILES_URL } from '../config';

export const uploadImage = async ({ url }) => {
  try {
    const body = new FormData();
    body.append('image[s3_url]', url);

    const response = await fetch(`${FILES_URL}/images`, {
      body,
      method: 'POST',
    });

    const data = await response.json();

    return data;
  } catch (err) {
    // TODO: Handle error
  }
};

export const uploadVideo = async ({ url }) => {
  try {
    const body = new FormData();
    body.append('video[s3_url]', url);

    const response = await fetch(`${FILES_URL}/videos`, {
      body,
      method: 'POST',
    });

    const data = await response.json();

    return data;
  } catch (err) {
    // TODO: Handle error
  }
};
