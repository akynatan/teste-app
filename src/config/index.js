const ENVIRONMENT = {
  local: {
    app: 'http://localhost:4000',
    core: 'http://localhost:3001',
    post: 'http://localhost:3003',
    files: 'http://localhost:3004',
    publicacao: 'http://localhost:4205',
  },
  development: {
    app: 'https://mlabs-trello-power-up.netlify.app',
    core: 'https://dev-core-api.mlabs.com.br',
    post: 'https://dev-post-api.mlabs.com.br',
    files: 'https://dev-files.mlabs.com.br',
    publicacao: 'https://dev-publicacao.mlabs.com.br',
  },
  staging: {
    app: 'https://mlabs-trello-power-up.netlify.app',
    core: 'https://core-api-stag.mlabs.com.br',
    post: 'https://post-api-stag.mlabs.com.br',
    files: 'https://homolog-files.mlabs.com.br',
    publicacao: 'https://homolog-publicacao.mlabs.com.br',
  },
  production: {
    app: 'https://joyful-seahorse-0bb418.netlify.app',
    core: 'https://core-api.mlabs.com.br',
    post: 'https://post-api.mlabs.com.br',
    files: 'https://files.mlabs.com.br',
    publicacao: 'https://front.mlabs.com.br',
  },
};

const getHost = (api) => {
  return ENVIRONMENT[process.env.NODE_ENV || 'local'][api];
};

export const BASE_URL = getHost('app');

export const AUTH_URL = getHost('core');

export const CORE_URL = getHost('core');

export const POST_URL = getHost('post');

export const FILES_URL = getHost('files');

export const PUBLICACAO_URL = getHost('publicacao');
