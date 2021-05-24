const utils = require('./utils/dbutils');

const fetchObservation = (id) => {    

    let query = "SELECT k.nimi AS kohde, DATE_FORMAT(h.pvm, '%d.%m.%Y') AS pvm, h.valine, h.paikka, h.selite FROM havainto h ";
    query += "INNER JOIN kohde k ON h.kohde_id = k.id WHERE 1=1";

    if (id) {
        query += " AND h.id = ?"
    }

    query += " ORDER BY h.pvm";

    return utils.executeSQL(query, [id]);
}

const insertObservation = ({kohde_id, pvm, valine, paikka, selite}) => {
    let query = "INSERT INTO havainto (kohde_id, pvm, valine, paikka, selite) VALUES (?, ?, ?, ?, ?)";

    return utils.executeSQL(query, [kohde_id, pvm, valine, paikka, selite]);
}

const updateObservation = ({kohde_id, pvm, valine, paikka, selite}, id) => {
    let query = "UPDATE  havainto SET kohde_id=?, pvm=?, valine=?, paikka=?, selite=? WHERE id = ?";

    return utils.executeSQL(query, [kohde_id, pvm, valine, paikka, selite, id]);
}

module.exports = {

    fetch : (id) => {
        return fetchObservation(id);
    },

    insert : ({kohde_id, pvm, valine, paikka, selite}) => {
        return insertObservation({kohde_id, pvm, valine, paikka, selite});
    },

    update : ({kohde_id, pvm, valine, paikka, selite}, id) => {
        return updateObservation({kohde_id, pvm, valine, paikka, selite}, id);
    }
}