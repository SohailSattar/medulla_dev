module.exports = (sequelize, DataTypes) => {
    var Ethnicity = sequelize.define('ethnicity', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          type : {
            type: DataTypes.STRING
          },
          value : {
            type: DataTypes.STRING
          },
          description : {
            type: DataTypes.STRING
          }
        });
    return Ethnicity;
  };