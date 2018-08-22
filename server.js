const express = require("express");
const app = express();
const fs = require("fs");
const bp = require("body-parser");
const db = require("./SQL/db.js");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
//const { hashPass, checkPass } = require("./public/hashing");
// POSTGRES
// HANDLEBARS //
app.use(
    cookieSession({
        secret: `Döner Kebab`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use(
    bp.urlencoded({
        extended: false
    })
);

function checkForSigId(req, res, next) {
    if (!req.session.signature) {
        res.redirect("/petition");
    } else {
        next();
    }
}
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", (req, res) => {
    let { email, password } = req.body;
    db.getUsers()
        .then(response => {
            response.rows.forEach(row => {
                if (email == row.email) {
                    bcrypt
                        .checkPass(password, row.hashedpassword)
                        .then(doesMatch => {
                            if (doesMatch) {
                                req.session.user = {
                                    firstname: row.firstname,
                                    lastname: row.lastname,
                                    userId: row.id
                                };
                                res.redirect("/petition");
                            }
                        });
                }
            });
        })
        .catch(error => {
            res.render("login", {
                layout: "main"
            });
        });
});
app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});
app.post("/register", (req, res) => {
    let { firstname, lastname, email, password } = req.body;
    bcrypt.hashPass(password).then(function(hashedpassword) {
        db.saveUser(firstname, lastname, email, hashedpassword)
            .then(function(response) {
                req.session.user = {
                    firstname,
                    lastname,
                    userId: response.rows[0].id
                };
                res.redirect("/profile");
            })
            .catch(function(error) {
                console.log("error", error);
                res.render("register", {
                    layout: "main",
                    error: true
                });
            });
    });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    db.saveProfile(
        req.session.user.userId,
        req.body.city,
        req.body.age,
        req.body.homepage
    )
        .then(results => {
            res.redirect("/petition");
        })
        .catch(error => {
            console.log("error on profile post", error);
            res.render("sign", {
                layout: "main",
                error: true
            });
        });
});
app.get("/petition", (req, res) => {
    res.render("sign", {
        layout: "main"
    });
});

app.get("/listOfPeople", (req, res) => {
    db.lookForNames()
        .then(names => {
            res.render("signers", {
                layout: "main",
                signers: names.rows,
                count: names.rowCount,
                city: names.city,
                homepage: names.homepage
            });
        })
        .catch(err => {
            console.log(err);
            res.render("sign", {
                layout: "main",
                error: true
            });
        });
});
app.get("/signers/:city", (req, res) => {
    // console.log("HERE HEre:  ", req.params.city);
    var nameOftheCity = req.params.city;
    db.lookForCity(nameOftheCity).then(names => {
        res.render("signers", {
            layout: "main",
            signers: names.rows,
            count: names.rowCount,
            age: names.age,
            city: names.city,
            homepage: names.homepage
        });
    });
});

app.get("/thanks", checkForSigId, (req, res) => {
    const checkId = req.session.signature;
    db.getSignatureById(checkId).then(results => {
        res.render("thanks", {
            layout: "main",
            signature: results.rows[0].signature
        });
    });
});

app.post("/petition", (req, res) => {
    db.saveSignature(req.session.user.userId, req.body.signature)
        .then(results => {
            req.session.signature = results.rows[0].id;

            res.redirect("/thanks");
        })
        .catch(err => {
            console.log("error here");
            res.render("sign", {
                layout: "main",
                error: true
            });
        });
});

app.get("/editprofile", (req, res) => {
    var userId = req.session.user.userId;
    db.editProfile(userId)
        .then(result => {
            res.render("profile_edit", {
                layout: "main",
                firstname: result.rows[0].firstname,
                lastname: result.rows[0].lastname,
                email: result.rows[0].email,
                // password: result.rows[0].password,
                age: result.rows[0].age,
                city: result.rows[0].city,
                homepage: result.rows[0].homepage
            });
        })
        .catch(err => {
            res.render("profile_edit", {
                layout: "main",
                error: true
            });
        });
});

app.post("/editprofile", (req, res) => {
    if (req.body.password != "") {
        bcrypt.hashPass(req.body.password).then(hashed => {
            db.updateUserTable(
                req.session.user.userId,
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                hashed
            ).catch(err => {
                console.log("This error is in the editprofile", err);
                res.render("profile_edit", {
                    layout: "main",
                    error: true
                });
            });
        });
    } else {
        //        console.log("Test 1111");
        db.updateUserTableWithoutPassword(
            req.session.user.userId,
            req.body.firstname,
            req.body.lastname,
            req.body.email
        ).catch(err => {
            console.log(
                "this error occured in updateUserTableWithoutPassword",
                err
            );
            res.render("profile_edit", {
                layout: "main",
                error: true
            });
        });
    }
    db.updateProfileTable(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.user.userId
    )
        .then(result => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.render("profile_edit", {
                layout: "main",
                error: true
            });
        });
});
app.listen(8080, () => "welcome to the petition");
