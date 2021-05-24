const sql = require('../db/typeSQL');
const utils = require('../db/utils/dbutils');

module.exports = {

    fetch: async (req, res) => {
        try {
            let t = await sql.fetch(null);
            res.statusCode = 200;
            res.json({status: "OK", tyypit: t});
        }
        catch (err) {
            utils.createErrorMessage(res, "Virhe: " + err.message);
        }
    } 
}