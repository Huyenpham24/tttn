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
//donhang.IDTRANGTHAI ASC,
router.get('/donhang', function (req, res) {
        conn.query("SELECT * FROM donhang, nhanvien, trangthai WHERE donhang.IDNV = nhanvien.IDNV AND donhang.IDTRANGTHAI = trangthai.IDTRANGTHAI ORDER BY donhang.IDDH DESC;", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    })

//thongke
router.get('/thongke', function (req, res) {
    conn.query("SELECT MONTH(donhang.NGAYGIAODICH) as month, SUM(TONGTIEN) as total FROM donhang WHERE  (donhang.IDTRANGTHAI=1) AND (YEAR(donhang.NGAYGIAODICH) = YEAR(NOW())) GROUP BY MONTH(donhang.NGAYGIAODICH)", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

//thongkesp banchay
router.get('/thongkespbanchay', function (req, res) {
    conn.query("SELECT SUM(ctdonhang.SOLUONG) as total, ctdonhang.IDSP, sanpham.TENSP FROM ctdonhang, sanpham WHERE sanpham.IDSP=ctdonhang.IDSP AND IDDH in (SELECT IDDH FROM donhang WHERE donhang.IDTRANGTHAI=1 AND datediff(NOW(), donhang.NGAYGIAODICH) < 30) GROUP BY ctdonhang.IDSP ORDER BY total DESC LIMIT 5", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

//thongke sp còn trong kho
router.get('/thongkekho', function(req, res) {
    conn.query("SELECT IDSP, TENSP, SOLUONG FROM sanpham", function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

//thongke all don
router.get('/thongkesp', function (req, res) {
    conn.query("SELECT SUM(ctdonhang.SOLUONG) as total, ctdonhang.IDSP, sanpham.TENSP FROM ctdonhang, sanpham WHERE sanpham.IDSP=ctdonhang.IDSP AND ctdonhang.IDDH in (SELECT donhang.IDDH FROM donhang WHERE donhang.IDTRANGTHAI=1 AND (YEAR(donhang.NGAYGIAODICH) = YEAR(NOW()))) GROUP BY ctdonhang.IDSP ORDER BY total DESC", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

//thongke all don
router.get('/thongketheongay/:ngaygiaodich', function (req, res) {
    let ngaygiaodich = req.params.ngaygiaodich
    conn.query(`SELECT SUM(donhang.TONGTIEN) as total, COUNT(donhang.IDDH) as count FROM donhang WHERE donhang.IDDH in (SELECT donhang.IDDH FROM donhang WHERE donhang.IDTRANGTHAI=1 AND (donhang.NGAYGIAODICH=DATE(?)))`,[ngaygiaodich], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/thongketrongkhoang/:ngaybatdau/:ngayketthuc', function (req, res) {
    let ngaybatdau = req.params.ngaybatdau
    let ngayketthuc = req.params.ngayketthuc
    conn.query(`SELECT DATE_FORMAT(donhang.NGAYGIAODICH,'%d/%m/%Y') as DATE, SUM(donhang.TONGTIEN) as TOTAL FROM donhang WHERE IDTRANGTHAI=1 AND donhang.NGAYGIAODICH BETWEEN DATE(?) AND DATE(?) GROUP BY donhang.NGAYGIAODICH`,[ngaybatdau, ngayketthuc], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/tongdonhang/:id', function (req, res) {
    let id = req.params.id;
    if(id)
    {
        conn.query('SELECT * FROM donhang, trangthai, ctdonhang, khachhang WHERE donhang.IDKH=khachhang.IDKH AND donhang.IDTRANGTHAI = trangthai.IDTRANGTHAI AND ctdonhang.IDDH = donhang.IDDH AND khachhang.IDTK=?',[id], function(err,result) {
            if (err) throw err;
            console.log("Updated");
            res.json(result)
        }); 
    }
});

router.get('/tttrangthai/:id', function (req, res) {
    let id = req.params.id;
    if(id)
    {
        conn.query('SELECT * FROM donhang WHERE IDTRANGTHAI=2 AND donhang.IDDH=?',[id], function(err,result) {
            if (result == "") {
                res.json({status: 400})
            }
            else {
                
                res.json({status: 200})
            }
        }); 
    }
});

router.get('/donhang/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        query_string = "SELECT * FROM donhang, khachhang, trangthai where trangthai.IDTRANGTHAI=donhang.IDTRANGTHAI AND donhang.IDKH = khachhang.IDKH AND khachhang.IDTK=" +id +" ORDER BY donhang.IDDH DESC"; 
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
        conn.query("SELECT * FROM donhang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

//get khach hang theo ma don hang
router.get('/donhangkh/:id', function (req, res, next) {
    let id = req.params.id;
    if (id) {
        query_string = "SELECT khachhang.HOTEN, khachhang.GIOITINH, khachhang.SDT, khachhang.DIACHI, khachhang.EMAIL FROM donhang, khachhang WHERE khachhang.IDKH=donhang.IDKH AND IDDH=" + id;
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
        conn.query("SELECT * FROM donhang", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
});

router.post('/donhang', function (req, res) {
    var { name, phone, address, email, idtk, thanhToan, notes, tongTien} = req.body;
    conn.query(`
    SELECT * FROM giohang WHERE IDTK = ${conn.escape(idtk)}; SELECT IDKH FROM khachhang WHERE IDTK = ${conn.escape(idtk)}; 
    SELECT *, giohang.SOLUONG as slmua FROM giohang, sanpham WHERE giohang.IDSP = sanpham.IDSP AND giohang.IDTK = ${conn.escape(idtk)}`, function (err, result, fields) {
        if (err) throw err;
        var [listSP, [kh], sp] = result;
        var isAllow = true;
        for(var i = 0, len = sp.length; i < len; i++){ 
            if(((sp[i].SOLUONG) - (sp[i].slmua)) < 0){
                isAllow = false;
                 break;
            }
        }
        if(!isAllow){
            res.json({status: 400})
        }else{
            var sql = `INSERT INTO donhang (TONGTIEN, NGAYGIAODICH, HOTENKH, SDTKH, DIACHIKH, EMAILKH, GHICHU, THANHTOAN, IDTRANGTHAI, IDKH, IDNV) VALUES (${conn.escape(tongTien)}, NOW(), ${conn.escape(name)}, ${conn.escape(phone)}, ${conn.escape(address)}, ${conn.escape(email)}, ${conn.escape(notes)}, ${conn.escape(thanhToan)}, 2, ${conn.escape(kh.IDKH)}, '1')`
                conn.query(sql, function(err, result) {
                if (err) throw err;
                var IDDH = result.insertId;
                var sqlUpdateCTGH = [];
                for(var j = 0   , len = listSP.length; j < len; j++){
                    sqlUpdateCTGH.push(`INSERT INTO ctdonhang (IDDH, IDSP, SOLUONG, DONGIA) VALUES (${IDDH}, ${conn.escape(listSP[j].IDSP)}, ${conn.escape(listSP[j].SOLUONG)}, ${conn.escape(sp[j].GIA)})`)
                    sqlUpdateCTGH.push(`UPDATE sanpham SET SOLUONG = SOLUONG - ${conn.escape(listSP[j].SOLUONG)} WHERE IDSP = ${conn.escape(listSP[j].IDSP)}`)
                }
                    sqlUpdateCTGH.push(`DELETE FROM giohang WHERE IDTK = ${conn.escape(idtk)}`)
                    conn.query(sqlUpdateCTGH.join(';'), function(err, result) {
                        if (err) throw err;
                        res.json({status: 200});
                    })
                });
        }
    });
});


router.delete('/huydonhang/:iddh', function(req, res, next) {
    let iddh = req.params.iddh;
    conn.query("SELECT *, ctdonhang.SOLUONG as slmua FROM ctdonhang WHERE IDDH = " +iddh + "; SELECT IDTRANGTHAI FROM donhang WHERE IDDH = "+ iddh , function (err, result, fields) {
        if (err) throw err;
        var [list, [don]] = result;
        if(don.IDTRANGTHAI === 2 || don.IDTRANGTHAI === 3) {
            var sqlUpdateCTGH = [];
            for(var i = 0   , len = list.length; i < len; i++){
            sqlUpdateCTGH.push(`UPDATE sanpham SET SOLUONG = SOLUONG + ${list[i].slmua} WHERE IDSP = ${list[i].IDSP}`)
            }
            sqlUpdateCTGH.push(`UPDATE donhang SET IDTRANGTHAI = 4 WHERE IDDH = ${iddh}`)
            conn.query(sqlUpdateCTGH.join(';'), function(err, result) {
                if (err) throw err;
                res.json({status: 200});
            })
        }
        else{
            res.json({status: 400})
        }
     });
 });


router.put('/donhang/:id', function(req,res) {
    let id = req.params.id;
    var {TONGTIEN, NGAYGIAODICH, HOTENKH, SDTKH, DIACHIKH, EMAILKH, GHICHU, THANHTOAN, IDTRANGTHAI, IDKH, IDNV} = req.body;
    conn.query('UPDATE donhang SET TONGTIEN=?, NGAYGIAODICH=?, HOTENKH=?, SDTKH=?, DIACHIKH=?, EMAILKH=?, GHICHU=?, THANHTOAN=?, IDTRANGTHAI=?, IDKH=?, IDNV=? WHERE IDDH=?', 
                [TONGTIEN, NGAYGIAODICH, HOTENKH, SDTKH, DIACHIKH, EMAILKH, GHICHU, THANHTOAN, IDTRANGTHAI, IDKH, IDNV, id], function(err,result) {
                    if (err) throw err;
                    console.log("Updated");
                    res.json({status: 200})
                });
});


router.get('/donhangtheott/:id', function (req, res) {
    let id = req.params.id;
    if(id){
        conn.query('SELECT * FROM donhang WHERE IDTRANGTHAI=? ORDER BY donhang.IDDH DESC',[id], function(err,result) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(result);
            }
        }); 
    }
    else{
        res.json({status: 400})
    }
});

module.exports = router;
