const utils = require('./utils/dbutils');

const fetchObject = (id) => {    

    let query = "SELECT k.nimi AS kohde, k.alias, t.nimi AS tyyppi FROM kohde k";
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

// const updateObservation = ({kohde_id, pvm, valine, paikka, selite}, id) => {
//     let query = "UPDATE  havainto SET kohde_id=?, pvm=?, valine=?, paikka=?, selite=? WHERE id = ?";

//     return utils.executeSQL(query, [kohde_id, pvm, valine, paikka, selite, id]);
// }

module.exports = {

    fetch : (id) => {
        return fetchObject(id);
    },

    insert : ({name, alias, typeid}) => {
        return insertObject({name, alias, typeid});
    },

    // update : ({kohde_id, pvm, valine, paikka, selite}, id) => {
    //     return updateObservation({kohde_id, pvm, valine, paikka, selite}, id);
    // }
}