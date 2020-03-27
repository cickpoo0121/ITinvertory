//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const mysql = require("mysql");
const config = require("./dbConfig.js");
const multer = require("multer");
const passport = require("passport");
// const cookieSession = require("cookie-session");

//import auth
const authRoutes = require("./routes/auth-routes");

const product = require("./routes/productroute");
const datealert = require("./routes/datealertroute");

const app = express();
const con = mysql.createConnection(config);

const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: storageOption }).single("fileUpload");
// const upload1 = multer({ storage: storageOption }).array("addfileUpload");
 

//Middleware
app.use(body_parser.json());
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
app.use(express.static(path.join(__dirname, "public")));

app.use("/product",product);
app.use("/datealert",datealert);

// authen
app.use("/auth", authRoutes);



//===========================User================================//

//get years
app.get("/years", function (req, res) {
    const sql = "SELECT work_year FROM `workyear`";
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

//show committee in current year
app.get("/committee/:years", function (req, res) {
    const years = req.params.years
    const sql = "SELECT email FROM `workingyear` WHERE working_year=?";
    con.query(sql, [years], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(years)
        }
    });
});


///////////////////////////////////////////////////////////////////


//===========================Admin================================

//must be take photo แก้ติ๊กหลสยๆอัน 
app.put("/takephoto/:year", function (req, res) {
    const year = req.params.year;
    const records=req.body.records;
     
    // const invenNum = req.body.invenNum;
    const sql = "UPDATE `product` SET `image_status` = 4 WHERE product_year=? AND inventorynumber IN (?)"

    // connection.query('update UserRequests set RequestStatus = ?, ReqCompletedDateTime = ? where idRequest IN (?)', ['Completed', new Date(), idsArray.join()], function(err, rows){
    //     connection.release();
    //   });
    for(i=0;i<=records.length;i++){
    con.query(sql,[year,records[i].invenNum], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err);
        }
        else {
            res.json(result);
            console.log(records.length)
        }
        
    });
    }
});

//assign work to committee //working history page
app.post("/assign/committee", function (req, res) {
    date=new Date();
    const year = date.getFullYear();
    const email = req.body.email;
    const sql = "INSERT INTO workingyear (year,email) VALUES (?,?)"
    con.query(sql, [year, email], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});

//

//root
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/login.html"))
});

//signup
app.get("/guest", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/หน้าแรกผู้ใช้ทั่วไป.html"))
});

//login
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/login.html"))
});

//afterlogin
app.get("/Home2", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/Home2.html"))
});

//adminlogin
app.get("/admin", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/HomeAdmin.html"))
});

//printsheet
app.get("/print", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/printuser.html"))
});

//sheet
app.get("/sheet", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/usersheet.html"))
});

//history
app.get("/history", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/History.html"))
});

//sheet require
app.get("/require", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/printAdmin.html"))
});

//addsheet
app.get("/addsheet", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/addsheet.html"))
});


//<=========== Starting sever ==========>
const PORT = 8080
app.listen(PORT, function () {
    console.log("Sever is running at " + PORT);
});