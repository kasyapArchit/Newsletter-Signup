const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.inputEmail;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us7.api.mailchimp.com/3.0/lists/5e3135b235";

    const options = {
        method: "POST",
        auth: "temp:9b1c0777e49902442c89f54d2ec036dc-us7"
    }

    const request = https.request(url, options, function (response) {
        
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    // console.log(firstName, lastName, email);
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is up and running on port 3000");
});

// API Key
// 9b1c0777e49902442c89f54d2ec036dc-us7

// List ID
// 5e3135b235

// Deployed website link :- https://still-brushlands-28139.herokuapp.com/