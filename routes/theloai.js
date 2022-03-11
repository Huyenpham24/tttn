var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

//loaisanpham
router.get('/theloai', function (req, res) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    conn.query("SELECT * FROM theloai ORDER BY MATHELOAI ASC", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/theloai/:MATHELOAI', function (req, res, next) {
    let id = req.params.MATHELOAI;
    if (id) {
        query_string = "SELECT * FROM theloai WHERE MATHELOAI=" + "'"+ id +"'";
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
        conn.query("SELECT * FROM theloai", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

// router.post('/loaisanpham', function (req, res, next) {
//     var {TENLOAI} = req.body;
//     conn.query(`INSERT INTO loaisp (TENLOAI) VALUES (${conn.escape(TENLOAI)})`, function(err, result) {
//         if(err) 
//             {
//                 res.json({status: 500});
//                 //return next(new ErrorResponse(500, `Wrong action`));
//             }
//             if(result.lenght > 0) {
//                 console.log("added");
//                 res.json({status: 200});
//             }
//             else {
//                 return next(new ErrorResponse(404, `Không tồn tại loại sản phẩm`));
//             }
//     }); 
// });


router.post('/theloai', function(req, res, next) {
    var {MATHELOAI, TENTHELOAI} = req.body;
    conn.query(`SELECT TENTHELOAI FROM theloai WHERE TENTHELOAI = ${conn.escape(TENTHELOAI)}`, function (err, result, fields) {
        if (err) throw err;
        var [tt] = result;
        if(tt){ 
            res.json({status: 500});
            return next(new ErrorResponse(500, `Wrong action`));
        }else{ 
            var sql = `INSERT INTO theloai (MATHELOAI, TENTHELOAI) VALUES (${conn.escape(MATHELOAI)}, ${conn.escape(TENTHELOAI)})`
        }
        conn.query(sql, function(err, result) {
            if(err) throw err;
            res.json({status: 200});
        });
    });
    
});

router.put('/theloai/:MATHELOAI', function(req,res,next) {
    let id = req.params.MATHELOAI;
    var {TENTHELOAI} = req.body;
    conn.query('UPDATE theloai SET TENTHELOAI=?  WHERE MATHELOAI=?', [TENTHELOAI, id], function(err, result) {
        if(err) 
        {
            res.json({status: 500});
            return next(new ErrorResponse(500, `Wrong action`));
        }
        else if(result.affectedRows > 0) {
            res.json({status: 200});
        }
        else {
            return next(new ErrorResponse(404, `Không tồn tại sản phẩm`));
        }
    });
});

router.delete('/theloai/:MATHELOAI', function (req, res, next) {
    let id = req.params.MATHELOAI;
    if(id) {
        query_string = "DELETE FROM theloai WHERE MATHELOAI =" + "'" + id + "'";
        conn.query(query_string, function (err, result) {
            if(err) 
            {
                res.json({status: 500});
                return next(new ErrorResponse(500, err.sqlMessage));
            }
            if(result.affectedRows > 0) {
                console.log("Deleted");
                res.json({status: 200});
            }
            else {
                return next(new ErrorResponse(404, `Không tồn tại loại sản phẩm`));
            }
        }); 
    }
});

module.exports = router;