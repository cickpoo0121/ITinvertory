// const productroute = require("express").Router();
const router = require("express").Router();
const mysql = require("mysql");
const config = require("../dbConfig");
const con = mysql.createConnection(config);




//show product of guset page
router.get("/guest", function (req, res) {
    const sql = "SELECT description,model,location,room,product_status,image FROM `product` WHERE product_status=1";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

//productstatus
router.get("/countstatus", function (req, res) {
     const sql = "SELECT (select COUNT(*) from product where product_status = 0) as missing,(select COUNT(*) from product where product_status = 1) as normal,(select COUNT(*) from product where product_status = 2) as repair,(select COUNT(*) from product where product_status = 3) as other";
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err);
        }
        else {
            res.json(result);
            // console.log(result[0].normal)
        }
    });
});

//show product of user home page
// router.get("/user", function (req, res) {
//     const sql = "SELECT description,model,location,room,product_status,image FROM `product` ";
//     con.query(sql, function (err, result, fields) {
//         if (err) {
//             // console.log(err)
//             res.status(500).send("Server error");
//             console.log(err)
//         }
//         else {
//             res.json(result);
//             console.log(err)
//         }
//     });
// });

//show import information
// router.get("/import/:years", function (req, res) {
//     const years = req.params.years;
//     const sql = "SELECT inventorynumber,asset,subnumber,description,model,serialnumber,location,room,receive_date,originalvalue,costcenter,department,vendername FROM `product` WHERE product_year=?";
//     con.query(sql, [years], function (err, result, fields) {
//         if (err) {
//             // console.log(err)
//             res.status(500).send("Server error");
//             console.log(err)
//         }
//         else {
//             res.json(result);
//             console.log(err)
//         }
//     });
// });

//show all status of product and who scan 
router.get("/status/:years", function (req, res) {
    const years = req.params.years;
    const sql = "SELECT image,image_status,inventorynumber,description,model,location,room,committee,product_status FROM `product` WHERE product_year=?";
    con.query(sql, [years], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

module.exports = router;
