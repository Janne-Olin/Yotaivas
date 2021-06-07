const utils = require('./utils/dbutils');

const fetchObservation = (id) => {    

    let query = "SELECT k.nimi AS kohde, h.kohde_id, h.id, h.pvm, h.valine, h.paikka, h.selite FROM havainto h ";
    query += "INNER JOIN kohde k ON h.kohde_id = k.id WHERE 1=1";

    if (id) {
        query += " AND h.id = ?"
    }

    query += " ORDER BY h.pvm";

    return utils.executeSQL(query, [id]);
}

const insertObservation = ({objectid, epoch_time_date, equipment, location, description}) => {
    let query = "INSERT INTO havainto (kohde_id, pvm, valine, paikka, selite) VALUES (?, FROM_UNIXTIME(?), ?, ?, ?)";

    return utils.executeSQL(query, [objectid, epoch_time_date, equipment, location, description]);
}

const updateObservation = ({objectid, epoch_time_date, equipment, location, description}, id) => {
    console.log();
    let query = "UPDATE havainto SET kohde_id=?, pvm=FROM_UNIXTIME(?), valine=?, paikka=?, selite=? WHERE id = ?";

    return utils.executeSQL(query, [objectid, epoch_time_date, equipment, location, description, id]);
}

const deleteObservation = (id) => {
    let query = "DELETE FROM havainto WHERE id = ?";

    return utils.executeSQL(query, [id]);
}

module.exports = {

    fetch : (id) => {
        return fetchObservation(id);
    },

    insert : ({objectid, epoch_time_date, equipment, location, description}) => {
        return insertObservation({objectid, epoch_time_date, equipment, location, description});
    },

    update : ({objectid, epoch_time_date, equipment, location, description}, id) => {
        return updateObservation({objectid, epoch_time_date, equipment, location, description}, id);
    },

    delete : (id) => {
        return deleteObservation(id);
    }
}