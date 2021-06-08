module.exports = (sequelize, DataTypes) => {
    var Jobs = sequelize.define('jobs', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          title: {
            type: DataTypes.STRING,
            allowNull: true
          },
          location: {
            type: DataTypes.STRING,
            allowNull: true
          },
          city: {
            type: DataTypes.STRING,
            allowNull: true
          },
          startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
          },
          endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          type: {
            type: DataTypes.STRING,
            allowNull: true
          },
          category: {
            type: DataTypes.STRING,
            allowNull: true
          },
          subCategory: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'sub_category'
          },
          clientEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'client_email'
          },
          expiryDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'expiry_date'
          },
          applyFrom: {
            type: DataTypes.STRING,
            allowNull: true
          },
          applyFromLocation: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'apply_from_location'
          },
          moreDetails: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'more_details'
          },
          image: {
            type: DataTypes.STRING,
            allowNull: true
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
    return Jobs;
  };
  