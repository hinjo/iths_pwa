//https://www.knowledgehut.com/blog/web-development/build-progressive-web-app-with-react-js

if (navigator.share) {
  let url = document.location.href;
  const canonicalElement = document.querySelector("link[rel=canonical]");
  if (canonicalElement !== null) {
    url = canonicalElement.href;
  }
  navigator
    .share({
      title: "Codica",
      text: "Codica",
      url,
    })
    .then(() => console.log("Successful sharing the content"))
    .catch((error) => console.log("Error sharing", error));
}
