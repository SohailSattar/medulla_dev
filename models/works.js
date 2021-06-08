module.exports = (sequelize, DataTypes) => {
    var Works = sequelize.define('works', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          title : {
            type: DataTypes.STRING
          },
          description : {
            type: DataTypes.STRING
          },
          url : {
            type: DataTypes.STRING
          },
          type : {
            type: DataTypes.STRING
          }
        });
    return Works;
  };