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



//Passrord encryption
// app.get("/password/:pass", function (req, res) {
//     const pass = req.params.pass;
//     const salt = 10;

//     bcrypt.hash(pass, salt, function (err, hash) {
//         if (err) {
//             res.status(500).send("Hasshing failed");
//         }
//         else {
//             // console.log(hash.length)
//             res.send(hash);
//         }
//     });
// });


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
    const sql = "SELECT inventorynumber,asset,subnumber,description,model,serialnumber,location,room,receive_date,originalvalue,costcenter,department,vendername FROM `product`";
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
    const sql = "SELECT image,image_status,inventorynumber,description,model,location,room,committee,product_status FROM `product`";
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



















app.post("/uploadsheet", function (req, res) {
    upload(req, res, function (err, result) {
        if (err) {
            res.status(500).send("Upload failed");
            return;
        }
        else {
            res.json(req.file.filename)
            console.log(req.file.filename)
        }
    })
});


app.post("/uploadsheet1", function (req, res) {
    // const username = req.body.username;
    // const password = req.body.password;
    const dt = new Date();
    const { SU_FILE, SU_COPIES, SU_RANGE, SU_PAPERTPE, SU_COLOR, SU_ORIENTATION, SU_DUPLEXPRINTING, SU_STATUS, U_ID } = req.body;
    const sql = "INSERT INTO sheetupload (SU_FILE, SU_COPIES, SU_RANGE, SU_PAPERTPE, SU_COLOR, SU_ORIENTATION, SU_DUPLEXPRINTING, SU_DATETIME, SU_STATUS, U_ID) VALUES (?,?,?,?,?,?,?,?,0,2)"
    con.query(sql, [SU_FILE, SU_COPIES, SU_RANGE, SU_PAPERTPE, SU_COLOR, SU_ORIENTATION, SU_DUPLEXPRINTING, dt, SU_STATUS, U_ID], function (err, result, fields) {
        if (err) {
            res.status(503).send("DB error")
            console.log(err)
        }
        else {
            const rows = result.affectedRows;
            if (rows != 1) {
                res.status(503).send("Insertion error");
            }
            else {
                res.send("/history")
            }
        }
    });

    // });

});

//show all sheet of admin upload
app.get("/userselect", function (req, res) {
    const sql = "SELECT AS_ID, AS_IMGCOVER,AS_DESC,AS_PAGE,AS_PRICE FROM addsheet WHERE AS_STATUS=0";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(err)
        }
    });
});

//Gethistory
app.get("/usertask/:U_ID", function (req, res) {
    const U_ID = req.params.U_ID;

    const sql = "SELECT su.SU_ID, su.SU_FILE,su.SU_DATETIME,su.SU_STATUS FROM mycopy.sheetupload su, mycopy.user usr WHERE su.U_ID=usr.U_ID and usr.U_ID=? ";
    con.query(sql, [U_ID], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(U_ID)
        }
    });
});

//cancel
app.put("/cancel/:id", function (req, res) {
    const id = req.params.id
    const sql = "UPDATE sheetupload SET SU_STATUS=3 where SU_ID=?"
    con.query(sql, [id], function (err, result, fields) {

        if (err) {
            res.status(503).send("DB error")
        }
        else {
            res.send("Cancel success")
            // console.log("upload done");
        }
    })
});

///////////////////////////////////////////////////////////////////


//===========================Admin================================//

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

//user status //working history page
// app.put("/userStatus/:id", function(req, res){
//     const id = req.params.id;
//     const status = req.params.status;
//     const sql = "UPDATE user SET status=? WHERE id=?"
//     con.query(sql, function (err, result, fields) {
//         if (err) {
//             res.status(500).send("Server error");
//         }
//         else {
//             res.json(result);
//         }
//     });
// });

//assign work to committee //working history page
app.post("/assign/committee", function (req, res) {
    const year = new Date();
    const email = req.params.email;
    const sql = "INSERT INTO workyear (year,email) VALUES (year,?)"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});

//----


//Get sheet request
app.get("/request", function (req, res) {
    // const U_ID = req.params.U_ID;
    const sql = "SELECT su.SU_FILE,usr.U_NAME,usr.U_PHONE,usr.U_EMAIL,su.SU_DATETIME,su.SU_STATUS FROM mycopy.sheetupload su,mycopy.user usr WHERE su.U_ID=usr.U_ID";
    con.query(sql, function (err, result, fields) {
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

//file infor before download
app.get("/downloadsheet/:id", function (req, res) {
    const id = req.params.id
    const sql = "SELECT SU_FILE,SU_COPIES,SU_RANGE,SU_PAPERTPE,SU_COLOR,SU_ORIENTATION,SU_DUPLEXPRINTING,SU_DATETIME FROM sheetupload WHERE SU_ID=? "
    con.query(sql, [id], function (err, result, fields) {

        if (err) {
            // console.log("upload failed");
            res.status(500).send("Download failed")
        }
        else {
            res.json(result)
            // console.log("upload done");
        }
    });
});

//Download
app.put("/download/:id", function (req, res) {
    const id = req.params.id
    const sql = "UPDATE sheetupload SET SU_STATUS=1 where SU_ID=?"
    con.query(sql, [id], function (err, result, fields) {

        if (err) {
            // console.log("upload failed");
            res.status(500).send("Download failed")
        }
        else {
            res.send("Update success")
            // console.log("upload done");
        }
    });
});

//Confirm
app.put("/confirm/:id", function (req, res) {
    const id = req.params.id
    const sql = "UPDATE sheetupload SET SU_STATUS=2 where SU_ID=?"
    con.query(sql, [id], function (err, result, fields) {

        if (err) {
            // console.log("upload failed");
            res.status(500).send("Download failed")
        }
        else {
            res.send("success")
            // console.log("upload done");
        }
    });
});

//show all sheet of admin upload ===Rename+++ where 
app.get("/userselect", function (req, res) {
    const sql = "SELECT AS_IMGCOVER,AS_DESC,AS_PAGE,AS_PRICE FROM addsheet";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

app.post("/addsheet1", function (req, res) {
    upload1(req, res, function (err, result) {
        if (err) {
            res.status(500).send("Upload failed");
            return;
        }
        else {
            res.json(req.files)
            console.log(req.files[0].filename)
        }
    })
});

//add sheet
app.post("/addsheet", function (req, res) {
    const dt = new Date();
    const { AS_FILE, AS_IMGCOVER, AS_IMGVIEW1, AS_IMGVIEW2, AS_DESC, AS_PRICE, AS_PAGE, AS_STATUS, S_ID } = req.body;
    const sql = "INSERT INTO addsheet (AS_FILE, AS_IMGCOVER, AS_IMGVIEW1 ,AS_IMGVIEW2, AS_DESC,AS_PRICE, AS_PAGE,AS_STATUS, AS_DATETIME, S_ID) VALUES (?,?,?,?,?,?,?,0,?,2)"
    con.query(sql, [AS_FILE, AS_IMGCOVER, AS_IMGVIEW1, AS_IMGVIEW2, AS_DESC, AS_PRICE, AS_PAGE, AS_STATUS, dt, S_ID], function (err, result, fields) {

        if (err) {
            // console.log("upload failed");
            res.status(500).send("Upload failed")
            console.log(err)
        }
        else {
            res.send("Upload done");
            // console.log(err);
        }
    })

});

//Edit
app.put("/edit/:id", function (req, res) {
    const id = req.params.id;
    const { AS_FILE, AS_IMGCOVER, AS_IMGVIEW1, AS_IMGVIEW2, AS_DESC, AS_PRICE, AS_PAGE, AS_DATETIME, S_ID } = req.body;

    const sql = "UPDATE addsheet SET AS_FILE=?, AS_IMGCOVER=?, AS_IMGVIEW1=?, AS_IMGVIEW2=?, AS_DESC=?, AS_PRICE=?, AS_PAGE=?, AS_DATETIME=?, S_ID=? WHERE AS_ID=? "

    con.query(sql, [AS_FILE, AS_IMGCOVER, AS_IMGVIEW1, AS_IMGVIEW2, AS_DESC, AS_PRICE, AS_PAGE, AS_DATETIME, S_ID, id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB error")
        }
        else {
            res.send("Edit done")
            // console.log(id);
        }
    })
});

//On/OFF
app.put("/toggle/:id", function (req, res) {
    var id = req.params.id
    upload(req, res, function (err) {
        if (err) {
            // console.log("upload failed");
            res.status(500).send("Upload failed")
        }
        else {
            const sql = "UPDATE addsheet SET AS_STATUS=1 where AS_ID=?"
            con.query(sql, [id], function (err, result) {

                res.send("Update success")
                // console.log(id);
            })
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

// Get User Name
// app.get("/Name",function(req, res){
//     // const username = req.params.username;
//     const username=req.body.username
//     const sql = "SELECT U_NAME FROM user where U_USERNAME=?";
//     con.query(sql,[username], function (err, result, fields) {
//         if (err) {
//             // console.log(err)
//             res.status(500).send("Server error");
//         }
//         else {
//             res.json(result);
//         }
//     });
// });


//Sign up

app.post("/signUp", function (req, res) {
    // const username = req.body.username;
    // const password = req.body.password;
    const { U_USERNAME, U_PASSWORD, U_NAME, U_PHONE, U_EMAIL, U_ROLE, S_ID } = req.body;

    //hash password
    bcrypt.hash(U_PASSWORD, 10, function (err, hash) {
        if (err) {
            res.status(500).send("Hasshing failed");
            console.log(err)
        }
        else {
            const sql = "INSERT INTO user (U_USERNAME,U_PASSWORD,U_NAME,U_PHONE,U_EMAIL,U_ROLE,S_ID) VALUES (?,?,?,?,?,2,?)"
            // const sql = "INSERT INTO user (U_USERNAME,U_PASSWORD,U_ROLE,S_ID) VALUES (?,?,1,1)"
            con.query(sql, [U_USERNAME, hash, U_NAME, U_PHONE, U_EMAIL, U_ROLE, S_ID], function (err, result, fields) {
                if (err) {
                    res.status(503).send("DB error")
                    console.log(err)
                }
                else {
                    const rows = result.affectedRows;
                    if (rows != 1) {
                        res.status(503).send("Insertion error");
                    }
                    else {
                        res.send("/home2")
                    }
                }
            });
        }
    });

});

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