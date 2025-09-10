import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import Layout from '../components/Layout';
import { api, authHeader } from '../lib/api';

export default function Opportunities() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [opps, setOpps] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('crm_token');
    const raw = localStorage.getItem('crm_user');
    if (!token || !raw) {
      router.replace('/login');
      return;
    }
    setUser(JSON.parse(raw));
    fetchOpps(token);
  }, []);

  const fetchOpps = async (token) => {
    const res = await api.get('/api/opps', { headers: authHeader(token || localStorage.getItem('crm_token')) });
    setOpps(res.data);
  };

  const updateStage = async (id, stage) => {
    const token = localStorage.getItem('crm_token');
    await api.put(`/api/opps/${id}`, { stage }, { headers: authHeader(token) });
    fetchOpps(token);
  };

  return (
    <Layout user={user}>
      <NavBar user={user} />
      <div className="container">
        <h2>Opportunities</h2>
        <table style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Value</th>
              <th>Stage</th>
              <th>Owner</th>
              <th>Lead</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opps.map((o) => (
              <tr key={o._id}>
                <td>{o.title}</td>
                <td>{o.value}</td>
                <td>{o.stage}</td>
                <td>{o.ownerId?.name}</td>
                <td>{o.leadId ? o.leadId : '—'}</td>
                <td>
                  <select defaultValue={o.stage} onChange={(e)=>updateStage(o._id, e.target.value)}>
                    <option>Discovery</option>
                    <option>Proposal</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}