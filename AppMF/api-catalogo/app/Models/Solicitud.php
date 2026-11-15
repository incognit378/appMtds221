<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    protected $table = 'solicitudes';

    protected $fillable = [
        'user_id',
        'items',
        'total',
        'estado',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}