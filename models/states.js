module.exports = (sequelize, DataTypes) => {
    var states = sequelize.define('states', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true
          },
          name : {
            type: DataTypes.STRING
          },
          country_id : {
            type: DataTypes.INTEGER
          }
        });
    return states;
  };
  