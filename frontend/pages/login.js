import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("rep@example.com");
  const [password, setPassword] = useState("password123");
  const [err, setErr] = useState(null);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("crm_token", token);
        localStorage.setItem("crm_user", JSON.stringify(user));
      }
      router.push("/leads");
    } catch (err) {
      setErr(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto" }} className="container">
      <h2>CRM — Login</h2>
      <form onSubmit={submit}>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
        </div>
        <p>
          Don’t have an account? <a href="/signup">Signup</a>
        </p>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      </form>
    </div>
  );
}
