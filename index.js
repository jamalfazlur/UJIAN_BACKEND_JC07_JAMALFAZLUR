const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var app = express();
const port = process.env.port || 1983;

const conn = mysql.createConnection({
    host: 'localhost',
    // host: 'db4free.net',
    user: 'jamalnew',
    password: 'bismillah114',
    database: 'tokobuku',
    port: 3306
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send("<h1>API running! Congrats!</h1>");        
})

app.get('/getbykategori/:nama', (req,res) => {
    var namaKat = req.params.nama;
    var sql = `SELECT 
    JBK.id AS ID_JBK, B.id, no_isbn, judul, penulis, penerbit, jumlah_halaman, harga, deskripsi, K.nama 
    FROM buku B 
    JOIN join_buku_kategori JBK ON JBK.id_buku = B.id
    JOIN kategori K ON JBK.id_kategori = K.id 
    WHERE K.nama LIKE '%${namaKat}%'; `;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })
})

app.post('/addrelation', (req,res) => {
    var { judul, kategori } = req.body;

    var sql =   `INSERT INTO join_buku_kategori VALUES
                (null, (SELECT id FROM buku WHERE judul LIKE '%${judul}%'), 
                (SELECT id FROM kategori WHERE nama LIKE '%${kategori}%'));`;
    
    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.send(`Buku ${judul} Berhasil Ditambahkan Ke Kategori ${kategori}`);
    })
})

app.delete('/deleterelation', (req,res) => {
    var { judul, kategori } = req.body;

    var sql =   `DELETE join_buku_kategori FROM join_buku_kategori
                JOIN kategori ON join_buku_kategori.id_kategori = kategori.id
                JOIN buku ON join_buku_kategori.id_buku = buku.id
                WHERE (buku.judul LIKE '%${judul}%') AND (kategori.nama LIKE '%${kategori}%');`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log(`Buku ${judul} Berhasil Dihapus Dari Kategori ${kategori}`);
        res.send(`Buku ${judul} Berhasil Dihapus Dari Kategori ${kategori}`);
    })
})

app.post('/updaterelation', (req,res) => {
    var { judul, kategori, newKategori } = req.body;

    var sql =   `UPDATE join_buku_kategori SET id_kategori = 
        (SELECT id FROM kategori WHERE nama LIKE '%${newKategori}%')
        WHERE id_buku = (SELECT id FROM buku WHERE judul LIKE '%${judul}%') 
        AND id_kategori = ( SELECT id FROM kategori WHERE nama LIKE '%${kategori}%');`;
    
        conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log(`Buku ${judul} Berhasil Dipindakan Dari Kategori ${kategori}, ke Kategori ${newKategori}`);
        res.send(`Buku ${judul} Berhasil Dipindakan Dari Kategori ${kategori}, ke Kategori ${newKategori}`);
    })
})

app.listen(port, () => console.log('API Aktif di port ' + port
                                    + '\nhttp://localhost:' + port))