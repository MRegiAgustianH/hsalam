import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpenCheck,
    CalendarDays,
    GraduationCap,
    School,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth, SetoranHafalan, TahunAjaran } from '@/types';
import { getNilaiColor, getNilaiLabel } from '@/types';

type DashboardProps = {
    stats: {
        totalGuru?: number;
        totalKelas: number;
        totalSiswa: number;
        totalSetoran: number;
        setoranHariIni: number;
    };
    recentSetoran: SetoranHafalan[];
    activeTahunAjaran: TahunAjaran | null;
    kelasList?: { id: number; nama: string; tingkat: string; siswa_count: number }[];
    setoranPerHari?: { tanggal: string; total: number }[];
    distribusiNilai?: { nilai: string; total: number }[];
};

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const {
        stats,
        recentSetoran,
        activeTahunAjaran,
        kelasList,
    } = usePage<{ auth: Auth } & DashboardProps>().props;
    const isAdmin = auth.user.role === 'admin';

    const statCards = isAdmin
        ? [
              { label: 'Total Guru', value: stats.totalGuru ?? 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Total Kelas', value: stats.totalKelas, icon: School, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Total Siswa', value: stats.totalSiswa, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Total Setoran', value: stats.totalSetoran, icon: BookOpenCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ]
        : [
              { label: 'Kelas Saya', value: stats.totalKelas, icon: School, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Total Siswa', value: stats.totalSiswa, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Total Setoran', value: stats.totalSetoran, icon: BookOpenCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Setoran Hari Ini', value: stats.setoranHariIni, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Assalamu&apos;alaikum, {auth.user.name} 👋
                    </h1>
                    <p className="text-muted-foreground">
                        {activeTahunAjaran
                            ? `Tahun Ajaran ${activeTahunAjaran.nama} - Semester ${activeTahunAjaran.semester === 'ganjil' ? 'Ganjil' : 'Genap'}`
                            : 'Belum ada tahun ajaran aktif'}
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.label} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                            <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${stat.bg}`} />
                            <CardContent className="relative flex items-center gap-4 p-5">
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`size-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value.toLocaleString('id-ID')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Setoran Hari Ini (Admin) */}
                    {isAdmin && (
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b bg-muted/30 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="size-4 text-primary" />
                                    <CardTitle className="text-base">Setoran Hari Ini</CardTitle>
                                </div>
                                <CardDescription>
                                    {stats.setoranHariIni} setoran tercatat hari ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {recentSetoran.length > 0 ? (
                                    <div className="divide-y">
                                        {recentSetoran.slice(0, 5).map((s) => (
                                            <div key={s.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium text-sm">{s.siswa_nama}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {s.kelas_nama} • {s.surah_nama} : {s.ayat}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className={`${getNilaiColor(s.nilai)} text-white text-xs shrink-0 ml-2`}>
                                                    {getNilaiLabel(s.nilai)}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <BookOpenCheck className="size-10 mb-2 opacity-30" />
                                        <p className="text-sm">Belum ada setoran hari ini</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Kelas List (Guru) */}
                    {!isAdmin && kelasList && (
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b bg-muted/30 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <School className="size-4 text-primary" />
                                    <CardTitle className="text-base">Kelas Saya</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {kelasList.length > 0 ? (
                                    <div className="divide-y">
                                        {kelasList.map((k) => (
                                            <Link
                                                key={k.id}
                                                href={`/setoran?kelas_id=${k.id}`}
                                                className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">{k.nama}</p>
                                                    <p className="text-xs text-muted-foreground">Tingkat {k.tingkat}</p>
                                                </div>
                                                <Badge variant="outline">{k.siswa_count} siswa</Badge>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <School className="size-10 mb-2 opacity-30" />
                                        <p className="text-sm">Belum ada kelas yang ditugaskan</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Setoran */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/30 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <BookOpenCheck className="size-4 text-primary" />
                                <CardTitle className="text-base">Setoran Terakhir</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentSetoran.length > 0 ? (
                                <div className="divide-y">
                                    {recentSetoran.slice(0, 5).map((s) => (
                                        <div key={s.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-sm">{s.siswa_nama}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {s.surah_nama} : {s.ayat} • {s.tanggal}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className={`${getNilaiColor(s.nilai)} text-white text-xs shrink-0 ml-2`}>
                                                {getNilaiLabel(s.nilai)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <BookOpenCheck className="size-10 mb-2 opacity-30" />
                                    <p className="text-sm">Belum ada setoran</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
