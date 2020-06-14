require("dotenv").config();
const express = require("express");
const app = express();
const fetch = require("node-fetch");

const apiKey = process.env.API_KEY;

const containers = {
  shoppingCart: {
    weightMax: 400,
    name: "ShoppingCart",
    dimensions: {
      x: 79,
      y: 40,
      z: 51,
    },
  },
  carryingBasket: {
    weightMax: 150,
    name: "CarryingBasket",
    dimensions: {
      x: 48,
      y: 18,
      z: 35,
    },
  },
};

const payload = {
  key: apiKey,
  itemSets: [
    {
      refId: 0,
      dimensions: { x: 2, y: 2, z: 4 },
      quantity: 42,
    },
    {
      refId: 1,
      dimensions: { x: 1, y: 2, z: 2 },
      quantity: 52,
    },
    {
      refId: 2,
      dimensions: { x: 2, y: 4, z: 2 },
      quantity: 72,
    },
    {
      refId: 3,
      dimensions: { x: 1, y: 1, z: 2 },
      quantity: 32,
    },
    {
      refId: 4,
      dimensions: { x: 1, y: 4, z: 2 },
      quantity: 42,
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
    body += `<style>${data.style}</style>`;
    body += `<script>${data.scripts}</script>`;
    body += `</head><body>`
    for (let i = 0; i < data.svgs.length; i++) {
      const svg = data.svgs[i];
      body += `<div>${svg}</div>`;
    }
    body += `</body></html>`;
    res.send(body);
  })();
});

var server = app.listen(8081, function () {
  console.log(`Listening on port 8080`);
});
