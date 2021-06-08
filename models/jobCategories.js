module.exports = (sequelize, DataTypes) => {
    var jobCategories = sequelize.define('job_categories', {
        category: {
            type: DataTypes.STRING
        },
        subCategories: {
            type: DataTypes.JSON
        },
        mainCategoyID: {
            type: DataTypes.INTEGER
        }
    });
    return jobCategories;
};
