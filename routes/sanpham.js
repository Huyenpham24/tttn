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
    conn.query("SELECT dausach.MASACH, dausach.TENSACH, ct_gia.GIATHAYDOI FROM dausach, ct_gia ORDER BY dausach.MASACH = ct_gia.MASACH AND dausach.MASACH DESC LIMIT 4 ", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
// sanpham noi bat
router.get('/spbanchay', function (req, res) {
    let newQuery = "SELECT SUM(ct.soluong) as total, ct.masach, ds.tensach, ds.sotrang, ds.hinh1, ctg.giathaydoi, tl.tentheloai  from ct_giohang ct ";
    newQuery+=" left join giohang gh on gh.idgh = ct.idgh and gh.trangthai = 1"
    newQuery+=" left join dausach ds on ct.masach = ds.masach"
    newQuery+=" left join ct_gia ctg on ctg.masach = ct.masach"
    newQuery+=" left join theloai tl on tl.matheloai = ds.matheloai"
    newQuery+=" where DATEDIFF(NOW(),gh.NGAY) < 30"
    newQuery+=" group by ct.masach order by total DESC LIMIT 3";
    conn.query(newQuery, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/sanpham/:MASACH', function (req, res, next) {
    let id = req.params.MASACH;
    if (id) {
      let query_string = "SELECT ds.MASACH, ds.TENSACH, ds.SOTRANG, ds.SOLUONG, ds.NAMXB, nxb.TENNXB, ds.MATHELOAI, ds.HINH1, tg.TEN, gia.GIATHAYDOI, tl.TENTHELOAI, st.MOTA FROM dausach ds ";
        query_string += " LEFT JOIN ct_gia gia ON gia.MASACH = ds.MASACH ";
        query_string += " LEFT JOIN ct_sangtac  st on st.MASACH = ds.MASACH"
        query_string +=" LEFT JOIN tacgia tg on st.MATG = st.MATG "
        query_string +=" LEFT JOIN theloai tl on tl.MATHELOAI = ds.MATHELOAI"
        query_string +=" LEFT JOIN nhaxuatban nxb on nxb.MANXB = ds.MANXB"
        query_string += ` WHERE ds.MASACH = '${id}'` 
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

// router.get('/sanpham/:TENSACH', (req, res, next) => {
//     const filters = req.query;
//     const filteredUsers = data.filter(user => {
//       let isValid = true;
//       for (key in filters) {
//         console.log(key, user[key], filters[key]);
//         isValid = isValid && user[key] == filters[key];
//       }
//       return isValid;
//     });
//     res.send(filteredUsers);
//   });

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
    var {MASACH,TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2,NGAY,GIATHAYDOI} = req.body;
    conn.query(`SELECT TENSACH FROM dausach WHERE TENSACH = ${conn.escape(TENSACH)}`, function (err, result, fields) {
        if (err) throw err;
        var [tt] = result;
        if(tt){ 
            res.json({status: 500});
            return next(new ErrorResponse(500, `Wrong action`));
        }else{ 
            var sql = `INSERT INTO dausach (MASACH,TENSACH,SOTRANG,SOLUONG,NAMXB,MATHELOAI,MANXB,TRANGTHAI,HINH1,HINH2)
                             VALUES (${conn.escape(MASACH)}, ${conn.escape(TENSACH)}, ${conn.escape(SOTRANG)}, ${conn.escape(SOLUONG)}, ${conn.escape(NAMXB)}, ${conn.escape(MATHELOAI)}, ${conn.escape(MANXB)}, ${conn.escape(TRANGTHAI)}, ${conn.escape(HINH1)}, ${conn.escape(HINH2)},${conn.escape(NGAY)}, ${conn.escape(GIATHAYDOI)})`
            var sql = `INSERT INTO ct_gia (MASACH, NGAY, GIATHAYDOI) VALUES (${conn.escape(MASACH)},${conn.escape(NGAY)},${conn.escape(GIATHAYDOI)})`
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
    conn.query('DELETE  FROM dausach, ct_gia WHERE dausach.MASACH = ct_gia.MASACH AND MASACH=' + "'" + id + "'", function(err,result) {
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