# E-Commerce Sederhana

Repository ini berisi implementasi sebuah sistem e-commerce sederhana yang masih belum sepenuhnya selesai dikembangkan. Tujuan pembuatan adalah untuk bahan pembelajaran. Suatu hari nanti (!) sebuah tutorial akan dibuat, beserta dengan berbagai latihan untuk "melengkapi" fitur e-commerce yang ada.

Aplikasi dibangun dengan menggunakan NodeJS dan ExpressJS.

## Dependencies

Sebelum menjalankan aplikasi, pastikan beberapa hal telah ada:

1. Database MySQL atau MariaDB, dengan model tabel sesuai dengan yang ada pada pada direktori `data`.
2. Environment variabel berikut dikonfigurasikan:

    a. `MARIADB_HOST`, berisi *hostname* dari sistem basis data.
    b. `MARIADB_USER`, berisi pengguna yang dapat mengakses basis data.
    c. `MARIADB_PASSWORD`, berisi password pengguna pada (b).
    d. `MARIADB_DB_ECOMMERCE`, berisi nama basis data yang akan digunakan.

Dari sisi NodeJS, sebelum memasang *dependency* melalui `npm`, terlebih dahulu jalankan perintah berikut (pada Windows):

    $ npm install -g gulp
    $ npm install -g node-gyp

untuk pengguna Linux dan Mac, gunakan sudo:

    $ sudo npm install -g gulp
    $ sudo npm install -g node-gyp

Setelah perintah selesai dieksekusi, pasang *dependency* dengan perintah:

    $ npm install

baik di Mac, Windows, ataupun Linux. 


## Menjalankan Aplikasi

Aplikasi dapat dijalankan dengan menggunakan perintah `gulp serve`:

    $ gulp serve
    [13:50:09] Using gulpfile ~/path/to/project/gulpfile.js
    [13:50:09] Starting 'serve'...
    [13:50:09] Finished 'serve' after 21 ms
    livereload[tiny-lr] listening on 35729 ...
    Server started!

dan kemudian dapat diakses pada browser melalui `http://localhost:3000/`.

## Kekurangan Aplikasi (Bahan Latihan)

Aplikasi e-commerce yang terdapat pada repository ini masih memiliki banyak kekurangan, yaitu:

1. Setelah pengguna melakukan *checkout*, tidak ada pengurangan stock pada basis data.
2. Setelah pengguna melakukan *checkout*, tidak ada notifikasi terhadap admin maupun staff untuk melakukan verifikasi dan konfirmasi pembelian.
3. Tidak ada laporan transaksi pada sistem.
4. Tidak ada sistem untuk menghasilkan *invoice* kepada pengguna, dan laporan penjualan ataupun keuangan kepada admin.

Dan masih banyak hal lainnya yang dapat digunakan sebagai titik awal untuk pengembangan lebih lanjut.
