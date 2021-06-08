module.exports = (sequelize, DataTypes) => {
    var arts = sequelize.define('arts', {
          dance: {
            type: DataTypes.JSON
          },
          singing: {
            type: DataTypes.JSON
          },
          vocalRange: {
            type: DataTypes.JSON,
            field: 'vocal_range'
          },
          instruments: {
            type: DataTypes.JSON
          }
        });
    return arts;
  };
  