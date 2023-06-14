const express = require("express");
const subscriptions = {};
var crypto = require("crypto");
const webpush = require("web-push");
const cors = require("cors");
const path = require("path");

//kör insomnia post till localhost:8081/subscription/[id] (id ex: 908945dcadc1550810e5b8fac4d2569a) för att testa pusha ut notiser
//kör npx serve -s build på frontend
//surfa till localhost:3000, IP:3000 verkar inte funka
//make sure powersaver is not turned on windows 11 client

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.post("/login", (req, res) => {
  res.status(200).send(req.body.email + " " + req.body.password);
});

app.post("/subscription", (req, res) => {
  handlePushNotificationSubscription(req, res);
  //   res.send("Hello World!!!!");
  //   res.status(200).send([32, "hej", { a: 3 }]);
});

app.get("/subscription/all", (req, res) => {
  sendPushNotificationToAll(req, res);
  //   res.send("Hello World!!!!");
  //   res.status(200).send([32, "hej", { a: 3 }]);
});

app.get("/subscription/:id", (req, res) => {
  sendPushNotification(req, res);
  //   res.send("Hello World!!!!");
  //   res.status(200).send([32, "hej", { a: 3 }]);
});

// app.post("/notifyUser", (req, res) => {
//   sendPushNotification(req, res);
// });

//skapade med npx web-push generate-vapid-keys --json
let vapidKeys = {
  publicKey:
    "BEZ5Leh_yCIZt2aEIccYtvbJ7WP1NZ5f4M2lHjyyErCWqHMtd4XOhJIt9YN2mZHkkpTJLkejBhDkY6OokEiZE4I",
  privateKey: "lv6OvnrRR_ViTRBD2vdhNQa9lpj-zcvi5HTh9JTtB2I",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

function handlePushNotificationSubscription(req, res) {
  const subscriptionRequest = req.body;
  console.log(subscriptionRequest);
  const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
  subscriptions[susbscriptionId] = subscriptionRequest;
  console.log(subscriptions);
  res.status(201).json({ id: susbscriptionId });
}

function sendPushNotification(req, res) {
  const subscriptionId = req.params.id;
  const pushSubscription = subscriptions[subscriptionId];
  console.log(pushSubscription);
  console.log(subscriptions);

  console.log(
    "Pushing notification to one of: " +
      req.params.id +
      " " +
      subscriptions +
      ". Message: " +
      req.body.title +
      req.body.text +
      req.body.image +
      req.body.tag +
      req.body.url
  );

  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        title: req.body.title ? req.body.title : "New Product Available ",
        text: req.body.text
          ? req.body.text
          : "HEY! Take a look at this brand new t-shirt!",
        image: req.body.image
          ? req.body.image
          : "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
        tag: req.body.tag ? req.body.tag : "new-product",
        url: req.body.url
          ? req.body.url
          : "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html",
      })
    )
    .catch((err) => {
      console.log(err);
    });

  res.status(202).json({});
}

function sendPushNotificationToAll(req, res) {
  // const subscriptionId = req.params.id;
  // const pushSubscription = subscriptions[subscriptionId];
  // console.log(pushSubscription);
  console.log(
    "Pushing notification to all: " +
      subscriptions +
      ". Message: " +
      req.body.title +
      req.body.text +
      req.body.image +
      req.body.tag +
      req.body.url
  );

  console.log("Array: " + Object.values(subscriptions));

  Object.values(subscriptions).forEach((pushSubscription) => {
    webpush
      .sendNotification(
        pushSubscription,
        JSON.stringify({
          title: req.body.title ? req.body.title : "New Product Available ",
          text: req.body.text
            ? req.body.text
            : "HEY! Take a look at this brand new t-shirt!",
          image: req.body.image
            ? req.body.image
            : "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
          tag: req.body.tag ? req.body.tag : "new-product",
          url: req.body.url
            ? req.body.url
            : "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html",
        })
      )
      .catch((err) => {
        console.log("Err: " + err);
      });
  });
  res.status(202).json({});
}

app.use(express.static(path.join(path.resolve(), "../public")));

const port = process.env.PORT || 8081;

app.listen({ port }, () => {
  console.log("lyssnar på port " + port);
});
