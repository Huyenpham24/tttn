var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

//sanpham
router.get('/sanpham', function (req, res) {
    conn.query("SELECT dausach.*, ct_gia.* FROM dausach, ct_gia WHERE dausach.MASACH = ct_gia.MASACH ORDER BY dausach.MASACH DESC", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

// sanpham moi nhat
router.get('/sanphammoi', function (req, res) {
    conn.query("SELECT * FROM dausach, ct_gia ORDER BY dausach.MASACH = ct_gia.MASACH AND dausach.MASACH DESC LIMIT 4 ", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
// sanpham noi bat
router.get('/spbanchay', function (req, res) {
    conn.query("SELECT SUM(ct_giohang.SOLUONG) as total, dausach.TENSACH, dausach.SOTRANG, dausach.HINH1, ct_gia.GIATHAYDOI, dausach.MATHELOAI FROM ct_giohang, dausach, ct_gia WHERE dausach.MASACH=ct_giohang.MASACH AND dausach.MASACH = ct_gia.MASACH AND IDGH in (SELECT IDGH FROM giohang WHERE giohang.TRANGTHAI=1 AND datediff(NOW(), giohang.NGAY) < 30) GROUP BY ct_giohang.MASACH ORDER BY total DESC LIMIT 4", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/sanpham/:MASACH', function (req, res, next) {
    let id = req.params.MASACH;
    if (id) {
        query_string = "SELECT * FROM dausach, ct_gia, ct_sangtac, tacgia where dausach.MASACH = ct_gia.MASACH = ct_sangtac.MASACH AND ct_sangtac.MATG = tacgia.MATG AND dausach.MASACH=" + "'"+ id + "'";
        conn.query(query_string, function (err, result, fields) {
            if (err) throw err;
            var [sp]= result;
                res.json(sp);
        });
    }
    else {
        conn.query("SELECT * FROM dausach", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});


router.get('/sanpham-theotheloai/:MASACH', function (req, res, next) {
    let id = req.params.MASACH;
    if (id) {
        query_string = "SELECT dausach.MASACH, dausach.TENSACH, dausach.SOTRANG, dausach.SOLUONG, dausach.NAMXB, dausach.MATHELOAI, dausach.MANXB, dausach.TRANGTHAI, dausach.HINH1, dausach.HINH2, ct_gia.GIATHAYDOI FROM dausach, theloai, ct_gia where dausach.MATHELOAI = theloai.MATHELOAI AND dausach.MASACH = ct_gia.MASACH AND theloai.MATHELOAI=" + "'"+ id +"'";
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
        conn.query("SELECT * FROM dausach", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});


router.post('/sanpham', function(req, res, next) {
    var {MASACH,TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2} = req.body;
    conn.query(`SELECT TENSACH FROM dausach WHERE TENSACH = ${conn.escape(TENSACH)}`, function (err, result, fields) {
        if (err) throw err;
        var [tt] = result;
        if(tt){ 
            res.json({status: 500});
            return next(new ErrorResponse(500, `Wrong action`));
        }else{ 
            var sql = `INSERT INTO dausach (MASACH, TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2) 
                             VALUES (${conn.escape(MASACH)}, ${conn.escape(TENSACH)}, ${conn.escape(SOTRANG)}, ${conn.escape(SOLUONG)}, ${conn.escape(NAMXB)}, ${conn.escape(MATHELOAI)}, ${conn.escape(MANXB)}, ${conn.escape(TRANGTHAI)}, ${conn.escape(HINH1)}, ${conn.escape(HINH2)})`
        }
        conn.query(sql, function(err, result) {
            if(err) throw err;
            res.json({status: 200});
        });
    });
    
});

router.put('/sanpham/:MASACH', function(req,res, next) {
    let id = req.params.MASACH;
    var {TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2} = req.body;
    conn.query('UPDATE dausach SET TENSACH=?, SOTRANG=?, SOLUONG=?, NAMXB=?, MATHELOAI=?, MANXB=?, TRANGTHAI=?, HINH1=?, HINH2=? WHERE MASACH=?', 
                [TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2,id], function(err,result) {
                    if(err) 
                    {
                        res.json({status: 400});
                    }
                    if(result) {
                        console.log("Updated");
                        res.json({status: 200});
                    }
                    else {
                        return next(new ErrorResponse(404, `Không tồn tại sản phẩm`));
                    }
                });
});

router.delete('/sanpham/:MASACH', function(req, res, next) {
   let id = req.params.MASACH;
   if(!id.trim())
   {
       return next(new ErrorResponse(400, "không có MÃ sản phẩm"));
   }
    conn.query('DELETE  FROM dausach WHERE MASACH=' + "'" + id + "'", function(err,result) {
        if(err) 
        {
            return next(new ErrorResponse(500, err.sqlMessage));
        }
        if(result.affectedRows > 0) {
            console.log("Deleted");
            res.json({status: 200});
        }
        else {
            return next(new ErrorResponse(404, `Không tồn tại sản phẩm`));
        }
    });
});

// router.post('/sanpham', function (req, res, next) {
//     var {TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2} = req.body;
//     conn.query(`INSERT INTO dausach (TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2) 
//                 VALUES (${conn.escape(MASACH)}, ${conn.escape(TENSACH)}, ${conn.escape(SOTRANG)}, ${conn.escape(SOLUONG)}, ${conn.escape(NAMXB)}, ${conn.escape(MATHELOAI)}, ${conn.escape(MANXB)}, ${conn.escape(TRANGTHAI)}, ${conn.escape(HINH1)}, ${conn.escape(HINH2)})`, function(err, result) {
//                     if(err) 
//                     {
//                         return next(new ErrorResponse(400, `Wrong action`));
//                     }
//                     if(result.affectedRows > 0) {
//                         console.log("Updated");
//                         res.json({status: 200});
//                     }
//                     else {
//                         return next(new ErrorResponse(404, `Không tồn tại sản phẩm`));
//                     }
//                     res.json({status: 200});
//                 });
// });

module.exports = router;