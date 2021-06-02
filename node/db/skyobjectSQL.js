const utils = require('./utils/dbutils');

const fetchObject = (id) => {    

    let query = "SELECT k.id, k.nimi AS kohde, k.alias, k.tyyppi_id, t.nimi AS tyyppi FROM kohde k";
    query += " INNER JOIN kohdetyyppi t ON k.tyyppi_id = t.id WHERE 1=1";

    if (id) {
        query += " AND k.id = ?"
    }

    query += " ORDER BY k.nimi";

    return utils.executeSQL(query, [id]);
}

const insertObject = ({name, alias, typeid}) => {
    let query = "INSERT INTO kohde (nimi, alias, tyyppi_id) VALUES (?, ?, ?)";

    return utils.executeSQL(query, [name, alias, typeid]);
}

const updateObject = ({name, alias, typeid}, id) => {
    let query = "UPDATE kohde SET nimi=?, alias=?, tyyppi_id=? WHERE id = ?";

    return utils.executeSQL(query, [name, alias, typeid, id]);
}

const deleteObject = (id) => {
    let query = "DELETE FROM kohde WHERE id = ?";

    return utils.executeSQL(query, [id]);
}

module.exports = {

    fetch : (id) => {
        return fetchObject(id);
    },

    insert : ({name, alias, typeid}) => {
        return insertObject({name, alias, typeid});
    },

    update : ({name, alias, typeid}, id) => {
        return updateObject({name, alias, typeid}, id);
    },

    delete : (id) => {
        return deleteObject(id);
    }
}