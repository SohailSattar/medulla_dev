module.exports = (sequelize, DataTypes) => {
    var jobRoles = sequelize.define('job_roles', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          title: {
            type: DataTypes.STRING,
            allowNull: true
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          gender: {
            type: DataTypes.STRING,
            allowNull: true
          },
          age: {
            type: DataTypes.JSON,
            allowNull: true
          },
          ethnicity: {
            type: DataTypes.STRING,
            allowNull: true
          },
          salaryRange: {
            type: DataTypes.STRING,
            allowNull: true
          },
          location: {
            type: DataTypes.STRING,
            allowNull: true
          },
          type: {
            type: DataTypes.STRING,
            allowNull: true
          },
          amount: {
            type: DataTypes.STRING,
            allowNull: true
          },
          jobId: {
            type: DataTypes.INTEGER
          },
        });
    return jobRoles;
  };
  