try {
  console.log("url before reload", location.href)
//  location.reload()
  location.replace(myOpenWeatherURL)
  console.log("url after reload", location.href)
} catch (e) {
  console.log("Javascript ERROR:", e.name + ': ' + e.message);
}
