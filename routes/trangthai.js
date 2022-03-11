var express = require('express');
var router = express.Router();
const ErrorResponse = require('../Models/ErrorResponse');
const { response, route } = require('../server');

let conn = require('../Dbconnection.js');

//trangthai
router.get('/trangthai', function (req, res) {
    conn.query("SELECT * FROM trangthai", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/trangthai/:id', function(req, res, next) {
    let id = req.params.id;
    if(id) {
        conn.query("SELECT * FROM trangthai WHERE IDTRANGTHAI=" + id, function(err, result) {
            if(err) throw err;
            res.json(result);
        });
    }
});

router.put('/ttdonhang/:id', function(req,res) {
    let id = req.params.id;
    var {IDTRANGTHAI} = req.body;
    conn.query(`SELECT IDDH FROM donhang WHERE (IDTRANGTHAI=4 OR IDTRANGTHAI=1) AND IDDH=${id}`, function(err, result) {
        if (err) throw err;
        console.log(result)
        if(result == "") {
            conn.query('UPDATE donhang SET IDTRANGTHAI=? WHERE IDDH=?', 
                [IDTRANGTHAI, id], function(err,result) {
                    if (err) throw err;
                    console.log("Updated");
                    res.json({status: 200})

                });
        }
        else {
            res.json({status: 400});
        }
    })
});


module.exports = router;