import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//https://itnext.io/react-push-notifications-with-hooks-d293d36f4836
//instead of npm start run npx serve -s build

function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

async function askUserPermission() {
  return await Notification.requestPermission();
}

async function createNotificationSubscription() {
  console.log("1");
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  console.log("2");

  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BEZ5Leh_yCIZt2aEIccYtvbJ7WP1NZ5f4M2lHjyyErCWqHMtd4XOhJIt9YN2mZHkkpTJLkejBhDkY6OokEiZE4I",
  });
}

async function postSubscription(subscription) {
  console.log(subscription.endpoint);
  console.log(JSON.stringify(subscription));
  const response = await fetch(
    `/subscription`,
    // `http://localhost:8081/subscription`,
    // `https://push-notification-demo-server.herokuapp.com/subscription`,
    {
      credentials: "omit",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-mode": "cors",
      },
      body: JSON.stringify(subscription),
      method: "POST",
      mode: "cors",
    }
  );
  return await response.json();
}

if (isPushNotificationSupported()) {
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  serviceWorkerRegistration.register();
  // serviceWorkerRegistration.unregister();

  let status = await askUserPermission();

  console.log(status);

  let subscription = await createNotificationSubscription();
  console.log(subscription.endpoint);
  console.log(subscription);

  postSubscription(subscription);
} else {
  console.log("Push Notification not supported");
}

//https://www.knowledgehut.com/blog/web-development/build-progressive-web-app-with-react-js
// if (navigator.canShare && navigator.canShare({ files: filesArray })) {
//   navigator.share({
//   files: filesArray,
//   title: 'Codica Team Pictures',
//   text: 'Photos from March 18 to September 19.',
//   })
//   .then(() => console.log('Share was successful of the files.'))
//   .catch((error) => console.log('Sharing failed', error));
//   } else {
//   console.log(`Your system doesn't support sharing of the files.`);
//   }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
