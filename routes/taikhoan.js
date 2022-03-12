var express = require("express");
var router = express.Router();
const ErrorResponse = require("../Models/ErrorResponse");
const { response, route } = require("../server");

let conn = require("../Dbconnection.js");

function isEmail(email) {
  const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function validatePhoneNumber(phone) {
  var re = /((0)+([0-9]{9})\b)/g;

  return re.test(phone);
}

//Tài khoản(CRUD)
router.get("/taikhoankhachhang", function (req, res) {
  conn.query(
    "SELECT EMAIL, PASSWORD FROM khachhang ",
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
});
router.get("/taikhoannhanvien", function (req, res) {
  conn.query(
    "SELECT EMAIL, PASSWORD FROM nhanvien",
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
});

router.get("/taikhoan/:MAKH", function (req, res, next) {
  let id = req.params.MAKH;
  if (id) {
    query_string = "SELECT * FROM khachhang where MAKH=" + "'" + id + "'";
    conn.query(query_string, function (err, result, fields) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  } else {
    conn.query("SELECT * FROM khachhang", function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  }
});
router.get("/taikhoan/:MANV", function (req, res, next) {
  let id = req.params.MANV;
  if (id) {
    query_string = "SELECT * FROM nhanvien where MANV=" + "'" + id + "'";
    conn.query(query_string, function (err, result, fields) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  } else {
    conn.query("SELECT * FROM nhanvien", function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  }
});

router.post("/taikhoan", function (req, res, next) {
  // var {USERNAME,PASSWORD,IDQUYEN, EMAIL, SDT, HOTEN, DIACHI} = req.body;
  // if(!isEmail(EMAIL))
  // {
  //     res.json({status: 400});
  // }
  // else if(!validatePhoneNumber(SDT))
  // {
  //     res.json({status: 300});
  // }
  // else {
  //     conn.query(`
  //     SELECT USERNAME FROM taikhoan WHERE USERNAME = ${conn.escape(USERNAME)};
  //     SELECT IDKH FROM khachhang WHERE SDT = ${conn.escape(SDT)} AND EMAIL = ${conn.escape(EMAIL)}`, function (err, result, fields) {
  //         if (err) throw err;
  //         var [[tt], [kh]] = result;
  //         if(!tt){
  //             conn.query(`INSERT INTO taikhoan (USERNAME, PASSWORD, IDQUYEN) VALUES (${conn.escape(USERNAME)}, ${conn.escape(PASSWORD)}, ${conn.escape(IDQUYEN)})`, function(err, result) {
  //                 if(err) throw err;
  //                 var IDTK = result.insertId;
  //                 if(kh){
  //                     res.json({status: 500, msg: "Email, sdt đã dùng để đăng ký tài khoản khác"})
  //                 }else{
  //                     var sql = `INSERT INTO khachhang (HOTEN, SDT, EMAIL, IDTK, DIACHI) VALUES (${conn.escape(HOTEN)}, ${conn.escape(SDT)}, ${conn.escape(EMAIL)}, ${conn.escape(IDTK)},  ${conn.escape(DIACHI)})`
  //                 }
  //                 conn.query(sql, function(err, result) {
  //                     if(err) throw err;
  //                     res.json({status: 200, msg: "Đăng ký thành công"})
  //                 })
  //             });
  //         }else{
  //             res.json({status: 500, msg: "Tài khoản tồn tại"})
  //         }
  //     });
  // }
  var { USERNAME, PASSWORD, IDQUYEN, EMAIL, SDT, HOTEN, DIACHI } = req.body;
  if (!isEmail(EMAIL)) {
    res.json({ status: 400 });
  } else if (!validatePhoneNumber(SDT)) {
    res.json({ status: 300 });
  } else {
    conn.query(
      `
        SELECT USERNAME FROM taikhoan WHERE USERNAME = ${conn.escape(
          USERNAME
        )}; 
        SELECT IDKH FROM khachhang WHERE SDT = ${conn.escape(
          SDT
        )} AND EMAIL = ${conn.escape(EMAIL)}`,
      function (err, result, fields) {
        if (err) throw err;
        var [[tt], [kh]] = result;
        if (!tt) {
          if (kh) {
            res.json({
              status: 501,
              msg: "Email, sdt đã dùng để đăng ký tài khoản khác",
            });
          } else {
            conn.query(
              `INSERT INTO taikhoan (USERNAME, PASSWORD, IDQUYEN) VALUES (${conn.escape(
                USERNAME
              )}, ${conn.escape(PASSWORD)}, ${conn.escape(IDQUYEN)})`,
              function (err, result) {
                if (err) throw err;
                var IDTK = result.insertId;
                var sql = `INSERT INTO khachhang (HOTEN, SDT, EMAIL, IDTK, DIACHI) VALUES (${conn.escape(
                  HOTEN
                )}, ${conn.escape(SDT)}, ${conn.escape(EMAIL)}, ${conn.escape(
                  IDTK
                )},  ${conn.escape(DIACHI)})`;
                conn.query(sql, function (err, result) {
                  if (err) throw err;
                  res.json({ status: 200, msg: "Đăng ký thành công" });
                });
              }
            );
          }
        } else {
          res.json({ status: 500, msg: "Tài khoản tồn tại" });
        }
      }
    );
  }
});

router.post("/signup", function (req, res, next) {
  var { EMAIL, PASSWORD, IDQUYEN } = req.body;
  var { HOTEN, GIOITINH, SDT, DIACHI, EMAIL, IDTK } = req.body;
  conn.query(
    `SELECT TOP(1) IDTK FROM taikhoan BY IDTK DESC`,
    function (err, result, fields) {
      if (err) throw err;
      var [tt] = result;
      if (!tt) {
        res.json({ status: 500 });
        return next(new ErrorResponse(500, `Wrong action`));
      } else {
        var sql = `INSERT INTO taikhoan (USERNAME,PASSWORD,IDQUYEN) VALUES (${conn.escape(
          USERNAME
        )}, ${conn.escape(PASSWORD)}, ${conn.escape(IDQUYEN)})`;
      }
      conn.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ status: 200 });
      });
    }
  );
});

router.put("/taikhoan/:id", function (req, res) {
  let id = req.params.id;
  var { PASSWORD } = req.body;
  conn.query(
    "UPDATE taikhoan SET PASSWORD=? WHERE IDTK=?",
    [PASSWORD, id],
    function (err, result) {
      if (err) throw err;
      res.json({ status: 200 });
    }
  );
});

router.delete("/taikhoan/:id", function (req, res) {
  let id = req.params.id;
  conn.query("DELETE FROM taikhoan WHERE IDTK=" + id, function (err, result) {
    if (err) throw err;
    res.json({ status: 200 });
  });
});

//Đăng nhập
router.post("/dangnhap", function (req, res, next) {
  let { EMAIL, PASSWORD } = req.body;
  conn.query(
    "SELECT EMAIL, PASSWORD, MANQ FROM khachhang WHERE EMAIL = ? AND PASSWORD = ?",
    [EMAIL, PASSWORD],
    function (err, result, fields) {
      if (err) throw err;
      if (result.length === 1) {
        res.json(result);
      } else {
        conn.query(
          "SELECT EMAIL, PASSWORD, MANQ FROM nhanvien WHERE EMAIL = ? AND PASSWORD = ?",
          [EMAIL, PASSWORD],
          function (errNext, resultNext, fieldsNext) {
            if (errNext) throw errNext;
            if (resultNext.length === 1) {
              res.json(resultNext);
            } else {
              return next(new ErrorResponse(404, `Wrong action`));
            }
          }
        );
      }
    }
  );
});

//lay thong tin
router.get("/dangnhap/:EMAIL", function (req, res, next) {
  let { EMAIL} = req.params;
  conn.query(
    "SELECT * FROM khachhang WHERE EMAIL = ?",
    [EMAIL],
    function (err, result, fields) {
      if (err) throw err;
      if (result.length === 1) {
        res.json(result);
      } else {
        conn.query(
          "SELECT * FROM nhanvien WHERE EMAIL = ?",
          [EMAIL],
          function (errNext, resultNext, fieldsNext) {
            if (errNext) throw errNext;
            if (resultNext.length === 1) {
              res.json(resultNext);
            } else {
              return next(new ErrorResponse(404, `Wrong action`));
            }
          }
        );
      }
    }
  );
});

router.post("/taikhoan-nhanvien", function (req, res, next) {
  let { HO, TEN, GIOITINH, NGAYSINH, SDT, EMAIL, DIACHI } = req.body;
  const PASSWORD = "123456";
  let MANV = "";
  const MANQ = "q2";
  if (!isEmail(EMAIL)) {
    return res.json({ status: 400, message:"Vui lòng nhập email hợp lệ!!(abc@gmail.com)" });
  } else if (!validatePhoneNumber(SDT)) {
    return res.json({ status: 300 , message: "Vui lòng nhập số điện thoại hợp lệ!! "});
  }
  conn.query(
    "select max(manv) as manv from nhanvien",
    function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        let temp = result[0].manv.substring(result[0].manv.length - 1);
        temp = parseInt(temp) + 1;
        MANV = "nv" + temp;
      } else {
        MANV = "nv1";
      }
      conn.query(
        `select nv.EMAIL from nhanvien nv
            left join khachhang kh on kh.EMAIL = nv.EMAIL 
             where nv.EMAIL = ?
         `,
        [EMAIL],
        function (errEmail, resultEmail, fieldsEmail) {
          if (errEmail) {
            console.log(errEmail);
          } 
          if (resultEmail.length > 0) {
            return res.json({status: 400, message: "Email đã tồn tại!!"})
          }
          conn.query(
            `insert into nhanvien(MANV, HO, TEN, GIOITINH, NGAYSINH, SDT, EMAIL, DIACHI, PASSWORD, MANQ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
              MANV,
              HO,
              TEN,
              GIOITINH,
              NGAYSINH,
              SDT,
              EMAIL,
              DIACHI,
              PASSWORD,
              MANQ,
            ],
            function (errCreate, resultCreate, fieldsCreate) {
              if (errCreate) {
                return next(new ErrorResponse(500, errCreate.sqlMessage));
              }
              return res.json({ status: 200, message: "Successfully!!" });
            }
          );
        }
      );
    }
  );
});

router.post("/taikhoan-khachhang", function (req, res, next) {
    let { HO, TEN, GIOITINH, NGAYSINH, SDT, EMAIL, DIACHI, PASSWORD } = req.body;   
    let MANV = "";
    const MANQ = "q1";
    if (!isEmail(EMAIL)) {
      return res.json({ status: 400, message:"Vui lòng nhập email hợp lệ!!(abc@gmail.com)" });
    } else if (!validatePhoneNumber(SDT)) {
      return res.json({ status: 300 , message: "Vui lòng nhập số điện thoại hợp lệ!! "});
    }
    conn.query(
      "select max(makh) as makh from khachhang",
      function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          let temp = result[0].manv.substring(result[0].manv.length - 1);
          temp = parseInt(temp) + 1;
          MANV = "kh" + temp;
        } else {
          MANV = "kh1";
        }
        conn.query(
          `select nv.EMAIL from nhanvien nv
              left join khachhang kh on kh.EMAIL = nv.EMAIL 
               where nv.EMAIL = ?
           `,
          [EMAIL],
          function (errEmail, resultEmail, fieldsEmail) {
            if (errEmail) {
              console.log(errEmail);
            } 
            if (resultEmail.length > 0) {
              return res.json({status: 400, message: "Email đã tồn tại!!"})
            }
            conn.query(
              `insert into khachhang(MANV, HO, TEN, GIOITINH, NGAYSINH, SDT, EMAIL, DIACHI, PASSWORD, MANQ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
              [
                MANV,
                HO,
                TEN,
                GIOITINH,
                NGAYSINH,
                SDT,
                EMAIL,
                DIACHI,
                PASSWORD,
                MANQ,
              ],
              function (errCreate, resultCreate, fieldsCreate) {
                if (errCreate) {
                  return next(new ErrorResponse(500, errCreate.sqlMessage));
                }
                return res.json({ status: 200, message: "Successfully!!" });
              }
            );
          }
        );
      }
    );
  });
  
module.exports = router;
