export type TahunAjaran = {
    id: number;
    nama: string;
    semester: 'ganjil' | 'genap';
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
    kelas_count?: number;
    created_at: string;
    updated_at: string;
};

export type Kelas = {
    id: number;
    nama: string;
    tingkat: 'VII' | 'VIII' | 'IX';
    tahun_ajaran_id: number;
    guru_id: number;
    tahun_ajaran?: TahunAjaran;
    guru?: { id: number; name: string };
    siswa_count?: number;
    created_at: string;
    updated_at: string;
};

export type Siswa = {
    id: number;
    nis: string;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    kelas_id: number;
    kelas?: Kelas;
    setoran_hafalan_count?: number;
    created_at: string;
    updated_at: string;
};

export type Surah = {
    id: number;
    nomor: number;
    nama: string;
    nama_latin: string;
    jumlah_ayat: number;
    juz: number;
};

export type NilaiType = 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul' | 'perlu_perbaikan';

export type TargetHafalan = {
    id: number;
    kelas_id: number;
    surah_id: number;
    ayat_mulai: number;
    ayat_selesai: number;
    urutan: number;
    surah?: Surah;
    kelas?: Kelas;
    created_at: string;
    updated_at: string;
};

export type SetoranHafalan = {
    id: number;
    siswa_id: number;
    surah_id: number;
    ayat_mulai: number;
    ayat_selesai: number;
    tanggal: string;
    tanggal_display?: string;
    nilai: NilaiType;
    nilai_label: string;
    catatan: string | null;
    guru_id: number;
    siswa_nama?: string;
    kelas_nama?: string;
    surah_nama?: string;
    surah_nomor?: number;
    ayat?: string;
    guru_nama?: string;
    created_at?: string;
    updated_at?: string;
};

export type SurahProgress = {
    surah_id: number;
    surah_nama: string;
    surah_nomor: number;
    jumlah_ayat: number;
    ayat_selesai: number;
    persentase: number;
};

export const NILAI_OPTIONS: { value: NilaiType; label: string; color: string }[] = [
    { value: 'mumtaz', label: 'Mumtaz', color: 'bg-emerald-500' },
    { value: 'jayyid_jiddan', label: 'Jayyid Jiddan', color: 'bg-green-500' },
    { value: 'jayyid', label: 'Jayyid', color: 'bg-blue-500' },
    { value: 'maqbul', label: 'Maqbul', color: 'bg-amber-500' },
    { value: 'perlu_perbaikan', label: 'Perlu Perbaikan', color: 'bg-red-500' },
];

export function getNilaiLabel(nilai: NilaiType): string {
    return NILAI_OPTIONS.find((n) => n.value === nilai)?.label ?? nilai;
}

export function getNilaiColor(nilai: NilaiType): string {
    return NILAI_OPTIONS.find((n) => n.value === nilai)?.color ?? 'bg-gray-500';
}
