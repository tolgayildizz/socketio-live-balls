var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Live Balls' });
});

//Ortam değişkenini öğrenmek için gerekli get isteği
router.get('/getEnv', function(req, res, next) {
  const env = require('../config/env.json')[process.env.NODE_ENV || 'development'];
  res.json(env);
});

module.exports = router;
