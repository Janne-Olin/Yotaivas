var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // ÄLÄ käytä root:n tunnusta tuotannossa
    password: '',
    database: 'Yotaivas'
});

const createErrorMessage = (res, msg) => {
    console.log("Error in server");
    res.statusCode = 400;
    res.json({statusid : "NOT OK", message : msg});
}

const executeSQL = (query, params) => {
    console.log("query: " + query);

    return new Promise((resolve, reject) => {
        connection.query(query, params, function (error, results, fields) {
            error ? reject(error) : resolve(results);
        });
    })
}

// const executeGetSingleSQL = (query, params) => {
//     return new Promise((resolve, reject) => {
//         connection.query(query, params, function (error, results, fields) {
//             error ? reject(error) : resolve(results.length > 0 ? results[0] : null);
//         });
//     })
// }

module.exports = {
    createErrorMessage,
    executeSQL
}