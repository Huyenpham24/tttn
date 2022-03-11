var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

function isEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validatePhoneNumber(phone) {
	var re = /((0)+([0-9]{9})\b)/g;

	return re.test(phone);
}

//khach hang
router.get('/khachhang', function (req, res) {
    conn.query("SELECT * FROM khachhang", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/khachhang/:MAKHACHHANG', function (req, res, next) {
    let id = req.params.MAKHACHHANG;
    if (id) {
        query_string = "SELECT * FROM khachhang where MAKH=" + "'" + id +"'";
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
        conn.query("SELECT * FROM khachhang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

//get KH từ mã Tài khoản
router.get('/tkkh/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        sql = "SELECT * FROM khachhang, taikhoan WHERE khachhang.IDTK=taikhoan.IDTK AND khachhang.IDTK=" + id;
        conn.query(sql, function (err, result, fields) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    else {
        conn.query("SELECT * FROM khachhang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});


router.get('/tkkh', function (req, res, next) {
    sql = "SELECT khachhang.HOTEN, khachhang.SDT, khachhang.EMAIL, khachhang.IDKH, taikhoan.USERNAME FROM khachhang, taikhoan WHERE khachhang.IDTK=taikhoan.IDTK";
    conn.query(sql, function (err, result, fields) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});




router.post('/khachhang', function (req, res) {
    var {HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK} = req.body;
    if(!isEmail(EMAIL))
    {
        return next(new ErrorResponse(400,"Wrong Email"));
    }
    conn.query(`INSERT INTO khachhang (HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK) 
                VALUES (${conn.escape(HOTEN)}, ${conn.escape(GIOITINH)}, ${conn.escape(SDT)}, ${conn.escape(DIACHI)}, ${conn.escape(EMAIL)}, ${conn.escape(IDTK)})`, function(err, result) {
                    if (err) throw err;
                    console.log("Added");
                    res.json({status: 200});
                });
});

router.put('/khachhang/:id', function(req, res, next) {
    let id = req.params.id;
    var {HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK} = req.body;
    if(!id) {
        return next(new ErrorResponse(404,"Wrong ID"));
    }
    else if(!isEmail(EMAIL))
    {
        res.json({status: 400});
    }
    else if(!validatePhoneNumber(SDT))
    {
        res.json({status: 300});
    }
    else {
        conn.query('UPDATE khachhang SET HOTEN=?, GIOITINH=?, SDT=?, DIACHI=?, EMAIL=?, IDTK=? WHERE IDTK=?',
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

router.delete('/khachhang/:id', function(req, res, next) {
    let id = req.params.id;
    if(!id) {
        return next(new ErrorResponse(400,"Wrong ID"));
    }
    else {
        conn.query('DELETE FROM khachhang WHERE IDKH=' + id, function(err, result) {
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