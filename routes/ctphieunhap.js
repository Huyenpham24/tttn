var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

//chi tiet phieu nhap
router.get('/ctpn', function(req, res) {
    conn.query("SELECT * FROM ctphieunhap", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/ctpn/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        query_string = "SELECT * FROM ctphieunhap where IDPHIEUNHAP=" + id;
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
        conn.query("SELECT * FROM ctphieunhap", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

router.post('/ctpn', function(req, res) {
    var {IDPHIEUNHAP, IDSP, SOLUONG, GIANHAP} = req.body;
    conn.query(`INSERT INTO ctphieunhap (IDPHIEUNHAP, IDSP, SOLUONG, GIANHAP) 
                VALUES (${conn.escape(IDPHIEUNHAP)}, ${conn.escape(IDSP)}, ${conn.escape(SOLUONG)}, ${conn.escape(GIANHAP)})`, function(err, result) {
                    if(err) throw err;
                    res.json({status: 200});
    });
});

router.put('/ctpn/:idpn/:idsp', function(req, res, next) {
    let idpn = req.params.idpn;
    let idsp = req.params.idsp;
    var {SOLUONG, GIANHAP} = req.body;
    if(!idpn && !idsp) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('UPDATE ctphieunhap SET SOLUONG=?, GIANHAP=? WHERE IDPHIEUNHAP=? AND IDSP=?',[SOLUONG, GIANHAP, idpn, idsp], function(err, result) {
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


router.delete('/ctpn/:idpn/:idsp', function(req, res, next) {
    let idpn = req.params.idpn;
    let idsp = req.params.idsp;
    if(!idpn && !idsp) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('DELETE FROM ctphieunhap WHERE IDPHIEUNHAP=? AND IDSP=?',[idpn, idsp], function(err, result) {
            if(err) {
                return next(new ErrorResponse(500, err.sqlMessage));
            }
            if(result.affectedRows > 0) {
                console.log("Deleted");
                res.json({status: 200});
            }
            else {
                return next(new ErrorResponse(404, `Wrong action`));
            }
        });
    }
});

module.exports = router;