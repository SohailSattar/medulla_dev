module.exports = (sequelize, DataTypes) => {
    var Profile = sequelize.define('profile', {
          userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'user_id'
          },
          name: {
            type: DataTypes.STRING
          },
          image: {
            type: DataTypes.STRING
          },
          aboutMe: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'about_me'
          },
          professionalDetails: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'professional_details'
          },
          dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'DATE_OF_BIRTH'
          },
          nationality: {
            type: DataTypes.STRING,
            allowNull: true
          },
          gender: {
            type: DataTypes.STRING,
            allowNull: true
          },
          location: {
            type: DataTypes.STRING,
            allowNull: true
          },
          phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'phone_number'
          },
          email: {
            type: DataTypes.STRING
          },
          ethnicLook: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ethnic_look'
          },
          ethnicity: {
            type: DataTypes.STRING,
            allowNull: true
          },
          hairColor: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'hair_color'
          },
          hairType: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'hair_type'
          },
          eyeColor: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'eye_color'
          },
          height: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          shoeSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'shoe_size'
          },
          tshirtSize: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'tshirt_size'
          },
          pantSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'pant_size'
          },
          jacketSize: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'jacket_size'
          },
          dressSize: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'dress_size'
          },
          chest: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          waist: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          hips: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          performance: {
            type: DataTypes.STRING,
            allowNull: true
          },
          languages: {
            type: DataTypes.JSON,
            allowNull: true
          },
          singing: {
            type: DataTypes.JSON,
            allowNull: true
          },
          instruments: {
            type: DataTypes.JSON,
            allowNull: true
          },
          dance: {
            type: DataTypes.JSON,
            allowNull: true
          },
          vocalRange: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'vocal_range'
          },
          waterSports: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'water_sports'
          },
          winterSports: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'winter_sports'
          },
          gymnastics: {
            type: DataTypes.JSON,
            allowNull: true
          },
          teamSports: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'team_sports'
          },
          miscSports: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'misc_sports'
          },
          swimming: {
            type: DataTypes.JSON,
            allowNull: true
          },
          trackAndField: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'track_and_field'
          },
          cycling: {
            type: DataTypes.JSON,
            allowNull: true
          },
          willingToTravel: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'willing_to_travel'
          },
          tattoos: {
            type: DataTypes.STRING,
            allowNull: true
          },
          piercings: {
            type: DataTypes.STRING,
            allowNull: true
          },
          facialHair: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'facial_hair'
          },
          wardrobeItems: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'wardrobe_items'
          },
          stageCombatTraining: {
            type: DataTypes.JSON,
            field: 'stage_combat_training'
          },
          martialArts: {
            type: DataTypes.JSON,
            field: 'martial_arts'
          },
          martialArtsWeaponsTraining: {
            type: DataTypes.JSON,
            field: 'martial_arts_weapons_training'
          },
          generalWeaponsTraining: {
            type: DataTypes.JSON,
            field: 'general_weapons_training'
          },
          specialFeatures: {
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
          circusSkills: {
            type: DataTypes.JSON,
            field: 'circus_skills'
          },
          horseRidingSkills: {
            type: DataTypes.JSON,
            field: 'horseRiding_skills'
          },
          smoking: {
            type: DataTypes.JSON
          },
          miscellaneousSkills: {
            type: DataTypes.JSON,
            field: 'miscellaneous_skills'
          },
          experience: {
            type: DataTypes.JSON
          },
          categories: {
            type: DataTypes.JSON
          },
          visible:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          createdDate: {
            type: DataTypes.DATEONLY,
            field: 'created_date'
          },
          updatedDate: {
            type: DataTypes.DATEONLY,
            field: 'updated_date'
          }
        });
    return Profile;
  };
