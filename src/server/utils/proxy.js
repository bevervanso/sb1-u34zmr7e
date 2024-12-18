import { HttpsProxyAgent } from 'https-proxy-agent';
import { PROXY_LIST } from '../utils/constants.js';

export function getRandomProxy() {
  if (!PROXY_LIST.length) return null;
  const randomIndex = Math.floor(Math.random() * PROXY_LIST.length);
  return new HttpsProxyAgent(PROXY_LIST[randomIndex]);
}