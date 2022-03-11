var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

function isEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

//nhan vien
router.get('/nhanvien', function (req, res) {
    conn.query("SELECT * FROM nhanvien", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/nhanvien/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        query_string = "SELECT * FROM nhanvien where IDNV=" + id;
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
        conn.query("SELECT * FROM nhanvien", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

router.post('/nhanvien', function (req, res) {
    var {HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK} = req.body;
    if(!isEmail(EMAIL))
    {
        return next(new ErrorResponse(400,"Wrong Email"));
    }
    conn.query(`INSERT INTO nhanvien (HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK) 
                VALUES (${conn.escape(HOTEN)}, ${conn.escape(GIOITINH)}, ${conn.escape(SDT)}, ${conn.escape(DIACHI)}, ${conn.escape(EMAIL)}, ${conn.escape(IDTK)})`, function(err, result) {
                    if (err) throw err;
                    console.log("Added");
                    res.json({status: 200});
                });
});

router.put('/nhanvien/:id', function(req, res, next) {
    let id = req.params.id;
    var {HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK} = req.body;
    if(!id) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else if(!isEmail(EMAIL))
    {
        return next(new ErrorResponse(400,"Wrong Email"));
    }
    else {
        conn.query('UPDATE nhanvien SET HOTEN=?, GIOITINH=?, SDT=?, DIACHI=?, EMAIL=?, IDTK=? WHERE IDNV=?',
        [HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK, id], function(err, result) {
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

router.delete('/nhanvien/:id', function(req, res, next) {
    let id = req.params.id;
    if(!id) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('DELETE FROM nhanvien WHERE IDNV=' + id, function(err, result) {
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