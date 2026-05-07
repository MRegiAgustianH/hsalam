import { Head, useForm, router } from '@inertiajs/react';
import { Edit, GraduationCap, Plus, Search, Trash2 } from 'lucide-react';
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
import type { Kelas, Siswa, TahunAjaran } from '@/types';

type PaginatedSiswa = {
    data: Siswa[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    siswa: PaginatedSiswa;
    kelas: { id: number; nama: string; tingkat: string }[];
    tahunAjaran: TahunAjaran[];
    filters: { tahun_ajaran_id: number | null; kelas_id: number | null; search: string | null };
};

export default function SiswaIndex({ siswa, kelas, tahunAjaran, filters }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Siswa | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    const form = useForm({
        nis: '',
        nama: '',
        jenis_kelamin: 'L' as 'L' | 'P',
        kelas_id: '',
    });

    function openCreate() {
        form.setData({ nis: '', nama: '', jenis_kelamin: 'L', kelas_id: '' });
        setEditing(null);
        setShowDialog(true);
    }

    function openEdit(s: Siswa) {
        setEditing(s);
        form.setData({ nis: s.nis, nama: s.nama, jenis_kelamin: s.jenis_kelamin, kelas_id: s.kelas_id.toString() });
        setShowDialog(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const data = { ...form.data, kelas_id: Number(form.data.kelas_id) };
        if (editing) {
            router.put(`/admin/siswa/${editing.id}`, data, { onSuccess: () => setShowDialog(false) });
        } else {
            router.post('/admin/siswa', data, { onSuccess: () => setShowDialog(false) });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus siswa ini?')) {
            router.delete(`/admin/siswa/${id}`);
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/siswa', {
            ...filters,
            search: searchValue || undefined,
        }, { preserveState: true });
    }

    function handleFilterChange(key: string, value: string) {
        router.get('/admin/siswa', {
            ...filters,
            [key]: value || undefined,
            ...(key === 'tahun_ajaran_id' ? { kelas_id: undefined } : {}),
        }, { preserveState: true });
    }

    return (
        <>
            <Head title="Siswa" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Siswa</h1>
                        <p className="text-sm text-muted-foreground">{siswa.total} siswa terdaftar</p>
                    </div>
                    <Button onClick={openCreate} id="btn-tambah-siswa">
                        <Plus className="mr-2 size-4" /> Tambah Siswa
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Select value={filters.tahun_ajaran_id?.toString() ?? ''} onValueChange={(v) => handleFilterChange('tahun_ajaran_id', v)}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Tahun Ajaran" /></SelectTrigger>
                        <SelectContent>
                            {tahunAjaran.map((ta) => (
                                <SelectItem key={ta.id} value={ta.id.toString()}>{ta.nama} {ta.is_active && '(Aktif)'}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filters.kelas_id?.toString() ?? 'all'} onValueChange={(v) => handleFilterChange('kelas_id', v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            {kelas.map((k) => (
                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Cari nama atau NIS..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="pl-9" />
                        </div>
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>
                </div>

                {/* Table */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">NIS</th>
                                        <th className="px-4 py-3 text-left font-medium">Nama</th>
                                        <th className="px-4 py-3 text-left font-medium">L/P</th>
                                        <th className="px-4 py-3 text-left font-medium">Kelas</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {siswa.data.map((s) => (
                                        <tr key={s.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-4 py-3 font-mono text-xs">{s.nis}</td>
                                            <td className="px-4 py-3 font-medium">{s.nama}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={s.jenis_kelamin === 'L' ? 'default' : 'secondary'}>
                                                    {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">{s.kelas?.nama ?? '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Edit className="size-3.5" /></Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="size-3.5" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {siswa.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center text-muted-foreground">
                                                <GraduationCap className="mx-auto size-10 mb-2 opacity-30" />
                                                <p>Tidak ada data siswa</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {siswa.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1 border-t px-4 py-3">
                                {siswa.links.map((link, i) => (
                                    <Button key={i} variant={link.active ? 'default' : 'ghost'} size="sm" disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Siswa' : 'Tambah Siswa'}</DialogTitle>
                        <DialogDescription>{editing ? 'Perbarui data siswa' : 'Masukkan data siswa baru'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nis">NIS</Label>
                            <Input id="nis" placeholder="001234" value={form.data.nis} onChange={(e) => form.setData('nis', e.target.value)} />
                            {form.errors.nis && <p className="text-xs text-destructive">{form.errors.nis}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nama_siswa">Nama Lengkap</Label>
                            <Input id="nama_siswa" placeholder="Nama siswa" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                            <Select value={form.data.jenis_kelamin} onValueChange={(v) => form.setData('jenis_kelamin', v as 'L' | 'P')}>
                                <SelectTrigger id="jenis_kelamin"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Laki-laki</SelectItem>
                                    <SelectItem value="P">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="kelas_siswa">Kelas</Label>
                            <Select value={form.data.kelas_id} onValueChange={(v) => form.setData('kelas_id', v)}>
                                <SelectTrigger id="kelas_siswa"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                                <SelectContent>
                                    {kelas.map((k) => (
                                        <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
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

SiswaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa', href: '/admin/siswa' },
    ],
};
