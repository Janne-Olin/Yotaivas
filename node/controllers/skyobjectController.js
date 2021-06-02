const sql = require('../db/skyobjectSQL');
const utils = require('../db/utils/dbutils');

module.exports = {


    fetch: async (req, res) => {
        try {
            let k = await sql.fetch(null);
            res.statusCode = 200;
            res.json({status: "OK", kohteet: k});
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    fetchSingleObject: async (req, res) => {
        try {
            let id = req.params.id;

            let k = await sql.fetch(id);
            res.statusCode = 200;
            res.json({status: "OK", kohde: k});
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    insert: async (req, res) => {
        try {
            const {name, alias, typeid} = req.body;

            let result = await sql.insert({name, alias, typeid});
            let k = await sql.fetch(result.insertId);

            res.statusCode = 201;
            res.json(k);
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    },

    update: async (req, res) => {
        try {
            const {name, alias, typeid} = req.body;
            const id = req.params.id;

            let result = await sql.update({name, alias, typeid}, id);

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