module.exports = (sequelize, DataTypes) => {
    var features = sequelize.define('features', {
          willingToTravel: {
            type: DataTypes.JSON,
            field: 'willing_to_travel'
          },
          tattoos: {
            type: DataTypes.JSON,
            field: 'tattoos'
          },
          piercings: {
            type: DataTypes.JSON,
            field: 'piercings'
          },
          facialHair: {
            type: DataTypes.JSON,
            field: 'facial_hair'
          },
          wardrobeItems: {
            type: DataTypes.JSON,
            field: 'wardrobe_items'
          }
        });
    return features;
  };
  