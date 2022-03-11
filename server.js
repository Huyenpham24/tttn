var express = require('express');
const cors = require('cors');

var sanpham = require('./routes/sanpham');
var theloai = require('./routes/theloai');
var taikhoan = require('./routes/taikhoan');
// var nhaxuatban = require('./routes/nhaxuatban');
// // var trangthai = require('./routes/trangthai');
// var phieunhap = require('./routes/phieunhap');
// var ctpn = require('./routes/ctphieunhap');
// var khachhang = require('./routes/khachhang');
// var nhanvien = require('./routes/nhanvien');
var quyen = require('./routes/quyen');
// var donhang = require('./routes/donhang');
// var ctdh = require('./routes/ctdonhang');
// var giohang = require('./routes/giohang');

// var connection = require('./Dbconnection');

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', sanpham);
app.use('/', theloai);
console.log(1);
app.use('/', taikhoan);
// app.use('/', nhaxuatban);
// // app.use('/', trangthai);
// app.use('/', phieunhap);
// app.use('/', ctpn);
// app.use('/', khachhang);
// app.use('/', nhanvien);
app.use('/', quyen);
// app.use('/', donhang);
// app.use('/', ctdh);
// app.use('/', giohang);

var server = app.listen(2000, function () {
    console.log('Server listening on port ' + server.address().port);
});
module.exports = app;