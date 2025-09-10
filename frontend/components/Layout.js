export default function Layout({ children, user }) {
  return (
    <div style={{ maxWidth: 960, margin: '18px auto', padding: 12 }}>
      {children}
    </div>
  );
}