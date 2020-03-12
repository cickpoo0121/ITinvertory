const router = require("express").Router();
const mysql = require("mysql");
const config = require("../dbConfig");
const con = mysql.createConnection(config);


//set datealert
router.post("/insert", function (req, res) {
    date=new Date();
    const year = date.getFullYear();
    const datestart = req.body.datestart;
    const dateend = req.body.dateend;
    const sql = "INSERT INTO datealert (year_alert,date_start,date_end) VALUES (?,?,?)"
    con.query(sql, [year, datestart, dateend], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            resjson(result);
            console.log()
        }
    });
});

//update datealert
router.put("/update/:year", function (req, res) {
    const year = req.params.year;
    const datestart = req.body.datestart;
    const dateend = req.body.dateend;
    const sql = "UPDATE `datealert` SET `date_start` = ?,`date_end` = ? WHERE `datealert`.`year_alert` = ?"
    con.query(sql, [ datestart, dateend, year], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            console.log(year, datestart, dateend)
        }
    });
});

//date alert
router.get("/", function (req, res) {
    const sql = "SELECT * FROM `datealert`";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(result)
        }
    });
});

module.exports=router;