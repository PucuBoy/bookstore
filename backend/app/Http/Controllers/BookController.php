<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // GET /api/books
    public function index()
    {
        return Book::all();
    }

    // POST /api/books
    public function store(Request $request)
    {
        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    // GET /api/books/{id}
    public function show($id)
    {
        return Book::findOrFail($id);
    }

    // PUT /api/books/{id}
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book, 200);
    }

    // DELETE /api/books/{id}
    public function destroy($id)
    {
        Book::destroy($id);
        return response()->json(null, 204);
    }
}
