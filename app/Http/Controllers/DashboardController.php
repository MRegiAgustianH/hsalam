<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\SetoranHafalan;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $activeTahunAjaran = TahunAjaran::active();

        if ($user->isAdmin()) {
            $totalGuru = \App\Models\User::where('role', 'guru')->count();
            $totalKelas = Kelas::when($activeTahunAjaran, fn ($q) => $q->where('tahun_ajaran_id', $activeTahunAjaran->id))->count();
            $totalSiswa = Siswa::when($activeTahunAjaran, fn ($q) => $q->whereHas('kelas', fn ($q2) => $q2->where('tahun_ajaran_id', $activeTahunAjaran->id)))->count();
            $totalSetoran = SetoranHafalan::when($activeTahunAjaran, fn ($q) => $q->whereHas('siswa.kelas', fn ($q2) => $q2->where('tahun_ajaran_id', $activeTahunAjaran->id)))->count();
            $setoranHariIni = SetoranHafalan::whereDate('tanggal', today())->count();

            // Setoran per hari (7 hari terakhir)
            $setoranPerHari = SetoranHafalan::selectRaw('tanggal, COUNT(*) as total')
                ->where('tanggal', '>=', now()->subDays(7))
                ->groupBy('tanggal')
                ->orderBy('tanggal')
                ->get();

            // Distribusi nilai
            $distribusiNilai = SetoranHafalan::selectRaw('nilai, COUNT(*) as total')
                ->when($activeTahunAjaran, fn ($q) => $q->whereHas('siswa.kelas', fn ($q2) => $q2->where('tahun_ajaran_id', $activeTahunAjaran->id)))
                ->groupBy('nilai')
                ->get();

            // Recent setoran
            $recentSetoran = SetoranHafalan::with(['siswa.kelas', 'surah', 'guru'])
                ->latest('tanggal')
                ->limit(10)
                ->get()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'siswa_nama' => $s->siswa->nama,
                    'kelas_nama' => $s->siswa->kelas->nama,
                    'surah_nama' => $s->surah->nama_latin,
                    'ayat' => $s->ayat_mulai . '-' . $s->ayat_selesai,
                    'nilai' => $s->nilai,
                    'nilai_label' => $s->nilai_label,
                    'tanggal' => $s->tanggal->format('d M Y'),
                    'guru_nama' => $s->guru->name,
                ]);

            return Inertia::render('dashboard', [
                'stats' => [
                    'totalGuru' => $totalGuru,
                    'totalKelas' => $totalKelas,
                    'totalSiswa' => $totalSiswa,
                    'totalSetoran' => $totalSetoran,
                    'setoranHariIni' => $setoranHariIni,
                ],
                'setoranPerHari' => $setoranPerHari,
                'distribusiNilai' => $distribusiNilai,
                'recentSetoran' => $recentSetoran,
                'activeTahunAjaran' => $activeTahunAjaran,
            ]);
        }

        // Guru dashboard
        $kelasIds = $user->kelas()->when($activeTahunAjaran, fn ($q) => $q->where('tahun_ajaran_id', $activeTahunAjaran->id))->pluck('id');
        $totalSiswa = Siswa::whereIn('kelas_id', $kelasIds)->count();
        $totalSetoran = SetoranHafalan::whereHas('siswa', fn ($q) => $q->whereIn('kelas_id', $kelasIds))->count();
        $setoranHariIni = SetoranHafalan::whereDate('tanggal', today())
            ->whereHas('siswa', fn ($q) => $q->whereIn('kelas_id', $kelasIds))
            ->count();

        $kelasList = $user->kelas()
            ->when($activeTahunAjaran, fn ($q) => $q->where('tahun_ajaran_id', $activeTahunAjaran->id))
            ->withCount('siswa')
            ->get();

        $recentSetoran = SetoranHafalan::with(['siswa.kelas', 'surah'])
            ->whereHas('siswa', fn ($q) => $q->whereIn('kelas_id', $kelasIds))
            ->latest('tanggal')
            ->limit(10)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'siswa_nama' => $s->siswa->nama,
                'kelas_nama' => $s->siswa->kelas->nama,
                'surah_nama' => $s->surah->nama_latin,
                'ayat' => $s->ayat_mulai . '-' . $s->ayat_selesai,
                'nilai' => $s->nilai,
                'nilai_label' => $s->nilai_label,
                'tanggal' => $s->tanggal->format('d M Y'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalKelas' => $kelasList->count(),
                'totalSiswa' => $totalSiswa,
                'totalSetoran' => $totalSetoran,
                'setoranHariIni' => $setoranHariIni,
            ],
            'kelasList' => $kelasList,
            'recentSetoran' => $recentSetoran,
            'activeTahunAjaran' => $activeTahunAjaran,
        ]);
    }
}
