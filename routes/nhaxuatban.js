var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

//congty
router.get('/congty', function(req, res) {
    conn.query("SELECT * FROM congty", function(err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/congty/:id', function(req, res) {
    let id = req.params.id;
    conn.query('SELECT * FROM congty WHERE IDCONGTY=?',[id], function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/congty', function(req, res) {
    var {IDCONGTY,TENCONGTY,MASOTHUE,DIACHI} = req.body;
    conn.query(`INSERT INTO congty(IDCONGTY,TENCONGTY,MASOTHUE,DIACHI) 
                VALUES (${conn.escape(IDCONGTY)}, ${conn.escape(TENCONGTY)}, ${conn.escape(MASOTHUE)}, ${conn.escape(DIACHI)})`, 
                function(err, result) {
                    if (err) throw err;
                    console.log("Added");
                    res.json({status: 200})
                });
});

router.put('/sanpham/:id', function(req,res) {
    let id = req.params.id;
    var {TENSP,SOLUONG,GIA,GIAKM,MOTA,TIEUDE,URLSP,IDLOAI} = req.body;
    conn.query('UPDATE sanpham SET TENSP=?, SOLUONG=?, GIA=?, GIAKM=?, MOTA=?, TIEUDE=?, URLSP=?, IDLOAI=? WHERE IDSP=?', [TENSP,SOLUONG,GIA,GIAKM,MOTA,TIEUDE,URLSP,IDLOAI,id], function(err,result) {
                    if (err) throw err;
                    console.log("Updated");
                    res.json({status: 200})
                });
});

router.put('/congty/:id', function(req, res) {
    let id = req.params.id;
    var {TENCONGTY,MASOTHUE,DIACHI} = req.body;
    conn.query('UPDATE congty SET TENCONGTY=?, MASOTHUE=?, DIACHI=? WHERE IDCONGTY=?',[TENCONGTY,MASOTHUE,DIACHI,id], function(err, result) {
        if (err) throw err;
        console.log("Updated");
        res.json({status: 200})
    });
});

router.delete('/congty/:id', function(req, res) {
    let id = req.params.id;
    conn.query('DELETE FROM congty WHERE IDCONGTY=?',[id], function(err, result) {
        if(err) 
        {
            return next(new ErrorResponse(500, err.sqlMessage));
        }
        if(result.affectedRows > 0) {
            console.log("Deleted");
            res.json({status: 200});
        }
        else {
            return next(new ErrorResponse(404, `Không tồn tại công ty`));
        }
    });
});

module.exports = router;