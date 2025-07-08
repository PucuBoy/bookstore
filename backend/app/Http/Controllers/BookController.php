<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // GET /api/books
    public function index()
    {
        return Book::with('category')->get();
    }

    // POST /api/books
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'year' => 'required|integer',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $validated['cover_image'] = '/storage/' . $path;
        }

        $book = Book::create($validated);
        return response()->json($book->load('category'), 201);
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

        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'cover_image' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $validated['cover_image'] = '/storage/' . $path;
        }
        
        $book->update($validated);
        return response()->json($book->load('category'), 200);
    }

    // DELETE /api/books/{id}
    public function destroy($id)
    {
        Book::destroy($id);
        return response()->json(null, 204);
    }
}
