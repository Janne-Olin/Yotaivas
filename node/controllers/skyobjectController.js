const sql = require('../db/skyobjectSQL');
const utils = require('../db/utils/dbutils');

const checkInputfieldsExists = (body) => {

    const {name, typeid} = body;

    let errors = [];
    if (!name || name == "") errors.push("nimi");
    if (!typeid || typeid < 0) errors.push("kohdetyyppi")

    if (errors.length > 0)
        return errors.join(",");
    else
        return null;
}

module.exports = {


    fetch: async (req, res) => {
        try {
            const {name, alias, typeid} = req.query;            

            let k = await sql.fetch(null, {name, alias, typeid});
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

            let k = await sql.fetch(id, {name: null, alias: null, typeid: null});
            res.statusCode = 200;
            res.json({status: "OK", kohde: k});
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
            const checkErrors = checkInputfieldsExists(req.body);

            if (checkErrors) {
                utils.createErrorMessage(res, "Pakollisia tietoja puuttuu: " + checkErrors);
                return;
            }

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