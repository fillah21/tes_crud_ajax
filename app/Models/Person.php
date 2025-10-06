<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama','tgl_lahir','agama','provinsi','kabupaten','desa',
        'hobi','status','image','files'
    ];
}
