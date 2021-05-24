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

    // update: async (req, res) => {
    //     try {
    //         const {kohde_id, pvm, valine, paikka, selite} = req.body;
    //         const id = req.params.id;

    //         let result = await sql.update({kohde_id, pvm, valine, paikka, selite}, id);

    //         if ( result.affectedRows > 0){
    //             res.statusCode = 204;
    //             res.json()
    //         }
    //         else {
    //             res.statusCode = 404;
    //             res.json()
    //         }
    //     }
    //     catch(err){
    //         utils.createErrorMessage(res, "Virhe: " + err.message);
    //     }
    // },

    // delete: async (req, res) => {
    //     try {
    //         const avain = req.params.avain;

    //         // Tarkistetaan löytyykö asiakkaalle toimitettuja tilauksia
    //         let orderRows = await orderSql.fetchOrderRowsByCustomer(avain, 1);
    //         if ( orderRows.length > 0 )
    //         {
    //             utils.createErrorMessage(res, "Asiakasta ei voi poistaa, koska siihen liittyy toimitettu tilausrivi", orderRows)
    //             return;
    //         }

    //         let result = await sql.deleteCustomers(avain);

    //         res.statusCode = 204;
    //         res.json()
    //     }
    //     catch(err){
    //         utils.createErrorMessage(res, "Virhe: " + err.message);
    //     }
    // },


}