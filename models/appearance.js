module.exports = (sequelize, DataTypes) => {
    var appearance = sequelize.define('appearance', {
          ethnicLook: {
            type: DataTypes.JSON,
            field: 'ethnic_look'
          },
          hairType: {
            type: DataTypes.JSON,
            field: 'hair_type'
          },
          hairColor: {
            type: DataTypes.JSON,
            field: 'hair_color'
          },
          eyeColor: {
            type: DataTypes.JSON,
            field: 'eye_color'
          },
          height: {
            type: DataTypes.STRING
          },
          shoeSize: {
            type: DataTypes.STRING,
            field: 'shoe_size'
          },
          tshirtSize: {
            type: DataTypes.JSON,
            field: 'tshirt_size'
          },
          pantSize: {
            type: DataTypes.STRING,
            field: 'pant_size'
          },
          jacketSize: {
            type: DataTypes.JSON,
            field: 'jacket_size'
          },
          dressSize: {
            type: DataTypes.JSON,
            field: 'dress_size'
          },
          chest: {
            type: DataTypes.STRING
          },
          waist: {
            type: DataTypes.STRING
          },
          hips: {
            type: DataTypes.STRING
          },
          performance: {
            type: DataTypes.JSON
          }
        });
    return appearance;
  };
  