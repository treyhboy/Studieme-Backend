const express = require("express");
var router = express.Router();
const createToken = require("../../Utils/Token.js");
// const passport = require("../../Config/Passport/Passport.js");
const request = require('request');
const ud = require("../../Config/db").ud;
const jwt = require("jsonwebtoken");

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
router.post("/api", function(req, res) {
    console.log("req data")
    var k = JSON.stringify(req.body.data);
    var L = JSON.stringify(req.body.Lidata)
    let g = req.body.Gre
    console.log("GREE")
    console.log(req.body)
    console.log(req.body.Gre)
    console.log("other")
    console.log(k + L)


    request.post({
            url: 'http://127.0.0.1:5000/data',
            body:{data: k + L,gre:g
            },
            json: true
        },
        function (error, response, body) {
            console.log(body);
            res.send({success:true,data:body})
        })
})
router.post("/api2", function(req, res) {
    // console.log("req data")
    // var k = JSON.stringify(req.body.subs);
    var k = req.body.subs
    // var L = JSON.stringify(req.body.college)
    var L = req.body.college
    // let g = req.body.Gre
    // console.log("GREE")
    // console.log(req.body)
    // console.log(req.body.Gre)
    // console.log("other")
    console.log(k)
    console.log(L)



    request.post({
            url: 'http://127.0.0.1:5000/college',
            body:{subs: k,college:L
            },
            json: true
        },
        function (error, response, body) {
            console.log(body);
            res.send(body)
        })
})
router.post("/verify", function(req, res) {
    var decoded = jwt.verify(req.body.token, 'mysecretkey');
    console.log(req.body)
    console.log(decoded.name)
    request.get(
        `https://api.linkedin.com/v1/people/~:(first-name,last-name,public-profile-url,location,headline,picture-url,positions,summary,num-connections,phonetic-first-name,industry,current-share,site-standard-profile-request,specialties,email-address)?format=json`,
        {   headers: {
            'Authorization': `Bearer ${decoded.sub}`
        }},
        function (error, response, body) {
            console.log(body);
                res.send({status:true,name:decoded.name,username:decoded.username,data:JSON.parse(body)})
        })
    // if(decoded)
    // {

    // }
    // else
    // {
    //     res.send({status:false})
    // }
})
router.post("/login", function(req, res) {
        request.post(
            `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.body.d}&redirect_uri=http://localhost:3000/linkedin&client_id=81k5i16hicsnq3&client_secret=GC3LNUuTqXoaqlHD`,
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
                        console.log(JSON.parse(body).firstName + " " + JSON.parse(body).lastName)
                        console.log(JSON.parse(body).emailAddress)
                        var email = JSON.parse(body).emailAddress;
                        var name = JSON.parse(body).firstName + " " + JSON.parse(body).lastName
                            ud
                            .findOne({ where: { username: email } })
                            .then(function(user) {
                                if (user) {
                                    ud.update({token:k.access_token},{where:{username:email}}).then(function () {
                                        // console.log(user.dataValues);
                                        res.send({status:true,message:"user exist",token:createToken({username:email,token:k.access_token,expire:k.expires_in},name),data:JSON.parse(body),name})
                                    })

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
                                            res.send({status:true,token:createToken(user,name),name:name,pictureUrl:body.pictureUrl,data:JSON.parse(body)});

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
