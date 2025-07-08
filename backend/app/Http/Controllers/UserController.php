<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Book;

class UserController extends Controller
{
    public function profile()
    {
        return response()->json(Auth::user());
    }

    public function wishlist()
    {
        return response()->json(Auth::user()->wishlist);
    }


    public function addToWishlist(Request $request)
    {
        $bookId = $request->book_id;
        $user = Auth::user();

        if (!Book::find($bookId)) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        // Cek apakah buku sudah ada di wishlist
        if ($user->wishlist()->where('book_id', $bookId)->exists()) {
            return response()->json(['message' => 'Buku sudah ada di wishlist'], 409);
        }

        $user->wishlist()->attach($bookId);
        return response()->json(['message' => 'Buku ditambahkan ke wishlist']);
    }


    public function removeFromWishlist($bookId)
    {
        $user = Auth::user();
        $user->wishlist()->detach($bookId);

        return response()->json(['message' => 'Buku dihapus dari wishlist']);
    }

    public function cart()
    {
        return response()->json(Auth::user()->cart);
    }


    public function addToCart(Request $request)
    {
        $bookId = $request->book_id;
        $user = Auth::user();

        if (!Book::find($bookId)) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        // Cek apakah buku sudah ada di cart
        if ($user->cart()->where('book_id', $bookId)->exists()) {
            return response()->json(['message' => 'Buku sudah ada di cart'], 409);
        }

        $user->cart()->attach($bookId);
        return response()->json(['message' => 'Buku ditambahkan ke cart']);
    }


    public function removeFromCart($bookId)
    {
        $user = Auth::user();
        $user->cart()->detach($bookId);

        return response()->json(['message' => 'Buku dihapus dari cart']);
    }
}
