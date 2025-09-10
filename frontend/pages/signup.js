// frontend/pages/signup.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "rep" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://crm-sales-team-api.vercel.app'}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      localStorage.setItem("token", data.token);
      router.push("/leads");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />

        {/* Role selection */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        >
          <option value="rep">Sales Rep</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ padding: "8px 16px" }}>Signup</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
