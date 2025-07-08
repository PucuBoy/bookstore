<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title', 'author', 'year', 'price', 'cover_image', 'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function wishedByUsers()
    {
        return $this->belongsToMany(User::class, 'wishlist');
    }

    // Relasi ke users melalui tabel 'carts'
    public function inCartsOfUsers()
    {
        return $this->belongsToMany(User::class, 'cart');
    }
}
