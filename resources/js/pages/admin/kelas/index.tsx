import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Plus, School, Trash2 } from 'lucide-react';
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
import type { Kelas, TahunAjaran } from '@/types';

type Props = {
    kelas: (Kelas & { siswa_count: number })[];
    guru: { id: number; name: string }[];
    tahunAjaran: TahunAjaran[];
    selectedTahunAjaranId: number | null;
};

export default function KelasIndex({ kelas, guru, tahunAjaran, selectedTahunAjaranId }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Kelas | null>(null);

    const form = useForm({
        nama: '',
        tingkat: 'VII' as 'VII' | 'VIII' | 'IX',
        tahun_ajaran_id: selectedTahunAjaranId?.toString() ?? '',
        guru_id: '',
    });

    function openCreate() {
        form.setData({
            nama: '',
            tingkat: 'VII',
            tahun_ajaran_id: selectedTahunAjaranId?.toString() ?? '',
            guru_id: '',
        });
        setEditing(null);
        setShowDialog(true);
    }

    function openEdit(k: Kelas) {
        setEditing(k);
        form.setData({
            nama: k.nama,
            tingkat: k.tingkat,
            tahun_ajaran_id: k.tahun_ajaran_id.toString(),
            guru_id: k.guru_id.toString(),
        });
        setShowDialog(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const data = { ...form.data, tahun_ajaran_id: Number(form.data.tahun_ajaran_id), guru_id: Number(form.data.guru_id) };
        if (editing) {
            router.put(`/admin/kelas/${editing.id}`, data, { onSuccess: () => setShowDialog(false) });
        } else {
            router.post('/admin/kelas', data, { onSuccess: () => setShowDialog(false) });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus kelas ini? Semua data siswa di kelas ini akan terhapus.')) {
            router.delete(`/admin/kelas/${id}`);
        }
    }

    function handleFilterChange(tahunAjaranId: string) {
        router.get('/admin/kelas', { tahun_ajaran_id: tahunAjaranId }, { preserveState: true });
    }

    return (
        <>
            <Head title="Kelas" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Kelas</h1>
                        <p className="text-sm text-muted-foreground">Kelola kelas dan penugasan guru</p>
                    </div>
                    <div className="flex gap-2">
                        <Select value={selectedTahunAjaranId?.toString() ?? ''} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[200px]" id="filter-tahun-ajaran">
                                <SelectValue placeholder="Pilih Tahun Ajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {tahunAjaran.map((ta) => (
                                    <SelectItem key={ta.id} value={ta.id.toString()}>
                                        {ta.nama} {ta.is_active && '(Aktif)'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={openCreate} id="btn-tambah-kelas">
                            <Plus className="mr-2 size-4" /> Tambah
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {kelas.map((k) => (
                        <Card key={k.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                            <CardHeader className="pb-2">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                        <School className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{k.nama}</CardTitle>
                                        <Badge variant="outline" className="mt-1">Tingkat {k.tingkat}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>Guru: <span className="font-medium text-foreground">{k.guru?.name ?? '-'}</span></p>
                                    <p>Siswa: <span className="font-medium text-foreground">{k.siswa_count}</span></p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openEdit(k)}><Edit className="mr-1 size-3" /> Edit</Button>
                                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(k.id)}>
                                        <Trash2 className="mr-1 size-3" /> Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {kelas.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <School className="size-12 mb-3 opacity-30" />
                            <p className="text-lg font-medium">Belum ada kelas</p>
                            <p className="text-sm">Klik tombol Tambah untuk membuat kelas baru</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle>
                        <DialogDescription>{editing ? 'Perbarui data kelas' : 'Masukkan data kelas baru'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kelas</Label>
                            <Input id="nama" placeholder="VII-A" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tingkat">Tingkat</Label>
                            <Select value={form.data.tingkat} onValueChange={(v) => form.setData('tingkat', v as 'VII' | 'VIII' | 'IX')}>
                                <SelectTrigger id="tingkat"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VII">VII</SelectItem>
                                    <SelectItem value="VIII">VIII</SelectItem>
                                    <SelectItem value="IX">IX</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tahun_ajaran_id">Tahun Ajaran</Label>
                            <Select value={form.data.tahun_ajaran_id} onValueChange={(v) => form.setData('tahun_ajaran_id', v)}>
                                <SelectTrigger id="tahun_ajaran_id"><SelectValue placeholder="Pilih Tahun Ajaran" /></SelectTrigger>
                                <SelectContent>
                                    {tahunAjaran.map((ta) => (
                                        <SelectItem key={ta.id} value={ta.id.toString()}>{ta.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guru_id">Guru Pengampu</Label>
                            <Select value={form.data.guru_id} onValueChange={(v) => form.setData('guru_id', v)}>
                                <SelectTrigger id="guru_id"><SelectValue placeholder="Pilih Guru" /></SelectTrigger>
                                <SelectContent>
                                    {guru.map((g) => (
                                        <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

KelasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kelas', href: '/admin/kelas' },
    ],
};
