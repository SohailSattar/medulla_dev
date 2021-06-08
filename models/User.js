module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
        uuid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          field: 'id'
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty: {
                  args: true,
                  msg: 'First Name is Required'
              },
              is: {
                  args: ["^[a-z ]+$", 'i'],
                  msg: 'First Name must be only alphabets'
              },
              len: {
                  args: [0, 256],
                  msg: 'First Name cannot exceeds 256 characters'
              },
          },
          field: 'FIRST_NAME'
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
              is: {
                  args: ["^[a-z ]+$", 'i'],
                  msg: 'Last Name must be only alphabets'
              },
              len: {
                  args: [0, 256],
                  msg: 'Last Name cannot exceed 256 characters'
              }
          },
          field: 'LAST_NAME'
        },
        hearAboutUs: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'hear_about_us'
        },
        agentName: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'agent_name'
        },
        agentContact: {
          type: DataTypes.STRING,
          allowNull: true,
          // validate: {
          //     notEmpty: {
          //         args: true,
          //         msg: 'Phone Number is Required'
          //     },
          //     not: {
          //         args: ["[a-z]", 'i'],
          //         msg: 'Invalid Phone Number'
          //     },
          //     len: {
          //         args: [10, 15],
          //         msg: 'Phone number should be in between 10 to 15 characters'
          //     }
          // },
          field: 'agent_contact',
        },
        role:{
          type: DataTypes.STRING,
          defaultValue: 'ADMIN',
        },
        salt: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        hash: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        companyOrAgencyName: {
          type: DataTypes.STRING
        },
        image: {
          type: DataTypes.STRING
        },
        premium:{
          type: DataTypes.BOOLEAN,
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
  return User;
};
