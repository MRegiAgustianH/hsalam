import { Head, useForm, router } from '@inertiajs/react';
import { CalendarDays, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TahunAjaran } from '@/types';

type Props = {
    tahunAjaran: (TahunAjaran & { kelas_count: number })[];
};

export default function TahunAjaranIndex({ tahunAjaran }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<TahunAjaran | null>(null);

    const form = useForm({
        nama: '',
        semester: 'ganjil' as 'ganjil' | 'genap',
        tanggal_mulai: '',
        tanggal_selesai: '',
        is_active: false,
    });

    function openCreate() {
        form.reset();
        setEditing(null);
        setShowDialog(true);
    }

    function openEdit(ta: TahunAjaran) {
        setEditing(ta);
        form.setData({
            nama: ta.nama,
            semester: ta.semester,
            tanggal_mulai: ta.tanggal_mulai.split('T')[0],
            tanggal_selesai: ta.tanggal_selesai.split('T')[0],
            is_active: ta.is_active,
        });
        setShowDialog(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/admin/tahun-ajaran/${editing.id}`, {
                onSuccess: () => setShowDialog(false),
            });
        } else {
            form.post('/admin/tahun-ajaran', {
                onSuccess: () => setShowDialog(false),
            });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus tahun ajaran ini?')) {
            router.delete(`/admin/tahun-ajaran/${id}`);
        }
    }

    return (
        <>
            <Head title="Tahun Ajaran" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tahun Ajaran</h1>
                        <p className="text-sm text-muted-foreground">Kelola data tahun ajaran dan semester</p>
                    </div>
                    <Button onClick={openCreate} id="btn-tambah-tahun-ajaran">
                        <Plus className="mr-2 size-4" />
                        Tambah
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tahunAjaran.map((ta) => (
                        <Card key={ta.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${ta.is_active ? 'ring-2 ring-primary' : ''}`}>
                            {ta.is_active && (
                                <div className="absolute top-0 right-0 px-2 py-1 rounded-bl-lg bg-primary text-primary-foreground text-xs font-semibold">
                                    Aktif
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                        <CalendarDays className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{ta.nama}</CardTitle>
                                        <Badge variant="outline" className="mt-1">
                                            Semester {ta.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Mulai: {new Date(ta.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p>Selesai: {new Date(ta.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="font-medium text-foreground">{ta.kelas_count} kelas</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openEdit(ta)} id={`btn-edit-ta-${ta.id}`}>
                                        <Edit className="mr-1 size-3" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(ta.id)} id={`btn-delete-ta-${ta.id}`}>
                                        <Trash2 className="mr-1 size-3" /> Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {tahunAjaran.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <CalendarDays className="size-12 mb-3 opacity-30" />
                            <p className="text-lg font-medium">Belum ada tahun ajaran</p>
                            <p className="text-sm">Klik tombol Tambah untuk membuat tahun ajaran baru</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog Create/Edit */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}</DialogTitle>
                        <DialogDescription>
                            {editing ? 'Perbarui data tahun ajaran' : 'Masukkan data tahun ajaran baru'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Tahun Ajaran</Label>
                            <Input id="nama" placeholder="2025/2026" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} />
                            {form.errors.nama && <p className="text-xs text-destructive">{form.errors.nama}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select value={form.data.semester} onValueChange={(v) => form.setData('semester', v as 'ganjil' | 'genap')}>
                                <SelectTrigger id="semester"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ganjil">Ganjil</SelectItem>
                                    <SelectItem value="genap">Genap</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                <Input id="tanggal_mulai" type="date" value={form.data.tanggal_mulai} onChange={(e) => form.setData('tanggal_mulai', e.target.value)} />
                                {form.errors.tanggal_mulai && <p className="text-xs text-destructive">{form.errors.tanggal_mulai}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                <Input id="tanggal_selesai" type="date" value={form.data.tanggal_selesai} onChange={(e) => form.setData('tanggal_selesai', e.target.value)} />
                                {form.errors.tanggal_selesai && <p className="text-xs text-destructive">{form.errors.tanggal_selesai}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_active" checked={form.data.is_active} onCheckedChange={(v) => form.setData('is_active', v === true)} />
                            <Label htmlFor="is_active" className="cursor-pointer">Tahun ajaran aktif</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Batal</Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

TahunAjaranIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tahun Ajaran', href: '/admin/tahun-ajaran' },
    ],
};
