const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var app = express();
const port = process.env.port || 1983;

const conn = mysql.createConnection({
    host: 'localhost',
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

// ==========================================================================================================
// ------------ Get By Query -------------------------------
app.get('/getbuku', (req,res) => {
    var {judul = "", kategori = "", isbn = ""} = req.query;
    console.log(`${judul}, ${kategori}, ${isbn}`);
    //res.send(`${judul}, ${kategori}, ${isbn}`);

    var sql = `SELECT 
    JBK.id AS 'ID Table Join', B.id AS 'ID Buku', no_isbn AS 'No ISBN', judul AS 'Judul', 
    penulis AS 'Penulis', penerbit AS 'Penerbit', jumlah_halaman AS 'Jumlah Halaman', 
    harga AS 'Harga', deskripsi AS 'Deskripsi', nama AS 'Kategori' 
    FROM buku B 
    JOIN join_buku_kategori JBK ON JBK.id_buku = B.id
    JOIN kategori K ON JBK.id_kategori = K.id 
    WHERE K.nama LIKE '%${kategori}%' AND judul LIKE '%${judul}%'; `;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })

})

// ==========================================================================================================
// ------------ Get By Kategori (Params) -------------------
app.get('/kategori/:keyword', (req,res) => {
    var namaKat = req.params.keyword;
    var sql = `SELECT 
    JBK.id AS 'ID Table Join', 
    B.id AS 'ID Buku', 
    no_isbn AS 'No ISBN', 
    judul AS 'Judul', 
    penulis AS 'Penulis', 
    penerbit AS 'Penerbit', 
    jumlah_halaman AS 'Jumlah Halaman', 
    harga AS 'Harga', 
    deskripsi AS 'Deskripsi', 
    nama AS 'Kategori' 
    FROM buku B 
    JOIN join_buku_kategori JBK ON JBK.id_buku = B.id
    JOIN kategori K ON JBK.id_kategori = K.id 
    WHERE K.nama LIKE '%${namaKat}%'; `;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })
})

// ==========================================================================================================

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

// ==========================================================================================================

app.delete('/deleterelation', (req,res) => {
    var { judul, kategori } = req.body;

    // Cek, apakah buku dengan kategori yg dimaksud ada di database untuk selanjutnya di delete?
    var sql =  `SELECT  * FROM join_buku_kategori JBK
                JOIN kategori K
                ON JBK.id_kategori = K.id
                JOIN buku B ON JBK.id_buku = B.id
                WHERE B.judul LIKE '%${judul}%' AND K.nama LIKE '%${kategori}%';`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result.length);

        // Jika ada, maka execute query untuk delete
        if(result.length > 0){
           var sql =   `DELETE join_buku_kategori FROM join_buku_kategori
                        JOIN kategori ON join_buku_kategori.id_kategori = kategori.id
                        JOIN buku ON join_buku_kategori.id_buku = buku.id
                        WHERE (buku.judul LIKE '%${judul}%') AND (kategori.nama LIKE '%${kategori}%');`;

            conn.query(sql, (err1, result1) => {
                if(err1) throw err1;
                console.log(`Buku ${judul} Berhasil Dihapus Dari Kategori ${kategori}`);
                res.send(`Buku ${judul} Berhasil Dihapus Dari Kategori ${kategori}`);
            }) 
        } 
        else {
            res.send(`Buku yang kamu maksud tidak ditemukan`);
        }
    })
    
})
// ==========================================================================================================
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