import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({ baseURL: BASE });

export function authHeader(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}