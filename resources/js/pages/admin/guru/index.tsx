import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Guru = {
    id: number;
    name: string;
    email: string;
    kelas_count: number;
    created_at: string;
};

type PaginatedGuru = {
    data: Guru[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    guru: PaginatedGuru;
    filters: { search: string | null };
};

export default function GuruIndex({ guru, filters }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Guru | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    const form = useForm({
        name: '',
        email: '',
        password: '',
    });

    function openCreate() {
        form.setData({ name: '', email: '', password: '' });
        setEditing(null);
        setShowDialog(true);
    }

    function openEdit(g: Guru) {
        setEditing(g);
        form.setData({ name: g.name, email: g.email, password: '' });
        setShowDialog(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/guru/${editing.id}`, form.data, { onSuccess: () => setShowDialog(false) });
        } else {
            router.post('/admin/guru', form.data, { onSuccess: () => setShowDialog(false) });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus guru ini?')) {
            router.delete(`/admin/guru/${id}`);
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/guru', { search: searchValue || undefined }, { preserveState: true });
    }

    return (
        <>
            <Head title="Guru" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Guru</h1>
                        <p className="text-sm text-muted-foreground">{guru.total} guru terdaftar</p>
                    </div>
                    <Button onClick={openCreate} id="btn-tambah-guru">
                        <Plus className="mr-2 size-4" /> Tambah Guru
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Cari nama atau email..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="pl-9" />
                    </div>
                    <Button type="submit" variant="secondary">Cari</Button>
                </form>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Nama</th>
                                        <th className="px-4 py-3 text-left font-medium">Email</th>
                                        <th className="px-4 py-3 text-left font-medium">Kelas</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {guru.data.map((g) => (
                                        <tr key={g.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{g.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{g.email}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline">{g.kelas_count} kelas</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEdit(g)}><Edit className="size-3.5" /></Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(g.id)}><Trash2 className="size-3.5" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {guru.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-16 text-center text-muted-foreground">
                                                <Users className="mx-auto size-10 mb-2 opacity-30" />
                                                <p>Tidak ada data guru</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {guru.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1 border-t px-4 py-3">
                                {guru.links.map((link, i) => (
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
                        <DialogTitle>{editing ? 'Edit Guru' : 'Tambah Guru'}</DialogTitle>
                        <DialogDescription>{editing ? 'Perbarui data guru' : 'Masukkan data guru baru'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{editing ? 'Password (kosongkan jika tidak diubah)' : 'Password'}</Label>
                            <Input id="password" type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
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

GuruIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Guru', href: '/admin/guru' },
    ],
};
