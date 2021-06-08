module.exports = (sequelize, DataTypes) => {
  var cities = sequelize.define('cities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    state_id: {
      type: DataTypes.INTEGER
    }
  });
  return cities;
};
