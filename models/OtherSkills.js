module.exports = (sequelize, DataTypes) => {
    var otherSkills = sequelize.define('other_skills', {
          specialFeatures : {
            type: DataTypes.JSON,
            field: 'special_features'
          },
          drivingSkills: {
            type: DataTypes.JSON,
            field: 'driving_skills'
          },
          improvisation: {
            type: DataTypes.JSON
          },
          circusSkills : {
            type: DataTypes.JSON,
            field: 'circus_skills'
          },
          horseRidingSkills : {
            type: DataTypes.JSON,
            field: 'horse_riding_skills'
          },
          smoking : {
            type: DataTypes.JSON
          },
          miscellaneousSkills: {
            type: DataTypes.JSON,
            field: 'miscellaneous_skills'
          }
        });
    return otherSkills;
  };
  