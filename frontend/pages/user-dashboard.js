// pages/user-dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function UserDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">📚 Daftar Buku</h1>
  <button
    onClick={() => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      router.push('/login');
    }}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
  >
    Logout
  </button>
</div>

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
