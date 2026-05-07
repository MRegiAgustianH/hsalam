<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $tahunAjaranId = $request->get('tahun_ajaran_id', TahunAjaran::active()?->id);

        $kelas = Kelas::with(['guru', 'tahunAjaran'])
            ->withCount('siswa')
            ->when($tahunAjaranId, fn ($q) => $q->where('tahun_ajaran_id', $tahunAjaranId))
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get();

        $guru = User::where('role', 'guru')->orderBy('name')->get(['id', 'name']);
        $tahunAjaran = TahunAjaran::orderByDesc('is_active')->orderByDesc('tanggal_mulai')->get();

        return Inertia::render('admin/kelas/index', [
            'kelas' => $kelas,
            'guru' => $guru,
            'tahunAjaran' => $tahunAjaran,
            'selectedTahunAjaranId' => $tahunAjaranId ? (int) $tahunAjaranId : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tingkat' => 'required|in:VII,VIII,IX',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'guru_id' => 'required|exists:users,id',
        ]);

        Kelas::create($validated);

        return back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tingkat' => 'required|in:VII,VIII,IX',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'guru_id' => 'required|exists:users,id',
        ]);

        $kela->update($validated);

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $kela)
    {
        $kela->delete();

        return back()->with('success', 'Kelas berhasil dihapus.');
    }
}
