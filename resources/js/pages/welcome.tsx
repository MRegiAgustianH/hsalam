import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenCheck, GraduationCap, School, Target, Users } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Selamat Datang" />
            <div className="relative min-h-screen overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="/images/school-bg.png"
                        alt="SMP Al Azhar 20 Cianjur"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                    {/* Animated geometric pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Top Navigation */}
                <header className="relative z-10">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20 backdrop-blur-sm">
                                <BookOpenCheck className="size-5" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">HSalam</span>
                                <span className="ml-1.5 hidden text-xs text-white/60 sm:inline">|</span>
                                <span className="ml-1.5 hidden text-xs text-white/60 sm:inline">SMP Al Azhar 20 Cianjur</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                                    >
                                        Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
                    <div className="mx-auto max-w-4xl">
                        {/* Bismillah */}
                        <div className="mb-6 animate-fade-in">
                            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
                                بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block">Sistem Setor</span>
                            <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-amber-300 bg-clip-text text-transparent">
                                Hafalan Al-Qur&apos;an
                            </span>
                        </h1>

                        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
                            Platform digital untuk mencatat, memantau, dan mengelola progres hafalan
                            Al-Qur&apos;an siswa{' '}
                            <span className="font-semibold text-white/90">SMP Al Azhar 20 Cianjur</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-400 hover:to-green-400 hover:shadow-emerald-500/50 hover:-translate-y-1"
                                >
                                    Buka Dashboard
                                    <svg className="size-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-400 hover:to-green-400 hover:shadow-emerald-500/50 hover:-translate-y-1"
                                    >
                                        Masuk ke Sistem
                                        <svg className="size-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <svg className="size-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </main>

                {/* Features Section */}
                <section className="relative z-10 bg-gradient-to-b from-black/80 via-[#0a1f15] to-[#0a1f15] px-6 py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                                Fitur <span className="text-emerald-400">Unggulan</span>
                            </h2>
                            <p className="mx-auto max-w-lg text-white/60">
                                Mengelola hafalan Al-Qur&apos;an dengan mudah dan terstruktur
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: Target,
                                    title: 'Target Hafalan',
                                    desc: 'Atur target hafalan per kelas sesuai kemampuan siswa',
                                    color: 'from-emerald-500 to-green-500',
                                    shadow: 'shadow-emerald-500/20',
                                },
                                {
                                    icon: BookOpenCheck,
                                    title: 'Setoran Harian',
                                    desc: 'Catat setoran hafalan setiap hari dengan penilaian terstruktur',
                                    color: 'from-green-500 to-teal-500',
                                    shadow: 'shadow-green-500/20',
                                },
                                {
                                    icon: GraduationCap,
                                    title: 'Progress Siswa',
                                    desc: 'Pantau perkembangan hafalan setiap siswa secara real-time',
                                    color: 'from-amber-500 to-yellow-500',
                                    shadow: 'shadow-amber-500/20',
                                },
                                {
                                    icon: Users,
                                    title: 'Multi Role',
                                    desc: 'Akses berbeda untuk Admin dan Guru sesuai kebutuhan',
                                    color: 'from-blue-500 to-indigo-500',
                                    shadow: 'shadow-blue-500/20',
                                },
                            ].map((feature) => (
                                <div
                                    key={feature.title}
                                    className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl ${feature.shadow}`}
                                >
                                    <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r p-3 ${feature.color} shadow-lg`}>
                                        <feature.icon className="size-6 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                                    <p className="text-sm leading-relaxed text-white/50">{feature.desc}</p>
                                    {/* Hover glow */}
                                    <div className={`absolute -bottom-12 -right-12 size-32 rounded-full bg-gradient-to-r opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20 ${feature.color}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative z-10 bg-[#0a1f15] px-6 py-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                            {[
                                { label: 'Juz Target', value: '30', icon: '📖' },
                                { label: 'Surah', value: '37', icon: '🕌' },
                                { label: '5 Grade', value: 'Penilaian', icon: '⭐' },
                                { label: 'Harian', value: 'Setoran', icon: '📅' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                                    <p className="text-sm text-white/50">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/5 bg-[#0a1f15] px-6 py-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20">
                                    <BookOpenCheck className="size-4 text-emerald-400" />
                                </div>
                                <span className="text-sm font-semibold text-white/80">HSalam</span>
                                <span className="text-xs text-white/30">•</span>
                                <span className="text-xs text-white/40">SMP Al Azhar 20 Cianjur</span>
                            </div>
                            <p className="text-xs text-white/30">
                                &copy; {new Date().getFullYear()} SMP Al Azhar 20 Cianjur. Hafalan Qur&apos;an System.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
