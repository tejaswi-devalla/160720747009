const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.listen(8008, () => {
  console.log("App Running at http://localhost:8008/");
});

app.get("/numbers/", async (request, response) => {
  const getQuery = request.query.url;
  console.log(getQuery);
  const urlArray = Array.isArray(getQuery) ? getQuery : [getQuery];
  const promises = urlArray.map((eachUrl) => {
    console.log(eachUrl);
    return axios
      .get(eachUrl, { timeout: 500 })
      .then((reData) => {
        return reData.data.numbers;
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        return [];
      });
  });

  Promise.all(promises)
    .then((getData) => {
      const concatenatedData = getData.reduce((acc, array) =>
        acc.concat(array)
      );
      const uniqueData = [...new Set(concatenatedData)].sort((a, b) => a - b);
      console.log(uniqueData);
      response.json(uniqueData);
    })
    .catch((error) => {
      console.log(`Error in Promise.all: ${error}`);
      response.status(500).send("Error fetching data from the target URLs.");
    });
});

module.exports = app;
