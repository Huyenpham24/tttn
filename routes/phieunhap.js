var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

//phieunhap
router.get('/phieunhap', function(req, res) {
    conn.query("SELECT * FROM phieunhap", function(err, result) {
        if(err) throw err;
        res.json(result);
    });
});

router.get('/phieunhap/:id', function(req, res) {
    let id = req.params.id;
    conn.query('SELECT * FROM phieunhap WHERE IDPHIEUNHAP=?',[id], function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/phieunhap', function(req, res) {
    var {IDCONGTY, NGAY} = req.body;
    conn.query(`INSERT INTO phieunhap (IDCONGTY, NGAY) VALUES (${conn.escape(IDCONGTY)}, ${conn.escape(NGAY)})`, function(err, result) {
        if(err) throw err;
        res.json({status: 200});
    });
});

router.put('/phieunhap/:id', function(req, res, next) {
    let id = req.params.id;
    var {IDCONGTY, NGAY} = req.body;
    if(!id) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('UPDATE phieunhap SET IDCONGTY=?, NGAY=? WHERE IDPHIEUNHAP=?',[IDCONGTY,NGAY,id], function(err, result) {
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

router.delete('/phieunhap/:id', function(req, res, next) {
    let id = req.params.id;
    if(!id) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('DELETE FROM phieunhap WHERE IDPHIEUNHAP=' + id, function(err, result) {
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