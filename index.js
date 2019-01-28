const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var app = express();
const port = process.env.port || 1997;

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'jamalnew',
    password: 'bismillah114',
    database: 'moviebertasbih',
    port: 3306
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send("<h1>API running! Congrats!</h1>");        
})

// ======================================================================================
// ============================== MOVIES ================================================
// ======================================================================================

// ------------------- GET ALL MOVIES ---------------------------------------------------
app.get('/getmovies', (req,res) => {
    
    var sql = `SELECT M.id AS 'ID Movie',  
                M.nama AS 'Nama Movie',
                M.tahun AS 'Tahun',
                M.description AS 'Deskripsi',
                C.id AS 'ID Kategori',
                C.nama AS 'Kategori'
                FROM movcat MC
                JOIN categories C
                ON MC.idcategory = C.id 
                RIGHT JOIN movies M 
                ON MC.idmovie = M.id;`;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })

})

// ------------------- GET MOVIES BY CATEGORY (USE PARAMS) ------------------------------
app.get('/getmovies/:keyword', (req,res) => {

    var kategori = req.params.keyword;
    var sql =  `SELECT M.id AS 'ID Movie',  
                M.nama AS 'Nama Movie',
                M.tahun AS 'Tahun',
                M.description AS 'Deskripsi',
                C.id AS 'ID Kategori',
                C.nama AS 'Kategori'
                FROM movcat MC
                JOIN movies M 
                ON MC.idmovie = M.id
                JOIN categories C
                ON MC.idcategory = C.id
                WHERE C.nama LIKE '%${kategori}%';`;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })

})

// ----------------------------- ADD MOVIES --------------------------------------------
app.post('/addmovie', (req,res) => {

    var { nama, tahun, description } = req.body;

    var sql =   `INSERT INTO movies VALUES
                (null, '${nama}', ${tahun}, '${description}');`;

    conn.query(sql, (err, result) => {
    if(err) throw err;
    console.log("Add Movie: SUCCESS !")
    res.send(result);
    })
})
// --------------------- DELETE MOVIES (USE PARAMS) ------------------------------------
app.delete('/deletemovie/:id', (req,res) => {
    var idMovie = req.params.id;

    sql = `DELETE FROM movies WHERE id = ${idMovie};`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        
        sql = `DELETE FROM movcat WHERE idmovie = ${idMovie};`;

        conn.query(sql, (err1, result1) => {
            if(err1) throw err1;
            console.log(`ID Movie: ${idMovie}, BERHASIL DIHAPUS dari MOVCAT`)
        })
        
        console.log(`ID Movie: ${idMovie}, BERHASIL DIHAPUS dari MOVIES`)
        res.send(result);
    })

})

// ------------------- UPDATE MOVIES (USE PARAMS & BODY) -------------------------------
app.post('/updatemovie/:id', (req, res) => {
    var idMovie = req.params.id;
    var { nama = "", tahun = "", description = "" } = req.body;

    sql = `SELECT * FROM movies WHERE id = ${idMovie};`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            // console.log(nama, tahun, description)
            if (nama == "") { nama = result[0].nama};
            if (tahun == "") { tahun = result[0].tahun};
            if (description == "") { description = result[0].description};

            sql = `UPDATE movies SET 
                    nama = '${nama}', 
                    tahun = ${tahun}, 
                    description = '${description}'
                    WHERE id = ${idMovie};`;

            conn.query(sql, (err1, result1) => {
                if(err1) throw err1;
                console.log('Update Success');
                res.send(result1);
            })
        }
        
    })
    
})

// ========================================= END of API MOVIES =======================================================


// ===================================================================================================================
// ============================================ CATEGORIES ===========================================================
// ===================================================================================================================

// ------------------- GET ALL CATEGORIES ---------------------------------------------------
app.get('/getcategories', (req,res) => {
    
    var sql = `SELECT * FROM categories`;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })

})

// ----------------------------- ADD CATEGORY --------------------------------------------
app.post('/addcategory', (req,res) => {

    var { nama } = req.body;

    var sql =   `INSERT INTO categories VALUES
                (null, '${nama}');`;

    conn.query(sql, (err, result) => {
    if(err) throw err;
    console.log("Add Category Success !")
    res.send(result);
    })
})

// --------------------- DELETE CATEGORY (USE PARAMS) -----------------------------------
app.delete('/deletecategory/:id', (req,res) => {
    var idCategory = req.params.id;

    sql = `DELETE FROM categories WHERE id = ${idCategory};`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        
        sql = `DELETE FROM movcat WHERE idcategory = ${idCategory};`;

        conn.query(sql, (err1, result1) => {
            if(err1) throw err1;
            console.log(`ID Category: ${idCategory}, BERHASIL DIHAPUS dari MOVCAT`)
        })
        
        console.log(`ID Category: ${idCategory}, BERHASIL DIHAPUS dari CATEGORIES`)
        res.send(result);
    })

})

// ------------------ UPDATE CATEGORY (USE PARAMS & BODY) -------------------------------
app.post('/updatecategory/:id', (req, res) => {
    var idCategory = req.params.id;
    var { nama } = req.body;

    sql = `SELECT * FROM categories WHERE id = ${idCategory};`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            
            sql = `UPDATE categories SET 
                    nama = '${nama}'
                    WHERE id = ${idCategory};`;

            conn.query(sql, (err1, result1) => {
                if(err1) throw err1;
                console.log('Update Category Success');
                res.send(result1);
            })
        }
        
    })
    
})

// ========================================= END of API CATEGORES ====================================================


// ===================================================================================================================
// ================================== RELATION : MOVIES <> CATEGORIES ================================================
// ===================================================================================================================

// ------------------- GET ALL RELATION ---------------------------------------------------
app.get('/getrelation', (req,res) => {
    
    var sql = `SELECT M.nama AS 'Nama Movie', C.nama AS 'Kategori'
                from movcat MC JOIN movies M 
                ON MC.idmovie = M.id
                JOIN categories C
                ON MC.idcategory = C.id`;

    conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.send(result);
    })

})

// ----------------------------- ADD RELATION : MOVIE <> CATEGORY --------------------------------------------
app.post('/addrelation', (req,res) => {

    var { idmovie, idcategory } = req.body;

    var sql =   `INSERT INTO movcat VALUES (${idmovie}, ${idcategory});`;

    conn.query(sql, (err, result) => {
    if(err) throw err;
    console.log("Add Relation Success !")
    res.send(result);
    })
})

// ----------------------------- ADD RELATION : MOVIE <> CATEGORY (BY NAME) ------------------------------------
app.post('/addrelationbyname', (req,res) => {

    var { movieName, categoryName } = req.body;

    var sql =   `INSERT INTO movcat VALUES 
                ((SELECT id FROM movies WHERE nama LIKE '%${movieName}%'), 
                (SELECT id FROM categories WHERE nama LIKE '%${categoryName}%'));`;

    conn.query(sql, (err, result) => {
    if(err) throw err;
    console.log("Add Relation Success !")
    res.send(result);
    })
})

// ------------------------------ DELETE RELATION (BY ID) ------------------------------------------------
app.delete('/deleterelation', (req,res) => {
    var {idmovie, idcategory} = req.body;

    sql = `DELETE FROM movcat WHERE idmovie = ${idmovie} AND idcategory = ${idcategory};`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log("Delete Relation (by ID) Success !")
        res.send(result);
    })

})
// ------------------------------ DELETE RELATION (BY NAME) ------------------------------------------------
app.delete('/deleterelationbyname', (req,res) => {
    var {movieName, categoryName} = req.body;


    sql =  `DELETE movcat FROM movcat
            JOIN movies ON movcat.idmovie = movies.id
            JOIN categories ON movcat.idcategory = categories.id
            WHERE movies.nama LIKE '%${movieName}%' AND categories.nama LIKE '%${categoryName}%' ;`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log("Delete Relation (by Name) Success !")
        res.send(result);
    })

})

app.listen(port, () => console.log('API Aktif di port ' + port
                                    + '\nhttp://localhost:' + port))