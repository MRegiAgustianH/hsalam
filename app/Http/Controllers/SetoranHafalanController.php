<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\SetoranHafalan;
use App\Models\Siswa;
use App\Models\Surah;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SetoranHafalanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tahunAjaranId = $request->get('tahun_ajaran_id', TahunAjaran::active()?->id);
        $kelasId = $request->get('kelas_id');

        $kelasQuery = Kelas::query()
            ->when($tahunAjaranId, fn ($q) => $q->where('tahun_ajaran_id', $tahunAjaranId));

        if ($user->isGuru()) {
            $kelasQuery->where('guru_id', $user->id);
        }

        $kelasList = $kelasQuery->orderBy('tingkat')->orderBy('nama')->get(['id', 'nama', 'tingkat']);

        $siswaList = collect();
        if ($kelasId) {
            $siswaList = Siswa::where('kelas_id', $kelasId)
                ->withCount('setoranHafalan')
                ->orderBy('nama')
                ->get();
        }

        $surahs = Surah::where('juz', 30)->orderBy('nomor')->get();
        $tahunAjaran = TahunAjaran::orderByDesc('is_active')->orderByDesc('tanggal_mulai')->get();

        return Inertia::render('setoran/index', [
            'kelasList' => $kelasList,
            'siswaList' => $siswaList,
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
            'siswa_id' => 'required|exists:siswa,id',
            'surah_id' => 'required|exists:surah,id',
            'ayat_mulai' => 'required|integer|min:1',
            'ayat_selesai' => 'required|integer|gte:ayat_mulai',
            'tanggal' => 'required|date',
            'nilai' => 'required|in:mumtaz,jayyid_jiddan,jayyid,maqbul,perlu_perbaikan',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $validated['guru_id'] = $request->user()->id;

        SetoranHafalan::create($validated);

        return back()->with('success', 'Setoran hafalan berhasil dicatat.');
    }

    public function show(Request $request, Siswa $siswa)
    {
        $siswa->load('kelas.tahunAjaran');

        $setoran = SetoranHafalan::with(['surah', 'guru'])
            ->where('siswa_id', $siswa->id)
            ->orderByDesc('tanggal')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'surah_nama' => $s->surah->nama_latin,
                'surah_nomor' => $s->surah->nomor,
                'ayat_mulai' => $s->ayat_mulai,
                'ayat_selesai' => $s->ayat_selesai,
                'tanggal' => $s->tanggal->format('Y-m-d'),
                'tanggal_display' => $s->tanggal->format('d M Y'),
                'nilai' => $s->nilai,
                'nilai_label' => $s->nilai_label,
                'catatan' => $s->catatan,
                'guru_nama' => $s->guru->name,
            ]);

        // Calculate progress
        $surahs = Surah::where('juz', 30)->orderBy('nomor')->get();
        $progress = [];
        foreach ($surahs as $surah) {
            $surahSetoran = $setoran->where('surah_nomor', $surah->nomor);
            $ayatDone = collect();
            foreach ($surahSetoran as $s) {
                for ($i = $s['ayat_mulai']; $i <= $s['ayat_selesai']; $i++) {
                    $ayatDone->push($i);
                }
            }
            $progress[] = [
                'surah_id' => $surah->id,
                'surah_nama' => $surah->nama_latin,
                'surah_nomor' => $surah->nomor,
                'jumlah_ayat' => $surah->jumlah_ayat,
                'ayat_selesai' => $ayatDone->unique()->count(),
                'persentase' => $surah->jumlah_ayat > 0
                    ? round($ayatDone->unique()->count() / $surah->jumlah_ayat * 100, 1)
                    : 0,
            ];
        }

        return Inertia::render('setoran/show', [
            'siswa' => $siswa,
            'setoran' => $setoran,
            'progress' => $progress,
            'surahs' => $surahs,
        ]);
    }

    public function update(Request $request, SetoranHafalan $setoran)
    {
        $validated = $request->validate([
            'surah_id' => 'required|exists:surah,id',
            'ayat_mulai' => 'required|integer|min:1',
            'ayat_selesai' => 'required|integer|gte:ayat_mulai',
            'tanggal' => 'required|date',
            'nilai' => 'required|in:mumtaz,jayyid_jiddan,jayyid,maqbul,perlu_perbaikan',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $setoran->update($validated);

        return back()->with('success', 'Setoran hafalan berhasil diperbarui.');
    }

    public function destroy(SetoranHafalan $setoran)
    {
        $setoran->delete();

        return back()->with('success', 'Setoran hafalan berhasil dihapus.');
    }
}
