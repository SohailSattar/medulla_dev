var Sequelize = require('sequelize'),
    config    = require('../config'),
    db        = {};

var userSchemas = ['User', 
                  'Profile', 
                  'Jobs', 
                  'jobRoles',
                  'appearance',
                  'features', 
                  'Sports',
                  'Languages',
                  'arts',
                  'CombatTraining',
                  'OtherSkills',
                  'Category',
                  'jobCategories',
                  'countries',
                  'states',
                  'cities',
                  'jobApplications',
                  'portfolio',
                  'ethnicity',
                  'works'
                ];

var options = {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 300000,
      idle: 10000
    }
  };
  database = config.database;

  const sequelize = new Sequelize(database, config.username, config.password, options);

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully to '+database);
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  })
  
  userSchemas.forEach(function (schema) {
    db[schema] =  sequelize['import'](__dirname + '/' + schema);
  });

  db.Jobs.roles = db.Jobs.hasMany(db.jobRoles, {
    onDelete: 'cascade',
    as: 'roles',
    foreignKey: {
      name: 'jobId',
      allowNull: false
    }
  });
  
  db.Category.hasMany(db.jobCategories, {
    onDelete: 'cascade',
    as: 'subCategory',
    foreignKey: {
      name: 'mainCategoyID',
      allowNull: false
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  db.Op = Sequelize.Op;

module.exports = db;
