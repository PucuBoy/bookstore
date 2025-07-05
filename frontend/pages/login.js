import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login gagal');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.user.role); // Simpan role

      if (data.user.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/user-dashboard'); 
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-black">Login</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 w-full text-black"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border p-2 w-full text-black"
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded w-full cursor-pointer">
          Login
        </button>

        <p className="text-sm text-center text-black">
          Belum punya akun? <a href="/register" className="text-blue-600">Daftar</a>
        </p>
      </form>
    </div>
  );
}
