//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const config = require("./dbConfig.js");
const multer = require("multer");

const app = express();
const con = mysql.createConnection(config);
var name = "";

const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: storageOption }).single("fileUpload");
const upload1 = multer({ storage: storageOption }).array("addfileUpload");

//Middleware
app.use(body_parser.urlencoded({ extended: true })); //when you post service
app.use(body_parser.json());
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
app.use(express.static(path.join(__dirname, "public")));



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

//date alert
app.get("/datealert", function (req, res) {
    const sql = "SELECT * FROM `datealert`";
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

//show product of guset page
app.get("/product/guest", function (req, res) {
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
app.get("/status/product", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT product_status FROM `product`";
    con.query(sql, [id], function (err, result, fields) {
        if (err) {
            console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

//show product of user home page
app.get("/product/user", function (req, res) {
    const sql = "SELECT description,model,location,room,product_status,image FROM `product` ";
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

//show import information
app.get("/product/import/:years", function (req, res) {
    const years = req.params.years;
    const sql = "SELECT inventorynumber,asset,subnumber,description,model,serialnumber,location,room,receive_date,originalvalue,costcenter,department,vendername FROM `product` WHERE product_year=?";
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

//show all status of product and who scan 
app.get("/product/status/:years", function (req, res) {
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

//show committee in current year
app.get("/committee/:years", function (req, res) {
    const years = req.params.years
    const sql = "SELECT email FROM `workyear` WHERE work_year=?";
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


//===========================Admin================================//

//set datealert
app.post("/datealert", function (req, res) {
    const year = new Date();
    const datestart = req.body.datestart;
    const dateend = req.body.dateend;
    const sql = "INSERT INTO workyear (year_alert,date_start,date_end) VALUES (?,?,?)"
    con.query(sql, [year, datestart, dateend], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});

//update datealert
app.put("/datealert/update", function (req, res) {
    // const year = new Date()
    const datestart = req.body.datestart;
    const dateend = req.body.dateend;
    const sql = "UPDATE `datealert` SET `date_start` = ?,date_end=? WHERE `year_alert` = 1"
    con.query(sql, [year, datestart, dateend, id], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});

//must be take photo
app.put("/takephoto/:year", function (req, res) {
    const year = req.params.id;
    con.query( function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            const invenNum=req.params.invenNum
            const sql = "UPDATE `product` SET `image_status` = 1 WHERE roduct_year=? AND inventorynumber=?"
            c0n.query(sql, [year,invenNum], function (err, result) {
                res.send("Update success")
                // console.log(id);
            })
            res.json(result);
        }
    });
});



//working history page
app.get("/workingHistory", function (req, res) {
    const sql = "SELECT name,year FROM user"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});


//assign work to committee //working history page
app.post("/assign/committee", function (req, res) {
    const year = new Date();
    const email = req.body.email;
    const sql = "INSERT INTO workyear (year,email) VALUES (?,?)"
    con.query(sql, [year, email], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});



//Login
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password; // raw password
    // console.log(username+password)
    const sql = "SELECT * FROM user WHERE U_USERNAME=?";
    con.query(sql, [username], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            const rows = result.length;
            if (rows != 1) {
                res.status(401).send("No user");
                // console.log(username)
            }
            else {
                // user exitst, check password 
                // console.log(result[0].U_PASSWORD);
                bcrypt.compare(password, result[0].U_PASSWORD, function (err, resp) {
                    console.log(result[0].U_ROLE)

                    if (err) {
                        res.status(503).send("Authen server error")
                    }
                    else if (resp == true) {
                        //login correct
                        //admin or user?
                        if (result[0].U_ROLE == 1) {
                            //console.log("pas")
                            res.send("/admin");
                        }
                        else {
                            res.send("/home2");
                        }
                    }
                    else {
                        //wrong password
                        res.status(403).send("Wrong password");
                    }
                })
            }
        }
    })
})


//

//root
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/Home1.html"))
});

//signup
app.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/signup.html"))
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