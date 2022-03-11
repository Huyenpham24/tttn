var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');
 
//chi tiet don hang
router.get('/ctdh', function(req, res) {
    conn.query("SELECT * FROM ctdonhang", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/ctdh/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        query_string = "SELECT *, ctdonhang.SOLUONG as slmua FROM ctdonhang, sanpham where ctdonhang.IDSP = sanpham.IDSP AND ctdonhang.IDDH=" + id;
        conn.query(query_string, function (err, result, fields) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    else {
        conn.query("SELECT * FROM ctdonhang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

//chi tiet don hang
router.get('/sptrongdh/:id', function(req, res, next) {
    let id = req.params.id;
    conn.query("SELECT IDSP FROM ctdonhang WHERE IDSP =?", [id],function (err, result, fields) {
        if (result == "") {
            res.json({status: 400})
        }
        else {
            res.json({status: 200})
        }
    });
});

//get đơn và thông tin chi tiết đơn
router.get('/ctvahd/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        query_string = "SELECT * FROM ctdonhang , donhang where ctdonhang.IDDH = donhang.IDDH AND donhang.IDDH=" + id;
        conn.query(query_string, function (err, result, fields) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    else {
        conn.query("SELECT * FROM ctdonhang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

router.post('/ctdh', function(req, res) {
    var {IDDH, IDSP, SOLUONG} = req.body;
    conn.query(`INSERT INTO ctdonhang (IDDH, IDSP, SOLUONG) 
                VALUES (${conn.escape(IDDH)}, ${conn.escape(IDSP)}, ${conn.escape(SOLUONG)})`, function(err, result) {
                    if(err) throw err;
                    res.json({status: 200});
    });
});

router.put('/ctdh/:iddh/:idsp', function(req, res, next) {
    let iddh = req.params.iddh;
    let idsp = req.params.idsp;
    var {DONGIA} = req.body;
    if(!iddh && !idsp) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('UPDATE ctdonhang SET DONGIA=? WHERE IDDH=? AND IDSP=?',[DONGIA, iddh, idsp], function(err, result) {
            if(err) 
            {
                return next(new ErrorResponse(500, err.sqlMessage));
            }
            if(result.affectedRows > 0) {
                console.log("Updated");
                res.json({status: 200});
            }
            else {
                return next(new ErrorResponse(404, `Wrong action`));
            }
        });
    }
});


module.exports = router;