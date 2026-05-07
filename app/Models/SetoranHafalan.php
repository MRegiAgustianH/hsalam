<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SetoranHafalan extends Model
{
    protected $table = 'setoran_hafalan';

    protected $fillable = [
        'siswa_id',
        'surah_id',
        'ayat_mulai',
        'ayat_selesai',
        'tanggal',
        'nilai',
        'catatan',
        'guru_id',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    /**
     * Get the siswa for this setoran.
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Get the surah for this setoran.
     */
    public function surah(): BelongsTo
    {
        return $this->belongsTo(Surah::class);
    }

    /**
     * Get the guru who graded this setoran.
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Get the human-readable nilai label.
     */
    public function getNilaiLabelAttribute(): string
    {
        return match ($this->nilai) {
            'mumtaz' => 'Mumtaz',
            'jayyid_jiddan' => 'Jayyid Jiddan',
            'jayyid' => 'Jayyid',
            'maqbul' => 'Maqbul',
            'perlu_perbaikan' => 'Perlu Perbaikan',
            default => $this->nilai,
        };
    }
}
