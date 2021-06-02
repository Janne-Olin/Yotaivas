var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/skyobjectController');

router.route('/api/kohde').
    get(ctrl.fetch).
    post(ctrl.insert);

router.route('/api/kohde/:id').
    get(ctrl.fetchSingleObject).
    put(ctrl.update);

module.exports = router;