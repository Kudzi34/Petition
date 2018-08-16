const express = require("express");
const app = express();
const fs = require("fs");
const bp = require("body-parser");
const db = require("./SQL/db.js");
const cookieSession = require("cookie-session");

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
    console.log("inside checkForSigId", req.session);

    if (!req.session.signature) {
        res.redirect("/");
    } else {
        next();
    }
}

app.get("/petition", (req, res) => {
    res.render("sign", {
        layout: "main"
    });
});

app.get("/thanks", checkForSigId, (req, res) => {
    const checkForSigId = req.session.signature;
    db.getSignatureById(checkForSigId).then(results => {
        res.render("thanks", {
            layout: "main",
            signature: results.rows[0].signature
        });
    });
});
/*app.get("/thanks", checkForSign, (req, res) => {
    const signID = req.session.signID;
    db.getSignatureById(signID).then(results => {
        res.render("thanks", {
            layout: "main",
            signature: results.rows[0].signature
        });
    });
});*/

app.post("/petition", (req, res) => {
    //console.log("working", req.body);
    db.saveSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(results => {
            req.session = {
                checkForSigId: results.rows[0].id
            };
            req.session.signature;
            console.log("session: ", req.session);
            res.redirect("/thanks");
            console.log("working fine");
        })
        .catch(err => {
            console.log(err);
            res.render("sign", {
                layout: "main",
                error: true
            });
        });
});

/*app.post("/petition", (req, res) => {
    db.saveSignature(req.body.first, req.body.last, req.body.sign)
        .then(results => {
            req.session = {
                signID: results.rows[0].id
            };
            req.session.signID;
            console.log("session: ", req.session);
            res.redirect("/thanks");
            // req.session = null;
            // console.log("session: ", req.session);
        })
        .catch(err => {
            console.log(err);
            res.render("sign", {
                layout: "main",
                error: true
            });
        });
});*/

app.listen(8080, () => "welcome to the petition");
