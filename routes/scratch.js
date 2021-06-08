router.post('/sample', async function (req, res) {
    // try {
    //   var found = await db.Sample.findOne({ where: { uuid: req.body.uuid } });
    //   var record;
    //   if (found) {
    //     record =  await db.Sample.update(req.body, { where: { uuid: req.body.uuid } });
    //   }else{
    //     record =  await db.Sample.create(req.body);
    //   }
    //   res.json({
    //     record: "profile created or updated successfully",
    //     status: 200
    //   });
    // }catch(err){
    //   res.json({
    //     err: err
    //   });
    // }
  });

  module.exports = (sequelize, DataTypes) => {
    var Sample = sequelize.define('sample', {
                  uuid: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV1,
                    primaryKey: true
                  },
                  a: {
                    type: DataTypes.STRING,
                    allowNull: true
                  },
                  b: {
                    type: DataTypes.STRING,
                    allowNull: true
                  },
                  c: {
                    type: DataTypes.STRING,
                    allowNull: true
                  }
    });
    return Sample;
  };
  
  router.post('/profile', async function (req, res) {
    try {
      var found = await db.Profile.findOne({ where: { userId: req.body.userId } });
      var record;
      if (found) {
        record =  await db.Profile.update(req.body, { where: { userId: req.body.userId } });
      }else{
        record =  await db.Profile.create(req.body);
      }
      res.json({
        record: "profile created or updated successfully",
        status: 200
      });
    }catch(err){
      res.json({
        err: err
      });
    }
  });