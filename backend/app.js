/*import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const express = require('express');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});*/

import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', // 开发环境
    'https://weegeelee.github.io' // 生产环境
  ]
}));

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const mealsPath = path.join(__dirname, 'data', 'available-meals.json');
const ordersPath = path.join(__dirname, 'data', 'orders.json');

/*app.get('/', (req, res) => {
  res.send('🚀 后端服务运行中，请访问 /meals 获取餐品数据');
});*/

app.get('/meals', async (req, res) => {
  try {
    const data = await fs.readFile(mealsPath, 'utf8'); // 
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('读取餐品数据失败:', err);
    res.status(500).json({ error: '无法加载餐品数据' });
  }
});

app.get('/meals', async (req, res) => {
  const meals = await fs.readFile('./data/available-meals.json', 'utf8');
  res.json(JSON.parse(meals));
});

app.post('/orders', async (req, res) => {
  const orderData = req.body.order;

  if (orderData === null || orderData.items === null || orderData.items == []) {
    return res
      .status(400)
      .json({ message: 'Missing data.' });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes('@') ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === '' ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === '' ||
    orderData.customer['postal-code'] === null ||
    orderData.customer['postal-code'].trim() === '' ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ''
  ) {
    return res.status(400).json({
      message:
        'Missing data: Email, name, street, postal code or city is missing.',
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };
  const orders = await fs.readFile('./data/orders.json', 'utf8');
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);
  await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
  res.status(201).json({ message: 'Order created!' });
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

/*app.listen(3000);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});*/

export default app;
