module.exports = (sequelize, DataTypes) => {
    var languages = sequelize.define('languages', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          }
        });
    return languages;
  };
  