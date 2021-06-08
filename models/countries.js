module.exports = (sequelize, DataTypes) => {
    var countries = sequelize.define('countries', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true
          },
          name : {
            type: DataTypes.STRING
          },
          nationality: {
            type: DataTypes.STRING
          },
          alpha2Code : {
            type: DataTypes.STRING
          },
          alpha3Code : {
            type: DataTypes.STRING
          }
        });
    return countries;
  };
  