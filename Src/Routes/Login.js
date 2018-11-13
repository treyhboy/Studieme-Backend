const express = require("express");
var router = express.Router();
const createToken = require("../../Utils/Token.js");
// const passport = require("../../Config/Passport/Passport.js");
const request = require('request');
const ud = require("../../Config/db").ud;
const jwt = require("jsonwebtoken");

// router.post("/signup", passport.authenticate("local-signup"), function(req, res) {
//   res.send({ token: createToken(req.user) });
// });
// router.post("/login", function(req, res) {
//     var token = res.token;
//   // res.send({ token: createToken(req.user) });
// });
router.post("/data", function(req, res) {
    var t = jwt.verify(req.token, 'mysecretkey');
    request.get(
        `https://api.linkedin.com/v1/people/~:(first-name,last-name,public-profile-url,location,headline,picture-url,positions,summary,num-connections,phonetic-first-name,industry,current-share,site-standard-profile-request,specialties,email-address)?format=json`,
        {   headers: {
            'Authorization': `Bearer ${t.sub}`
        }},
        function (error, response, body) {
                ud
                .findOne({ where: { username: email }})
                .then(function(user) {
                    if (user) {
                        res.send({status:true,firstName:body.firstName,lastName:body.lastName,pictureUrl:body.pictureUrl,data:body});
                    } else {
                        res.send({status:false,message:"fake call"});
                    }
                    })
                    .catch(function(err) {
                        throw err;
                    });

        }
    );
});
router.post("/verify", function(req, res) {
    var decoded = jwt.verify(req.body.token, 'mysecretkey');
    console.log(req.body)
    console.log(decoded)
    if(decoded)
    {
        res.send({status:true})
    }
    else
    {
        res.send({status:false})
    }
})
router.post("/login", function(req, res) {
        request.post(
            `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.body.d}&redirect_uri=http://localhost:3001/linkedin&client_id=81k5i16hicsnq3&client_secret=GC3LNUuTqXoaqlHD`,
            function (error, response, body) {
                console.log(JSON.parse(body).access_token)
                var k = JSON.parse(body);
                request.get(
                    `https://api.linkedin.com/v1/people/~:(first-name,last-name,public-profile-url,location,headline,picture-url,positions,summary,num-connections,phonetic-first-name,industry,current-share,site-standard-profile-request,specialties,email-address)?format=json`,
                    {   headers: {
                    'Authorization': `Bearer ${k.access_token}`
                    }},
                    function (error, response, body) {
                        console.log(k.access_token)
                        console.log(k.expires_in)
                        console.log(JSON.parse(body).emailAddress)
                        var email = JSON.parse(body).emailAddress;
                            ud
                            .findOne({ where: { username: email } })
                            .then(function(user) {
                                if (user) {
                                    res.send({status:false,message:"user exist",token:createToken(user)})
                                } else {
                                    ud
                                        .create({
                                            username: email,
                                            token: k.access_token,
                                            expire:k.expires_in
                                        })
                                        .then(function(user) {
                                            console.log("user.dataValues->");
                                            console.log(user.dataValues);
                                            // var t ={ token:createToken(user)}
                                            // var decoded = jwt.verify(t.token, 'mysecretkey');
                                            // console.log(decoded);
                                            res.send({status:true,token:createToken(user),firstName:body.firstName,lastName:body.lastName,pictureUrl:body.pictureUrl,data:body});

                                        })
                                        .catch(function(err) {
                                            throw err;
                                        });
                                }
                            })

                    }
                );
            }
        );
        console.log(req.body);
});

module.exports = router;
