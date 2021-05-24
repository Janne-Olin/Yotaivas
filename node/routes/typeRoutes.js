var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/typeController');

router.route('/api/tyyppi').
    get(ctrl.fetch);

module.exports = router;