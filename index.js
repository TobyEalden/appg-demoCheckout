(function() {
  var express = require("express");
  var app = express();
  var path = require("path");
  var restClient = require("node-rest-client").Client;
  var appgAPIClient = new restClient();
  var apiURLBase = "http://192.168.1.81:5000/appg/api";

  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname,'/views'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname,'/static')));
  app.use(express.logger());

  app.get("/", function(req,res) {
    res.render("home");
  });

  app.get("/about", function(req,res) {
    res.render("about");
  });

  app.get("/notify", function(req, res) {
    res.render("notify",{action: "notify"});
  });

  app.post("/notify", function(req, res) {
    var args = {
      data: req.body,
      headers: { "Content-Type": "application/json" }
    };

    appgAPIClient.post(apiURLBase + "/notify", args, function(data,response) {
      if (data.hasOwnProperty("ok") && data.ok === true) {
        res.redirect("/notify");
      } else {
        res.render("notify",{action: "notify"});
      }
    });
  });

  app.get("/request", function(req, res) {
    res.render("notify",{action: "request"});
  });

  app.post("/request", function(req, res) {
    var args = {
      data: req.body,
      headers: { "Content-Type": "application/json" }
    };

    appgAPIClient.post(apiURLBase + "/request", args, function(data,response) {
      if (data.hasOwnProperty("ok") && data.ok === true) {
        res.redirect("/request");
      } else {
        res.render("notify",{action: "request"});
      }
    });
  });

  // Dummy authorisation callback...
  app.get("/confirm/:status/:id", function(req,res) {
    var confirmed = req.params.status === "confirm";
    var transactionId = req.params.id;
    res.json({ok: confirmed});
  });

  app.listen(5001);

}())