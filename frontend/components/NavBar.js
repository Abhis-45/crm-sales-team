import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar({ user }) {
  const router = useRouter();
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      router.replace('/login');
    }
  };

  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ddd', marginBottom: 12 }}>
      <Link href="/leads">Leads</Link> | <Link href="/opportunities">Opportunities</Link>
      <span style={{ float: 'right' }}>
        {user?.name} ({user?.role}) <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
      </span>
    </nav>
  );
}