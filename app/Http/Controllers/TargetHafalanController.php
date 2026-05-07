<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Surah;
use App\Models\TargetHafalan;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TargetHafalanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tahunAjaranId = $request->get('tahun_ajaran_id', TahunAjaran::active()?->id);
        $kelasId = $request->get('kelas_id');

        $kelasQuery = Kelas::with('guru')
            ->when($tahunAjaranId, fn ($q) => $q->where('tahun_ajaran_id', $tahunAjaranId));

        if ($user->isGuru()) {
            $kelasQuery->where('guru_id', $user->id);
        }

        $kelasList = $kelasQuery->orderBy('tingkat')->orderBy('nama')->get();

        $targets = collect();
        if ($kelasId) {
            $targets = TargetHafalan::with('surah')
                ->where('kelas_id', $kelasId)
                ->orderBy('urutan')
                ->get();
        }

        $surahs = Surah::where('juz', 30)->orderBy('nomor')->get();
        $tahunAjaran = TahunAjaran::orderByDesc('is_active')->orderByDesc('tanggal_mulai')->get();

        return Inertia::render('target-hafalan/index', [
            'kelasList' => $kelasList,
            'targets' => $targets,
            'surahs' => $surahs,
            'tahunAjaran' => $tahunAjaran,
            'filters' => [
                'tahun_ajaran_id' => $tahunAjaranId ? (int) $tahunAjaranId : null,
                'kelas_id' => $kelasId ? (int) $kelasId : null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'surah_id' => 'required|exists:surah,id',
            'ayat_mulai' => 'required|integer|min:1',
            'ayat_selesai' => 'required|integer|gte:ayat_mulai',
            'urutan' => 'integer|min:0',
        ]);

        if ($request->user()->isGuru()) {
            $kelas = Kelas::findOrFail($validated['kelas_id']);
            if ($kelas->guru_id !== $request->user()->id) {
                abort(403);
            }
        }

        $validated['urutan'] = $validated['urutan'] ?? TargetHafalan::where('kelas_id', $validated['kelas_id'])->max('urutan') + 1;

        TargetHafalan::create($validated);

        return back()->with('success', 'Target hafalan berhasil ditambahkan.');
    }

    public function update(Request $request, TargetHafalan $targetHafalan)
    {
        $validated = $request->validate([
            'surah_id' => 'required|exists:surah,id',
            'ayat_mulai' => 'required|integer|min:1',
            'ayat_selesai' => 'required|integer|gte:ayat_mulai',
            'urutan' => 'integer|min:0',
        ]);

        $targetHafalan->update($validated);

        return back()->with('success', 'Target hafalan berhasil diperbarui.');
    }

    public function destroy(TargetHafalan $targetHafalan)
    {
        $targetHafalan->delete();

        return back()->with('success', 'Target hafalan berhasil dihapus.');
    }
}
