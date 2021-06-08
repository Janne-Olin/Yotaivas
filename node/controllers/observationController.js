const sql = require('../db/observationSQL');
const utils = require('../db/utils/dbutils');

const checkInputfieldsExists = (body) => {

    const {objectid, date, equipment, location, description} = body;

    let errors = [];
    if (!date) errors.push("päivämäärä");
    if (!equipment || equipment == "") errors.push("väline");
    if (!location || location == "") errors.push("paikka");
    if (!description || description == "") errors.push("selite");
    if (!objectid || objectid < 0) errors.push("kohde")

    if (errors.length > 0)
        return errors.join(",");
    else
        return null;
}

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
            const checkErrors = checkInputfieldsExists(req.body);

            if (checkErrors) {
                utils.createErrorMessage(res, "Pakollisia tietoja puuttuu: " + checkErrors);
                return;
            }

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
            const checkErrors = checkInputfieldsExists(req.body);

            if (checkErrors) {
                utils.createErrorMessage(res, "Pakollisia tietoja puuttuu: " + checkErrors);
                return;
            }

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