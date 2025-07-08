// pages/user-dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  HiMenuAlt2, HiX, HiLogout, HiHome, HiBookOpen,
  HiHeart, HiShoppingCart, HiCog, HiUser
} from 'react-icons/hi';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return router.push('/login');
    setToken(savedToken);
    fetchBooks(savedToken);
    fetchWishlist(savedToken);
    fetchCart(savedToken);
    fetchUserProfile(savedToken);
    fetchCategories(savedToken);
  }, []);

  const fetchBooks = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/books', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    setBooks(data);
    setIsLoading(false);
  };

  const fetchWishlist = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/user/wishlist', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    setWishlist(data);
    setIsLoading(false);
  };

  const fetchCart = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/user/cart', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    setCart(data);
    setIsLoading(false);
  };

  const fetchUserProfile = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/user/profile', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    setUserProfile(data);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const fetchCategories = async (authToken) => {
    const res = await fetch('http://localhost:8000/api/categories', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    setCategories(data);
  };

  const addToWishlist = async (bookId) => {
    await fetch('http://localhost:8000/api/user/wishlist', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ book_id: bookId })
    });
    fetchWishlist(token);
  };

  const removeFromWishlist = async (bookId) => {
    await fetch(`http://localhost:8000/api/user/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchWishlist(token);
  };

  const addToCart = async (bookId) => {
    await fetch('http://localhost:8000/api/user/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ book_id: bookId })
    });
    fetchCart(token);
  };

  const removeFromCart = async (bookId) => {
    await fetch(`http://localhost:8000/api/user/cart/${bookId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchCart(token);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HiHome size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <HiHeart size={20} /> },
    { id: 'cart', label: 'Cart', icon: <HiShoppingCart size={20} /> },
    { id: 'profile', label: 'Profile', icon: <HiUser size={20} /> },
    { id: 'settings', label: 'Settings', icon: <HiCog size={20} /> },
  ];

  const isInWishlist = (bookId) => {
  return wishlist.some((book) => book.id === bookId);
  };

  const isInCart = (bookId) => {
    return cart.some((book) => book.id === bookId);
  };

  const isNewBook = (createdAt) => {
    const bookDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - bookDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7; // NEW untuk buku 7 hari terakhir
  };  

  const renderBooks = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
        </div>
      );
    }    

    const filteredBooks = books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    let sortedBooks = [...filteredBooks];

      if (sortOption === 'terbaru') {
        sortedBooks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortOption === 'termurah') {
        sortedBooks.sort((a, b) => a.price - b.price);
      }

    return (
      <div>
        {/* Hero Section */}
        <div className="mb-6 p-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-1">Selamat datang, {userProfile?.name} 👋</h1>
          <p className="text-sm">Temukan buku favoritmu dan tambahkan ke wishlist atau cart!</p>
        </div>
    
        {/* Mini Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded shadow p-4 text-center">
            <h3 className="text-sm text-gray-500">Total Buku</h3>
            <p className="text-2xl font-bold text-blue-600">{books.length}</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <h3 className="text-sm text-gray-500">Wishlist</h3>
            <p className="text-2xl font-bold text-pink-600">{wishlist.length}</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <h3 className="text-sm text-gray-500">Cart</h3>
            <p className="text-2xl font-bold text-green-600">{cart.length}</p>
          </div>
        </div>
    
        {/* Pencarian dan Filter */}
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Cari judul buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-500"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-500"
        >
          <option value="default">Urutkan</option>
          <option value="terbaru">Terbaru</option>
          <option value="termurah">Termurah</option>
        </select>


        {/* Grid Card Buku */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        
          {sortedBooks.map((book) => (
            <div key={book.id} className="bg-white rounded shadow p-4">
              <div className="relative mb-4 overflow-hidden rounded shadow">
                {book.cover_image ? (
                  <>
                    <Image
                      src={`http://localhost:8000${book.cover_image}`}
                      alt={book.title}
                      width={300}
                      height={400}
                      className="object-cover w-full h-48 transform hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge NEW */}
                    {isNewBook(book.created_at) && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow">
                        NEW
                      </div>
                    )}
                    {/* Harga */}
                    <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 text-black text-xs px-2 py-1 rounded">
                      Rp{book.price}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    Tidak ada gambar
                  </div>
                )}
              </div>
    
              <h3 className="font-semibold text-lg text-black">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500 mb-1">Kategori: {book.category?.name}</p>
              <p className="text-sm text-sky-900">Rp{book.price}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => !isInWishlist(book.id) && addToWishlist(book.id)}
                  disabled={isInWishlist(book.id)}
                  className={`text-sm px-3 py-1 rounded cursor-pointer 
                    ${isInWishlist(book.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500'} text-white`}
                >
                  {isInWishlist(book.id) ? 'Buku ini Sudah Kamu Wishlist' : 'Wishlist'}
                </button>
    
                <button
                  onClick={() => !isInCart(book.id) && addToCart(book.id)}
                  disabled={isInCart(book.id)}
                  className={`text-sm px-3 py-1 rounded cursor-pointer 
                    ${isInCart(book.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'} text-white`}
                >
                  {isInCart(book.id) ? 'Buku ini Sudah ada di Cart' : 'Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  const renderList = (items, removeFn, label) => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">{label}</h2>
      {items.length === 0 ? (
        <p className="text-black">Kosong</p>
      ) : (
        <ul className="space-y-3">
          {items.map((book) => (
            <li key={book.id} className="border p-3 rounded shadow-sm flex justify-between text-black">
              <span>{book.title} - Rp{book.price}</span>
              <button onClick={() => removeFn(book.id)} className="text-red-500 text-sm cursor-pointer">Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-white shadow h-full ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all`}> 
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black">Menu</h2>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <HiX /> : <HiMenuAlt2 />}
            </button>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 w-full rounded text-black cursor-pointer ${activeTab === item.id ? 'bg-orange-100' : 'hover:bg-gray-100'}`}
            >
              {item.icon} <span>{isSidebarOpen && item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="mt-6 text-red-500 cursor-pointer">Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {activeTab === 'dashboard' && renderBooks()}
        {activeTab === 'wishlist' && renderList(wishlist, removeFromWishlist, 'Wishlist')}
        {activeTab === 'cart' && renderList(cart, removeFromCart, 'Cart')}
        {activeTab === 'profile' && (
          <div className="text-black">
            <h2 className="text-xl font-bold mb-4">Profil</h2>
            <p><strong>Nama:</strong> {userProfile?.name}</p>
            <p><strong>Email:</strong> {userProfile?.email}</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-black">
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
        )}
      </main>
    </div>
  );
}
