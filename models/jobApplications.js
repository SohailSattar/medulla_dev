module.exports = (sequelize, DataTypes) => {
    var jobApplications = sequelize.define('job_applications', {
          userId: {
            type: DataTypes.INTEGER
          },
          jobId: {
            type: DataTypes.INTEGER
          },
          roleId: {
            type:  DataTypes.INTEGER
          },
          notification: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          },
          selected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
    return jobApplications;
  };
  