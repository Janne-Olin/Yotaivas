var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/skyobjectController');

router.route('/api/kohde').
    get(ctrl.fetch).
    post(ctrl.insert);

module.exports = router;