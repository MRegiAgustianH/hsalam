import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpenCheck, Eye, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Kelas, Siswa, Surah, TahunAjaran } from '@/types';
import { NILAI_OPTIONS } from '@/types';

type Props = {
    kelasList: { id: number; nama: string; tingkat: string }[];
    siswaList: (Siswa & { setoran_hafalan_count: number })[];
    surahs: Surah[];
    tahunAjaran: TahunAjaran[];
    filters: { tahun_ajaran_id: number | null; kelas_id: number | null };
};

export default function SetoranIndex({ kelasList, siswaList, surahs, tahunAjaran, filters }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

    const form = useForm({
        siswa_id: '',
        surah_id: '',
        ayat_mulai: '1',
        ayat_selesai: '',
        tanggal: new Date().toISOString().split('T')[0],
        nilai: '' as string,
        catatan: '',
    });

    function openCreate(siswaId?: number) {
        form.setData({
            siswa_id: siswaId?.toString() ?? '',
            surah_id: '',
            ayat_mulai: '1',
            ayat_selesai: '',
            tanggal: new Date().toISOString().split('T')[0],
            nilai: '',
            catatan: '',
        });
        setSelectedSurah(null);
        setShowDialog(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const data = {
            siswa_id: Number(form.data.siswa_id),
            surah_id: Number(form.data.surah_id),
            ayat_mulai: Number(form.data.ayat_mulai),
            ayat_selesai: Number(form.data.ayat_selesai),
            tanggal: form.data.tanggal,
            nilai: form.data.nilai,
            catatan: form.data.catatan || null,
        };
        router.post('/setoran', data, { onSuccess: () => setShowDialog(false) });
    }

    function handleSurahChange(surahId: string) {
        const surah = surahs.find((s) => s.id === Number(surahId)) ?? null;
        setSelectedSurah(surah);
        form.setData({
            ...form.data,
            surah_id: surahId,
            ayat_mulai: '1',
            ayat_selesai: surah?.jumlah_ayat.toString() ?? '',
        });
    }

    return (
        <>
            <Head title="Setoran Hafalan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Setoran Hafalan</h1>
                        <p className="text-sm text-muted-foreground">Catat dan kelola setoran hafalan harian</p>
                    </div>
                    {filters.kelas_id && (
                        <Button onClick={() => openCreate()} id="btn-tambah-setoran">
                            <Plus className="mr-2 size-4" /> Input Setoran
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Select value={filters.tahun_ajaran_id?.toString() ?? ''} onValueChange={(v) => router.get('/setoran', { tahun_ajaran_id: v }, { preserveState: true })}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Tahun Ajaran" /></SelectTrigger>
                        <SelectContent>
                            {tahunAjaran.map((ta) => (
                                <SelectItem key={ta.id} value={ta.id.toString()}>{ta.nama} {ta.is_active && '(Aktif)'}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filters.kelas_id?.toString() ?? ''} onValueChange={(v) => router.get('/setoran', { ...filters, kelas_id: v }, { preserveState: true })}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                        <SelectContent>
                            {kelasList.map((k) => (
                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Siswa List */}
                {!filters.kelas_id ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <BookOpenCheck className="size-12 mb-3 opacity-30" />
                        <p className="text-lg font-medium">Pilih kelas terlebih dahulu</p>
                    </div>
                ) : siswaList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <BookOpenCheck className="size-12 mb-3 opacity-30" />
                        <p className="text-lg font-medium">Belum ada siswa di kelas ini</p>
                    </div>
                ) : (
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">No</th>
                                            <th className="px-4 py-3 text-left font-medium">NIS</th>
                                            <th className="px-4 py-3 text-left font-medium">Nama</th>
                                            <th className="px-4 py-3 text-left font-medium">L/P</th>
                                            <th className="px-4 py-3 text-center font-medium">Setoran</th>
                                            <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {siswaList.map((s, i) => (
                                            <tr key={s.id} className="transition-colors hover:bg-muted/30">
                                                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{s.nis}</td>
                                                <td className="px-4 py-3 font-medium">{s.nama}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={s.jenis_kelamin === 'L' ? 'default' : 'secondary'}>
                                                        {s.jenis_kelamin}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="outline">{s.setoran_hafalan_count}x</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="sm" onClick={() => openCreate(s.id)}>
                                                            <Plus className="mr-1 size-3" /> Setor
                                                        </Button>
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/setoran/${s.id}`}>
                                                                <Eye className="mr-1 size-3" /> Detail
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Dialog Input Setoran */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Input Setoran Hafalan</DialogTitle>
                        <DialogDescription>Catat setoran hafalan siswa</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Siswa</Label>
                            <Select value={form.data.siswa_id} onValueChange={(v) => form.setData('siswa_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih Siswa" /></SelectTrigger>
                                <SelectContent>
                                    {siswaList.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.nama} ({s.nis})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Surah</Label>
                            <Select value={form.data.surah_id} onValueChange={handleSurahChange}>
                                <SelectTrigger><SelectValue placeholder="Pilih Surah" /></SelectTrigger>
                                <SelectContent>
                                    {surahs.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.nomor}. {s.nama_latin} ({s.jumlah_ayat} ayat)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ayat Mulai</Label>
                                <Input type="number" min={1} max={selectedSurah?.jumlah_ayat ?? 999} value={form.data.ayat_mulai} onChange={(e) => form.setData('ayat_mulai', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Ayat Selesai</Label>
                                <Input type="number" min={1} max={selectedSurah?.jumlah_ayat ?? 999} value={form.data.ayat_selesai} onChange={(e) => form.setData('ayat_selesai', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal</Label>
                            <Input type="date" value={form.data.tanggal} onChange={(e) => form.setData('tanggal', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Nilai</Label>
                            <Select value={form.data.nilai} onValueChange={(v) => form.setData('nilai', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih Nilai" /></SelectTrigger>
                                <SelectContent>
                                    {NILAI_OPTIONS.map((n) => (
                                        <SelectItem key={n.value} value={n.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2.5 rounded-full ${n.color}`} />
                                                {n.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Catatan (opsional)</Label>
                            <Input placeholder="Catatan tambahan..." value={form.data.catatan} onChange={(e) => form.setData('catatan', e.target.value)} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Batal</Button>
                            <Button type="submit" disabled={form.processing}>{form.processing ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

SetoranIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Setoran Hafalan', href: '/setoran' },
    ],
};
