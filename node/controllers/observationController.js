const sql = require('../db/observationSQL');
const utils = require('../db/utils/dbutils');

module.exports = {


    fetch: async (req, res) => {
        try {
            let h = await sql.fetch(null);
            res.statusCode = 200;
            res.json({status: "OK", havainnot: h});
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    fetchSingleObservation: async (req, res) => {
        try {
            let id = req.params.id;

            let h = await sql.fetch(id);
            res.statusCode = 200;
            res.json({status: "OK", havainto: h});
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    insert: async (req, res) => {
        try {
            const {objectid, date, equipment, location, description} = req.body;

            const epoch_time_date = new Date(date).valueOf() / 1000;
            console.log(epoch_time_date);

            let result = await sql.insert({objectid, epoch_time_date, equipment, location, description});
            let h = await sql.fetch(result.insertId);

            res.statusCode = 201;
            res.json(h);
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    update: async (req, res) => {
        try {
            const {objectid, date, equipment, location, description} = req.body;
            const id = req.params.id;

            const epoch_time_date = new Date(date).valueOf() / 1000;
            console.log(epoch_time_date);


            let result = await sql.update({objectid, epoch_time_date, equipment, location, description}, id);

            if ( result.affectedRows > 0){
                res.statusCode = 204;
                res.json()
            }
            else {
                res.statusCode = 404;
                res.json()
            }
        }
        catch(err){
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;

            let result = await sql.delete(id);

            res.statusCode = 204;
            res.json()
        }
        catch(err){
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },


}