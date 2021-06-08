module.exports = (sequelize, DataTypes) => {
    var combatTraining = sequelize.define('combat_training', {
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
          }
        });
    return combatTraining;
  };
  