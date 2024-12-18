import { USER_AGENTS } from '../utils/constants.js';

export function getRandomUserAgent() {
  const randomIndex = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[randomIndex];
}