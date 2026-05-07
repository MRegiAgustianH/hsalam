import { Head, router } from '@inertiajs/react';
import { ArrowLeft, BookOpenCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SetoranHafalan, Siswa, Surah, SurahProgress } from '@/types';
import { getNilaiColor, getNilaiLabel } from '@/types';

type Props = {
    siswa: Siswa;
    setoran: SetoranHafalan[];
    progress: SurahProgress[];
    surahs: Surah[];
};

export default function SetoranShow({ siswa, setoran, progress }: Props) {
    const totalAyat = progress.reduce((sum, p) => sum + p.jumlah_ayat, 0);
    const totalSelesai = progress.reduce((sum, p) => sum + p.ayat_selesai, 0);
    const overallProgress = totalAyat > 0 ? Math.round((totalSelesai / totalAyat) * 100) : 0;

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus setoran ini?')) {
            router.delete(`/setoran/${id}`);
        }
    }

    return (
        <>
            <Head title={`Hafalan - ${siswa.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-1 size-4" /> Kembali
                    </Button>
                </div>

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">{siswa.nama}</h1>
                    <p className="text-sm text-muted-foreground">
                        NIS: {siswa.nis} • {siswa.kelas?.nama} • {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                </div>

                {/* Overall Progress */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 px-5 py-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <BookOpenCheck className="size-4 text-primary" />
                            Progress Hafalan Juz 30
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{totalSelesai} / {totalAyat} ayat</span>
                            <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>

                        {/* Per Surah Progress */}
                        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {progress.filter((p) => p.persentase > 0 || p.jumlah_ayat <= 10).map((p) => (
                                <div key={p.surah_id} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium">{p.surah_nama}</p>
                                            <span className="text-xs text-muted-foreground ml-2">{p.persentase}%</span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${p.persentase >= 100 ? 'bg-emerald-500' : p.persentase >= 50 ? 'bg-primary' : 'bg-amber-500'}`}
                                                style={{ width: `${Math.min(p.persentase, 100)}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">{p.ayat_selesai}/{p.jumlah_ayat} ayat</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* History */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 px-5 py-4">
                        <CardTitle className="text-base">Riwayat Setoran ({setoran.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {setoran.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/30">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                            <th className="px-4 py-3 text-left font-medium">Surah</th>
                                            <th className="px-4 py-3 text-left font-medium">Ayat</th>
                                            <th className="px-4 py-3 text-left font-medium">Nilai</th>
                                            <th className="px-4 py-3 text-left font-medium">Guru</th>
                                            <th className="px-4 py-3 text-left font-medium">Catatan</th>
                                            <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {setoran.map((s) => (
                                            <tr key={s.id} className="transition-colors hover:bg-muted/30">
                                                <td className="px-4 py-3 whitespace-nowrap">{s.tanggal_display}</td>
                                                <td className="px-4 py-3 font-medium">{s.surah_nama}</td>
                                                <td className="px-4 py-3">{s.ayat_mulai} - {s.ayat_selesai}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={`${getNilaiColor(s.nilai)} text-white`}>
                                                        {getNilaiLabel(s.nilai)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{s.guru_nama}</td>
                                                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{s.catatan || '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(s.id!)}>
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <BookOpenCheck className="size-10 mb-2 opacity-30" />
                                <p className="text-sm">Belum ada riwayat setoran</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SetoranShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Setoran Hafalan', href: '/setoran' },
        { title: 'Detail Siswa', href: '#' },
    ],
};
