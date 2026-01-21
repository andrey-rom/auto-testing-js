import dotenv from 'dotenv';

dotenv.config({ path: 'env' });

function getEnvNumber(key, fallback) {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const runtimeConfig = {
  baseUrl: process.env.DEMOQA_BASE_URL || 'https://demoqa.com',
  timeouts: {
    test: getEnvNumber('PW_TEST_TIMEOUT_MS', 60000),
    navigation: getEnvNumber('PW_NAVIGATION_TIMEOUT_MS', 10000),
    assertion: getEnvNumber('PW_ASSERTION_TIMEOUT_MS', 10000),
    selector: getEnvNumber('PW_SELECTOR_TIMEOUT_MS', 10000),
  },
};

