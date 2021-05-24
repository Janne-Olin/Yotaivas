const utils = require('./utils/dbutils');

const fetchType = (id) => {    

    let query = "SELECT * FROM kohdetyyppi WHERE 1=1";

    if (id) {
        query += " AND k.id = ?"
    }

    query += " ORDER BY nimi";

    return utils.executeSQL(query, [id]);
}

module.exports = {

    fetch : (id) => {
        return fetchType(id);
    },
}