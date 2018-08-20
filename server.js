const express = require("express");
const app = express();
const fs = require("fs");
const bp = require("body-parser");
const db = require("./SQL/db.js");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
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
    //    console.log("inside checkForSigId", req.session);

    if (!req.session.signature) {
        console.log("redirection");
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
    //console.log(email, password);
    db.getUsers()
        .then(response => {
            console.log(response);
            //        let match = 0;
            response.rows.forEach(row => {
                if (email == row.email) {
                    console.log("checking password", row.email);
                    //            match = 1;
                    bcrypt
                        .checkPass(password, row.hashedpassword)
                        .then(doesMatch => {
                            if (doesMatch) {
                                console.log("right password");
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
            console.log(error);
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
                res.redirect("/petition");
            })
            .catch(function() {
                console.log("error handling");
                res.render("register", {
                    layout: "main",
                    error: true
                });
            });
    });
});

app.get("/petition", (req, res) => {
    res.render("sign", {
        layout: "main"
    });
});

app.get("/listOfPeople", (req, res) => {
    db.lookForNames().then(names => {
        res.render("signers", {
            layout: "main",
            signers: names.rows,
            count: names.rowCount
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
    db.saveSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(results => {
            req.session = {
                signature: results.rows[0].id
            };
            req.session.signature;
            //    console.log("session: ", req.session);
            res.redirect("/thanks");
            //console.log("working fine");
        })
        .catch(err => {
            console.log(err);
            res.render("sign", {
                layout: "main",
                error: true
            });
        });
});

app.listen(8080, () => "welcome to the petition");
