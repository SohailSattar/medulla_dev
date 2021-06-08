module.exports = (sequelize, DataTypes) => {
    var Category = sequelize.define('category', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          category : {
            type: DataTypes.STRING
          },
          title : {
            type: DataTypes.STRING
          },
          description : {
            type: DataTypes.STRING
          }
        });
    return Category;
  };
  