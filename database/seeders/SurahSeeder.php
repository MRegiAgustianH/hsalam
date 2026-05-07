<?php

namespace Database\Seeders;

use App\Models\Surah;
use Illuminate\Database\Seeder;

class SurahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $surahs = [
            ['nomor' => 78,  'nama' => 'النبأ',       'nama_latin' => 'An-Naba',        'jumlah_ayat' => 40, 'juz' => 30],
            ['nomor' => 79,  'nama' => 'النازعات',    'nama_latin' => 'An-Nazi\'at',     'jumlah_ayat' => 46, 'juz' => 30],
            ['nomor' => 80,  'nama' => 'عبس',         'nama_latin' => '\'Abasa',         'jumlah_ayat' => 42, 'juz' => 30],
            ['nomor' => 81,  'nama' => 'التكوير',     'nama_latin' => 'At-Takwir',       'jumlah_ayat' => 29, 'juz' => 30],
            ['nomor' => 82,  'nama' => 'الانفطار',    'nama_latin' => 'Al-Infitar',      'jumlah_ayat' => 19, 'juz' => 30],
            ['nomor' => 83,  'nama' => 'المطففين',    'nama_latin' => 'Al-Mutaffifin',   'jumlah_ayat' => 36, 'juz' => 30],
            ['nomor' => 84,  'nama' => 'الانشقاق',    'nama_latin' => 'Al-Inshiqaq',     'jumlah_ayat' => 25, 'juz' => 30],
            ['nomor' => 85,  'nama' => 'البروج',      'nama_latin' => 'Al-Buruj',        'jumlah_ayat' => 22, 'juz' => 30],
            ['nomor' => 86,  'nama' => 'الطارق',      'nama_latin' => 'At-Tariq',        'jumlah_ayat' => 17, 'juz' => 30],
            ['nomor' => 87,  'nama' => 'الأعلى',      'nama_latin' => 'Al-A\'la',        'jumlah_ayat' => 19, 'juz' => 30],
            ['nomor' => 88,  'nama' => 'الغاشية',     'nama_latin' => 'Al-Ghashiyah',    'jumlah_ayat' => 26, 'juz' => 30],
            ['nomor' => 89,  'nama' => 'الفجر',       'nama_latin' => 'Al-Fajr',         'jumlah_ayat' => 30, 'juz' => 30],
            ['nomor' => 90,  'nama' => 'البلد',       'nama_latin' => 'Al-Balad',        'jumlah_ayat' => 20, 'juz' => 30],
            ['nomor' => 91,  'nama' => 'الشمس',       'nama_latin' => 'Ash-Shams',       'jumlah_ayat' => 15, 'juz' => 30],
            ['nomor' => 92,  'nama' => 'الليل',       'nama_latin' => 'Al-Layl',         'jumlah_ayat' => 21, 'juz' => 30],
            ['nomor' => 93,  'nama' => 'الضحى',       'nama_latin' => 'Ad-Duha',         'jumlah_ayat' => 11, 'juz' => 30],
            ['nomor' => 94,  'nama' => 'الشرح',       'nama_latin' => 'Ash-Sharh',       'jumlah_ayat' => 8,  'juz' => 30],
            ['nomor' => 95,  'nama' => 'التين',       'nama_latin' => 'At-Tin',          'jumlah_ayat' => 8,  'juz' => 30],
            ['nomor' => 96,  'nama' => 'العلق',       'nama_latin' => 'Al-\'Alaq',       'jumlah_ayat' => 19, 'juz' => 30],
            ['nomor' => 97,  'nama' => 'القدر',       'nama_latin' => 'Al-Qadr',         'jumlah_ayat' => 5,  'juz' => 30],
            ['nomor' => 98,  'nama' => 'البينة',      'nama_latin' => 'Al-Bayyinah',     'jumlah_ayat' => 8,  'juz' => 30],
            ['nomor' => 99,  'nama' => 'الزلزلة',     'nama_latin' => 'Az-Zalzalah',     'jumlah_ayat' => 8,  'juz' => 30],
            ['nomor' => 100, 'nama' => 'العاديات',    'nama_latin' => 'Al-\'Adiyat',     'jumlah_ayat' => 11, 'juz' => 30],
            ['nomor' => 101, 'nama' => 'القارعة',     'nama_latin' => 'Al-Qari\'ah',     'jumlah_ayat' => 11, 'juz' => 30],
            ['nomor' => 102, 'nama' => 'التكاثر',     'nama_latin' => 'At-Takathur',     'jumlah_ayat' => 8,  'juz' => 30],
            ['nomor' => 103, 'nama' => 'العصر',       'nama_latin' => 'Al-\'Asr',        'jumlah_ayat' => 3,  'juz' => 30],
            ['nomor' => 104, 'nama' => 'الهمزة',      'nama_latin' => 'Al-Humazah',      'jumlah_ayat' => 9,  'juz' => 30],
            ['nomor' => 105, 'nama' => 'الفيل',       'nama_latin' => 'Al-Fil',          'jumlah_ayat' => 5,  'juz' => 30],
            ['nomor' => 106, 'nama' => 'قريش',        'nama_latin' => 'Quraysh',         'jumlah_ayat' => 4,  'juz' => 30],
            ['nomor' => 107, 'nama' => 'الماعون',     'nama_latin' => 'Al-Ma\'un',       'jumlah_ayat' => 7,  'juz' => 30],
            ['nomor' => 108, 'nama' => 'الكوثر',      'nama_latin' => 'Al-Kawthar',      'jumlah_ayat' => 3,  'juz' => 30],
            ['nomor' => 109, 'nama' => 'الكافرون',    'nama_latin' => 'Al-Kafirun',      'jumlah_ayat' => 6,  'juz' => 30],
            ['nomor' => 110, 'nama' => 'النصر',       'nama_latin' => 'An-Nasr',         'jumlah_ayat' => 3,  'juz' => 30],
            ['nomor' => 111, 'nama' => 'المسد',       'nama_latin' => 'Al-Masad',        'jumlah_ayat' => 5,  'juz' => 30],
            ['nomor' => 112, 'nama' => 'الإخلاص',     'nama_latin' => 'Al-Ikhlas',       'jumlah_ayat' => 4,  'juz' => 30],
            ['nomor' => 113, 'nama' => 'الفلق',       'nama_latin' => 'Al-Falaq',        'jumlah_ayat' => 5,  'juz' => 30],
            ['nomor' => 114, 'nama' => 'الناس',       'nama_latin' => 'An-Nas',          'jumlah_ayat' => 6,  'juz' => 30],
        ];

        foreach ($surahs as $surah) {
            Surah::updateOrCreate(['nomor' => $surah['nomor']], $surah);
        }
    }
}
