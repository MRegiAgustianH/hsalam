<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TargetHafalan extends Model
{
    protected $table = 'target_hafalan';

    protected $fillable = [
        'kelas_id',
        'surah_id',
        'ayat_mulai',
        'ayat_selesai',
        'urutan',
    ];

    /**
     * Get the kelas for this target.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Get the surah for this target.
     */
    public function surah(): BelongsTo
    {
        return $this->belongsTo(Surah::class);
    }
}
