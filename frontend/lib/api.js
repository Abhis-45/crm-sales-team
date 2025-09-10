import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://crm-sales-team-api.vercel.app';

export const api = axios.create({ baseURL: BASE });

export function authHeader(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
