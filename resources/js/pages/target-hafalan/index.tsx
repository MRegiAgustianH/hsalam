import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Target, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Kelas, Surah, TargetHafalan, TahunAjaran } from '@/types';

type Props = {
    kelasList: Kelas[];
    targets: TargetHafalan[];
    surahs: Surah[];
    tahunAjaran: TahunAjaran[];
    filters: { tahun_ajaran_id: number | null; kelas_id: number | null };
};

export default function TargetHafalanIndex({ kelasList, targets, surahs, tahunAjaran, filters }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<TargetHafalan | null>(null);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

    const form = useForm({
        kelas_id: filters.kelas_id?.toString() ?? '',
        surah_id: '',
        ayat_mulai: '1',
        ayat_selesai: '',
        urutan: '0',
    });

    function openCreate() {
        form.setData({
            kelas_id: filters.kelas_id?.toString() ?? '',
            surah_id: '',
            ayat_mulai: '1',
            ayat_selesai: '',
            urutan: (targets.length + 1).toString(),
        });
        setSelectedSurah(null);
        setEditing(null);
        setShowDialog(true);
    }

    function openEdit(t: TargetHafalan) {
        setEditing(t);
        const surah = surahs.find((s) => s.id === t.surah_id) ?? null;
        setSelectedSurah(surah);
        form.setData({
            kelas_id: t.kelas_id.toString(),
            surah_id: t.surah_id.toString(),
            ayat_mulai: t.ayat_mulai.toString(),
            ayat_selesai: t.ayat_selesai.toString(),
            urutan: t.urutan.toString(),
        });
        setShowDialog(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const data = {
            kelas_id: Number(form.data.kelas_id),
            surah_id: Number(form.data.surah_id),
            ayat_mulai: Number(form.data.ayat_mulai),
            ayat_selesai: Number(form.data.ayat_selesai),
            urutan: Number(form.data.urutan),
        };
        if (editing) {
            router.put(`/target-hafalan/${editing.id}`, data, { onSuccess: () => setShowDialog(false) });
        } else {
            router.post('/target-hafalan', data, { onSuccess: () => setShowDialog(false) });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus target hafalan ini?')) {
            router.delete(`/target-hafalan/${id}`);
        }
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
            <Head title="Target Hafalan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Target Hafalan</h1>
                        <p className="text-sm text-muted-foreground">Atur target hafalan per kelas</p>
                    </div>
                    {filters.kelas_id && (
                        <Button onClick={openCreate} id="btn-tambah-target">
                            <Plus className="mr-2 size-4" /> Tambah Target
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Select value={filters.tahun_ajaran_id?.toString() ?? ''} onValueChange={(v) => router.get('/target-hafalan', { tahun_ajaran_id: v }, { preserveState: true })}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Tahun Ajaran" /></SelectTrigger>
                        <SelectContent>
                            {tahunAjaran.map((ta) => (
                                <SelectItem key={ta.id} value={ta.id.toString()}>{ta.nama} {ta.is_active && '(Aktif)'}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filters.kelas_id?.toString() ?? ''} onValueChange={(v) => router.get('/target-hafalan', { ...filters, kelas_id: v }, { preserveState: true })}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                        <SelectContent>
                            {kelasList.map((k) => (
                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Targets */}
                {!filters.kelas_id ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Target className="size-12 mb-3 opacity-30" />
                        <p className="text-lg font-medium">Pilih kelas terlebih dahulu</p>
                        <p className="text-sm">Pilih kelas untuk melihat dan mengatur target hafalan</p>
                    </div>
                ) : targets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Target className="size-12 mb-3 opacity-30" />
                        <p className="text-lg font-medium">Belum ada target hafalan</p>
                        <p className="text-sm">Klik tombol Tambah Target untuk mulai mengatur</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {targets.map((t, i) => (
                            <Card key={t.id} className="group transition-all duration-200 hover:shadow-md">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{t.surah?.nama_latin}</p>
                                            <span className="text-xs text-muted-foreground font-arabic">{t.surah?.nama}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Ayat {t.ayat_mulai} - {t.ayat_selesai}
                                            <span className="ml-2">({t.ayat_selesai - t.ayat_mulai + 1} ayat)</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(t)}><Edit className="size-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(t.id)}><Trash2 className="size-3.5" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Target' : 'Tambah Target Hafalan'}</DialogTitle>
                        <DialogDescription>Atur surah dan range ayat yang harus dihafal</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Label>Urutan</Label>
                            <Input type="number" min={0} value={form.data.urutan} onChange={(e) => form.setData('urutan', e.target.value)} />
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

TargetHafalanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Target Hafalan', href: '/target-hafalan' },
    ],
};
