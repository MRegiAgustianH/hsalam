<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $tahunAjaranId = $request->get('tahun_ajaran_id', TahunAjaran::active()?->id);
        $kelasId = $request->get('kelas_id');
        $search = $request->get('search');

        $siswa = Siswa::with(['kelas.tahunAjaran'])
            ->when($kelasId, fn ($q) => $q->where('kelas_id', $kelasId))
            ->when(!$kelasId && $tahunAjaranId, fn ($q) => $q->whereHas('kelas', fn ($q2) => $q2->where('tahun_ajaran_id', $tahunAjaranId)))
            ->when($search, fn ($q) => $q->where(fn ($q2) => $q2->where('nama', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%")))
            ->orderBy('nama')
            ->paginate(20)
            ->withQueryString();

        $kelas = Kelas::when($tahunAjaranId, fn ($q) => $q->where('tahun_ajaran_id', $tahunAjaranId))
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get(['id', 'nama', 'tingkat']);

        $tahunAjaran = TahunAjaran::orderByDesc('is_active')->orderByDesc('tanggal_mulai')->get();

        return Inertia::render('admin/siswa/index', [
            'siswa' => $siswa,
            'kelas' => $kelas,
            'tahunAjaran' => $tahunAjaran,
            'filters' => [
                'tahun_ajaran_id' => $tahunAjaranId ? (int) $tahunAjaranId : null,
                'kelas_id' => $kelasId ? (int) $kelasId : null,
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:siswa,nis|max:50',
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'kelas_id' => 'required|exists:kelas,id',
        ]);

        Siswa::create($validated);

        return back()->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:50|unique:siswa,nis,' . $siswa->id,
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'kelas_id' => 'required|exists:kelas,id',
        ]);

        $siswa->update($validated);

        return back()->with('success', 'Siswa berhasil diperbarui.');
    }

    public function destroy(Siswa $siswa)
    {
        $siswa->delete();

        return back()->with('success', 'Siswa berhasil dihapus.');
    }
}
