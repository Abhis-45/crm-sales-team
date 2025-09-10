import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import Layout from '../components/Layout';
import { api, authHeader } from '../lib/api';

export default function Leads() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'New' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('crm_token');
    const raw = localStorage.getItem('crm_user');
    if (!token || !raw) {
      router.replace('/login');
      return;
    }
    setUser(JSON.parse(raw));
    fetchLeads(token);
  }, []);

  const fetchLeads = async (token) => {
    const res = await api.get('/api/leads', { headers: authHeader(token || localStorage.getItem('crm_token')) });
    setLeads(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('crm_token');
    if (editingId) {
      await api.put(`/api/leads/${editingId}`, form, { headers: authHeader(token) });
      setEditingId(null);
    } else {
      await api.post('/api/leads', form, { headers: authHeader(token) });
    }
    setForm({ name: '', email: '', phone: '', status: 'New' });
    fetchLeads(token);
  };

  const edit = (lead) => {
    setEditingId(lead._id);
    setForm({ name: lead.name, email: lead.email || '', phone: lead.phone || '', status: lead.status || 'New' });
  };

  const remove = async (id) => {
    const token = localStorage.getItem('crm_token');
    if (!confirm('Delete lead?')) return;
    await api.delete(`/api/leads/${id}`, { headers: authHeader(token) });
    fetchLeads(token);
  };

  const convert = async (id) => {
    const token = localStorage.getItem('crm_token');
    const value = prompt('Enter opportunity value (number, optional)', '0');
    await api.post(`/api/leads/${id}/convert`, { value: Number(value || 0) }, { headers: authHeader(token) });
    fetchLeads(token);
  };

  return (
    <Layout user={user}>
      <NavBar user={user} />
      <div className="container">
        <div className="header">
          <h2>Leads</h2>
          <div>Logged in as: {user?.name} ({user?.role})</div>
        </div>

        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <input placeholder="Name" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
          <input placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
          <select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
          </select>
          <button type="submit">{editingId ? 'Save' : 'Add Lead'}</button>
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm({ name:'', email:'', phone:'', status:'New'} ) }}>Cancel</button>}
        </form>

        <table style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id}>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>{l.phone}</td>
                <td>{l.status}</td>
                <td>{l.ownerId?.name || '—'}</td>
                <td>
                  <button onClick={()=>edit(l)}>Edit</button>
                  <button onClick={()=>remove(l._id)} style={{ marginLeft: 6 }}>Delete</button>
                  <button onClick={()=>convert(l._id)} style={{ marginLeft: 6 }}>Convert</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}