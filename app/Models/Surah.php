<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Surah extends Model
{
    protected $table = 'surah';

    public $timestamps = false;

    protected $fillable = [
        'nomor',
        'nama',
        'nama_latin',
        'jumlah_ayat',
        'juz',
    ];

    /**
     * Get the target hafalan for this surah.
     */
    public function targetHafalan(): HasMany
    {
        return $this->hasMany(TargetHafalan::class);
    }

    /**
     * Get the setoran hafalan for this surah.
     */
    public function setoranHafalan(): HasMany
    {
        return $this->hasMany(SetoranHafalan::class);
    }
}
