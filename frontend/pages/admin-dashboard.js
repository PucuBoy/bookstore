import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    year: '',
    price: '',
    category_id: '',
    cover_image: null,
  });
  const [token, setToken] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const coverImageInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);


  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (!savedToken) {
      router.push('/login');
      return;
    }

    if (savedRole !== 'admin') {
      router.push('/user-dashboard');
      return;
    }

    setToken(savedToken);
    fetchBooks(savedToken);
    fetchCategories(savedToken);
  }, []);

  const fetchBooks = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/books', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    setBooks(data);
  };

  const fetchCategories = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/categories', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    setCategories(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'cover_image' && files && files[0]) {
      const file = files[0];
      setForm({ ...form, cover_image: file });
  
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
  
    try {
      const url = isEdit
        ? `http://localhost:8000/api/books/${editBookId}`
        : 'http://localhost:8000/api/books';
      const method = isEdit ? 'POST' : 'POST'; // Gunakan POST + _method=PUT untuk Laravel
  
      if (isEdit) {
        formData.append('_method', 'PUT'); // Laravel butuh ini untuk spoofing method PUT
      }
  
      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      setForm({
        title: '',
        author: '',
        year: '',
        price: '',
        category_id: '',
        cover_image: null,
      });
      coverImageInputRef.current.value = ''; 
      setPreviewImage(null);
      setIsEdit(false);
      setEditBookId(null);
      fetchBooks(token);
    } catch (error) {
      console.error('Gagal simpan/update buku:', error);
    }
  };
  
  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      year: book.year,
      price: book.price,
      category_id: book.category_id,
      cover_image: null, // biarkan kosong dulu
    });
    setEditBookId(book.id);
    setIsEdit(true);
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;
    try {
      await fetch(`http://localhost:8000/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBooks(token);
    } catch (error) {
      console.error('Gagal hapus buku:', error);
    }
  };
  

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome To Admin Dashboard - Toko Buku</h1>
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

      <form onSubmit={handleSubmit} className="mb-8 space-y-4" encType="multipart/form-data">
        <input name="title" placeholder="Judul Buku" className="border p-2 w-full" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Penulis" className="border p-2 w-full" value={form.author} onChange={handleChange} required />
        <input name="year" type="number" placeholder="Tahun Terbit" className="border p-2 w-full" value={form.year} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Harga" className="border p-2 w-full" value={form.price} onChange={handleChange} required />
        
        <select name="category_id" value={form.category_id} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input type="file" name="cover_image" accept="image/*" ref={coverImageInputRef} onChange={handleChange} className="border p-2 w-full cursor-pointer" />

        {previewImage && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Preview:</p>
            <img src={previewImage} alt="Preview" className="w-24 h-auto mt-1" />
          </div>
        )}    
  
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
          {isEdit ? 'Update Buku' : 'Simpan Buku'}
        </button> 

      </form>

      <hr className="mb-6" />

      <h2 className="text-xl font-semibold mb-4"> Daftar Buku</h2>
      <ul className="space-y-3">
        {books.map((book) => (
          <li key={book.id} className="p-4 border rounded shadow-sm">
            <strong>{book.title}</strong> - {book.author} ({book.year}) - Rp{book.price} <br />
            <em>Kategori: {book.category?.name}</em><br />
            {book.cover_image && <img src={`http://localhost:8000${book.cover_image}`} alt={book.title} className="w-20 mt-2" />}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(book)}
                className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
