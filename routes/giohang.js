var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

router.get('/giohang', function(req, res) {
    conn.query("SELECT * FROM giohang", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

//get đơn và thông tin chi tiết đơn
router.get('/giohang/:IDGH', function (req, res, next) {
    let id = req.params.IDGH;
    if (id) {
        var sql = `SELECT ctgh.IDGH, ctgh.gia, ds.MASACH , ds.TENSACH, ds.TRANGTHAI, ds.HINH1, ctgh.SOLUONG as count FROM ct_giohang ctgh , dausach ds WHERE ctgh.MASACH = ds.MASACH AND ctgh.IDGH =+ ${conn.escape(id)}`;
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }else {
        conn.query("SELECT * FROM giohang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

//get đơn và thông tin chi tiết đơn
router.get('/giohang/:MAKH/:MASACH', function (req, res, next) {
    let idtk = req.params.MAKH;
    let idsp = req.params.MASACH;
    if (idtk && idsp) {
        var sql = `SELECT ctgh.IDGH, ctgh.gia, ds.MASACH , ds.TENSACH, ds.TRANGTHAI, ds.HINH1, ctgh.SOLUONG as count FROM ct_giohang ctgh , dausach ds WHERE giohang.MASACH= +
        ${conn.escape(idsp)} AND giohang.MAKH= + ${conn.escape(idtk)}`;
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }else {
        conn.query("SELECT * FROM giohang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    } 
});

router.post('/giohang', function(req, res) {
    var {MAKH, MASACH, SOLUONG} = req.body;
    conn.query(`
    SELECT SOLUONG FROM ct_giohang, giohang WHERE MAKH = ${conn.escape(MAKH)} AND MASACH = ${conn.escape(MASACH)}; 
    SELECT SOLUONG FROM dausach WHERE MASACH = ${conn.escape(MASACH)}`, function (err, result, fields) {
        if (err) throw err;
        var [[gh], [sp]] = result;
        if((gh?.SOLUONG || 0) + SOLUONG <= sp.SOLUONG){
            if(gh){ // Ton tai nen chi update so luong
                var sql = `UPDATE giohang SET SOLUONG = SOLUONG + 1 WHERE IDTK = ${conn.escape(IDTK)} AND IDSP = ${conn.escape(IDSP)}`
            }else{ // khonng ton tai nen them moi
                var sql = `INSERT INTO giohang (IDTK, IDSP, SOLUONG) VALUES (${conn.escape(IDTK)}, ${conn.escape(IDSP)}, 1)`
            }
            conn.query(sql, function(err, result) {
                if(err) throw err;
                res.json({status: 200});
            });
        }else{
            res.json({status: 300})
        }
    });
});

router.put('/ctgh/:idtk/:idsp', function(req, res, next) {
    let idtk = req.params.idtk;
    let idsp = req.params.idsp;
    var {SOLUONG} = req.body;
    if(!idtk && !idsp) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('UPDATE giohang SET SOLUONG=? WHERE IDTK=? AND IDSP=?',[SOLUONG, idtk, idsp], function(err, result) {
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

router.post('/giohang/update', function(req, res, next) {
    var {id, giohang} = req.body;
    var sql = [];
    for(var i = 0, len = giohang.length; i < len; i++){
        sql.push(`UPDATE giohang SET SOLUONG = ${conn.escape(giohang[i].count)} WHERE IDTK = ${conn.escape(giohang[i].IDTK)} AND IDSP = ${conn.escape(giohang[i].IDSP)}`)
    }
    conn.query(sql.join(';'), function (err, result) {
        if (err) throw err;
        res.json({status: 200})
    });
});


router.delete('/ctgh/:idtk/:idsp', function(req, res, next) {
    let idtk = req.params.idtk;
    let idsp = req.params.idsp;
    if(!idtk && !idsp) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('DELETE FROM giohang WHERE IDTK=? AND IDSP=?',[idtk, idsp], function(err, result) {
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