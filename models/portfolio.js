module.exports = (sequelize, DataTypes) => {
    var portfolio = sequelize.define('portfolio', {
          userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
          },
          images: {
            type: DataTypes.JSON
          },
          videos: {
            type: DataTypes.JSON
          },
          audios: {
            type: DataTypes.JSON
          }
        });
    return portfolio;
  };
  