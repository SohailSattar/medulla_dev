var db = require('../models/index');
console.log("#####DBSYNC START#####");
db.sequelize.sync({
    force: true,
    logging: console.log,
}).then(function () {
    console.log("#####DBSYNC ENDs#####");
    process.exit();
});