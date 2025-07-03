import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Books() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', year: '', price: '' });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
    } else {
      setToken(savedToken);
      fetchBooks(savedToken);
    }
  }, []);

  const fetchBooks = async (authToken) => {
    try {
      const res = await fetch('http://localhost:8000/api/books', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Gagal fetch books:', error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      setForm({ title: '', author: '', year: '', price: '' });
      fetchBooks(token);
    } catch (error) {
      console.error('Gagal simpan buku:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📚 Toko Buku</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            name="title"
            placeholder="Judul Buku"
            className="border p-2 w-full"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="author"
            placeholder="Penulis"
            className="border p-2 w-full"
            value={form.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="year"
            type="number"
            placeholder="Tahun Terbit"
            className="border p-2 w-full"
            value={form.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="price"
            type="number"
            placeholder="Harga"
            className="border p-2 w-full"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan Buku
        </button>
      </form>

      <hr className="mb-6" />

      <h2 className="text-xl font-semibold mb-4">📖 Daftar Buku</h2>
      <ul className="space-y-3">
        {books.map((book) => (
          <li key={book.id} className="p-4 border rounded shadow-sm">
            <strong>{book.title}</strong> - {book.author} ({book.year}) - Rp{book.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
