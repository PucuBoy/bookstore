import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Gagal registrasi');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 p-8 rounded-md shadow-md w-full max-w-md border">
        <h1 className="text-3xl font-bold text-center mb-2 text-black">Register</h1>
        <p className="text-center text-gray-600 mb-6">Kindly fill in this form to register.</p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-black">Username</label>
            <input
              type="text"
              name="name"
              placeholder="Enter username"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Repeat Password</label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Repeat password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded w-full cursor-pointer transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
