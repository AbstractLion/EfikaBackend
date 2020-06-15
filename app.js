require("dotenv").config();
const express = require("express");
const app = express();
const fetch = require("node-fetch");

const port = process.env.PORT;
const apiKey = process.env.API_KEY;

const containers = {
  shoppingCart: {
    weightMax: 400,
    name: "ShoppingCart",
    dimensions: {
      x: 30,
      y: 40,
      z: 51,
    },
  },
  carryingBasket: {
    weightMax: 150,
    name: "CarryingBasket",
    dimensions: {
      x: 18,
      y: 48,
      z: 35,
    },
  },
};

const payload = {
  key: apiKey,
  itemSets: [
    {
      refId: 0,
      dimensions: { x: 21, y: 22, z: 41 },
      quantity: 2,
    },
    {
      refId: 1,
      dimensions: { x: 11, y: 12, z: 5 },
      quantity: 56,
    },
    {
      refId: 2,
      dimensions: { x: 2, y: 4, z: 2 },
      quantity: 72,
    },
    {
      refId: 3,
      dimensions: { x: 1, y: 1, z: 2 },
      quantity: 33,
    },
    {
      refId: 4,
      dimensions: { x: 1, y: 4, z: 2 },
      quantity: 44,
    },
  ],
  boxTypes: [
    containers.shoppingCart,
    containers.carryingBasket,
  ],
};

const fetchData = async () => {
  const response = await fetch("https://api.paccurate.io/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
};

app.use(express.json());

app.get("/", function (req, res) {
  (async () => {
    const data = await fetchData();
    res.end(JSON.stringify(data));
  })();
});

app.get("/info-debug", function (req, res) {
  (async () => {
    const data = await fetchData();
    res.set('Accept', 'application/json');
    res.set("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  })();
});

app.get("/get-svg", function (req, res) {
  (async () => {
    const data = await fetchData();
    let body = "<!DOCTYPE html>";
    body += `<html><head>`;
    body += `<script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>`
    body += `<script>${data.scripts}</script>`;
    body += `<style>body { background-color: #333333 !important</style> };`;
    body += `<style>${data.styles}</style>`;
    body += `</head><body>`
    for (let i = 0; i < data.svgs.length; i++) {
      const svg = data.svgs[i];
      body += `<div>${svg}</div>`;
    }
    body += `</body></html>`;
    res.send(body);
  })();
});

app.post("/cart-check", function (req, res) {
  (async () => {
    
  })();
});

var server = app.listen(port, function () {
  console.log(`Listening on port 8080`);
});
