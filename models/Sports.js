module.exports = (sequelize, DataTypes) => {
    var sports = sequelize.define('sports_drop_down', {
          waterSports: {
            type: DataTypes.JSON,
            field: 'water_sports'
          },
          winterSports: {
            type: DataTypes.JSON,
            field: 'winter_sports'
          },
          gymnastics: {
            type: DataTypes.JSON,
            field: 'gymnastics'
          },
          teamSports: {
            type: DataTypes.JSON,
            field: 'team_sports'
          },
          miscSports: {
            type: DataTypes.JSON,
            field: 'misc_sports'
          },
          swimming: {
            type: DataTypes.JSON,
            field: 'swimming'
          },
          trackAndField: {
            type: DataTypes.JSON,
            field: 'track_and_field'
          },
          cycling: {
            type: DataTypes.JSON
          }
        });
    return sports;
  };
  