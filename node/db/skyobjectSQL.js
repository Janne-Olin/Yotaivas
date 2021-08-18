const utils = require('./utils/dbutils');

const fetchObject = (id, {name, alias, typeid}) => {   
     

    let query = "SELECT k.id, k.nimi AS kohde, k.alias, k.tyyppi_id, t.nimi AS tyyppi FROM kohde k";
    query += " INNER JOIN kohdetyyppi t ON k.tyyppi_id = t.id WHERE 1=1";

    let vars = [];

    if (id) {
        query += " AND k.id = ?";
        vars.push(id);
    }

    if (name) {
        query += " AND k.nimi like ?";
        vars.push(name + "%");
    }

    if (alias) {
        query += " AND k.alias like ?";
        vars.push(alias + "%");
    }

    if (typeid > 0) {
        query += " AND k.tyyppi_id = ?";
        vars.push(typeid);
    }   

    return utils.executeSQL(query, vars);
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

    fetch : (id, {name, alias, typeid}) => {
        return fetchObject(id, {name, alias, typeid});
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