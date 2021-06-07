var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/observationController');

router.route('/api/havainto').
    get(ctrl.fetch).
    post(ctrl.insert);

router.route('/api/havainto/:id').
    get(ctrl.fetchSingleObservation).
    put(ctrl.update).
    delete(ctrl.delete);

module.exports = router;