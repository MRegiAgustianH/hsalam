<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'nama',
        'tingkat',
        'tahun_ajaran_id',
        'guru_id',
    ];

    /**
     * Get the tahun ajaran for this kelas.
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    /**
     * Get the guru for this kelas.
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Get the siswa in this kelas.
     */
    public function siswa(): HasMany
    {
        return $this->hasMany(Siswa::class);
    }

    /**
     * Get the target hafalan for this kelas.
     */
    public function targetHafalan(): HasMany
    {
        return $this->hasMany(TargetHafalan::class);
    }
}
