<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'nis',
        'nama',
        'jenis_kelamin',
        'kelas_id',
    ];

    /**
     * Get the kelas for this siswa.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Get the setoran hafalan for this siswa.
     */
    public function setoranHafalan(): HasMany
    {
        return $this->hasMany(SetoranHafalan::class);
    }
}
