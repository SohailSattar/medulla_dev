var router=require('express').Router();
var passport=require('passport');
var auth=require('../auth');
var CRYPTO=require('crypto');
var crypto=require('../config/crypto');
var jwt=require('jsonwebtoken');
var secret=require('../config').secret;
var _=require('underscore');
var helpers=require('../helpers/apiHelpers');
var async=require('async');
var mailService=require('../mail-service/mail.service');
var userImage=require('../config/userImage');
var multer=require('multer');
var path=require('path');
const db=require('../models');
var config=require('../config/config')['development'];
var date=helpers.currentDate();
var fs=require('fs');
const storage=multer.diskStorage({
  destination: function(req,file,cb) {
    var dir=require('process').cwd()+'/files';
    var userDir=require('process').cwd()+'/files/User_'+req.payload.id;

    if(!fs.existsSync(dir)&&!fs.existsSync(userDir)) {
      fs.mkdirSync(dir);
      fs.mkdirSync(userDir);
    } else if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    else if(!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }

    cb(null,userDir);
  },
  filename: function(req,file,cb) {
    cb(null,file.originalname);
  }
});

const upload=multer({
  storage: storage
});
const jobImage=upload.single('job');
const imageFile=upload.single('file');
const portfolio=upload.fields([{name: 'image',maxCount: 10},{name: 'video',maxCount: 10},{name: 'audio',maxCount: 10}]);

router.post('/user/portfolio',auth.required,portfolio,async function(req,res,next) {
  let image=req.files.image? req.files.image:null;
  let video=req.files.video? req.files.video:null;
  let audio=req.files.audio? req.files.audio:null;
  let images=[],videos=[],audios=[];
  let body={};
  try {
    let user=await db.portfolio.findOne({where: {userId: req.payload.id}});
    if(image) {
      images=image.map(obj => {
        obj.path=config.baseUrl+'/files'+obj.path.split('files')[1].replace(/\\/g,"/");
        return obj.path;
      });
      if(user&&user.images) {
        if(user.images) {
          getUserImage=JSON.parse(user.images);
          if(getUserImage.length) {
            await getUserImage.forEach(function(value) {
              images=_.uniq(images.concat(value));
            });
            body.images=images
          }
          else {
            body.images=images;
          }

        } else {
          body.images=images;
        }

      } else {
        body.images=images;
      }
      if(body.images.length>10) return res.status(400).send({message: "exceeded maximum range",limit: 10,previous: user.images.length,current: images.length});
    }
    if(video) {
      videos=video.map(obj => {
        obj.path=config.baseUrl+'/files'+obj.path.split('files')[1].replace(/\\/g,"/");
        return obj.path;
      });
      if(user&&user.videos) {
        if(user.videos) {
          data=[{
            'files': videos,
            'description': req.body.description? req.body.description:''
          }]
          videos=data;
          getUserImage=JSON.parse(user.videos);
          if(getUserImage.length) {
            await getUserImage.forEach(function(value) {
              videos=_.uniq(videos.concat(value));
            });
            body.videos=videos;
          }
          else {
            body.videos=videos;
          }

        } else {
          data=[{
            'files': videos,
            'description': req.body.description? req.body.description:''
          }]
          body.videos=data;
        }
      } else {
        data=[{
          'files': videos,
          'description': req.body.description? req.body.description:''
        }]
        body.videos=data;
      }
      if(body.videos>10) return res.status(400).send({message: "exceeded maximum range",limit: 10,previous: user.videos.length,current: videos.length});
    }
    if(audio) {
      audios=audio.map(obj => {
        obj.path=config.baseUrl+'/files'+obj.path.split('files')[1];
        return obj.path;
      });
      if(user&&user.audios) {
        if(user.audios) {
          data=[{
            'files': audios,
            'description': req.body.description? req.body.description:''
          }]
          audios=data;
          getUserImage=JSON.parse(user.audios);
          if(getUserImage.length) {
            await getUserImage.forEach(function(value) {
              audios=_.uniq(audios.concat(value));
            });
            body.audios=audios;
          }
          else {
            body.audios=audios;
          }

        } else {
          data=[{
            'files': audios,
            'description': req.body.description? req.body.description:''
          }]
          body.audios=data;
        }
      } else {
        data=[{
          'files': audios,
          'description': req.body.description? req.body.description:''
        }]
        body.audios=data;
      }
      if(body.audios>10) return res.status(400).send({message: "exceeded maximum range",limit: 10,previous: user.audios.length,current: audios.length});
    }
    if(user) {
      let update=await db.portfolio.update(body,{where: {userId: req.payload.id}});
    } else {
      body.userId=req.payload.id;
      let create=await db.portfolio.create(body);
    }
    res.status(200).send({images: images,videos: videos,audios: audios});
  } catch(err) {
    console.log(err);
    res.status(400).send({err: err});
  }
})

router.get('/user/portfolio',auth.required,function(req,res,next) {
  db.portfolio.findOne({where: {userId: req.payload.id}}).then(data => {
    res.status(200).send({data: data,message: 'success'});
  }).catch(err => {
    res.status(400).send({err: err});
  });
});

router.get('/user/portfolio/:id',function(req,res,next) {
  db.portfolio.findOne({where: {userId: req.params.id}}).then(data => {
    res.status(200).send({data: data,message: 'success'});
  }).catch(err => {
    res.status(400).send({err: err});
  });
});

router.post('/user/portfolio/delete',auth.required,async function(req,res,next) {
  const {type,filePath}=req.body;
  let filePathFinal=filePath;
  let user=await db.portfolio.findOne({where: {userId: req.payload.id}});
  // user = (user && user.dataValues) ? user.dataValues : null;
  if(user) {
    files=JSON.parse(user[type])

    if(type=='videos') {
      videoData=[];
      if(files.length>0) {
        datafiles=[];
        await files.forEach(file => {
          if(file.files!=filePath) {
            videoData.push(file);
          }
          datafiles=datafiles.concat(file.files);
        });
        files=datafiles;
      }
    }

    if(type=='audios') {
      filePathFinal=filePath[0];
      audioData=[];
      if(files.length>0) {
        datafiles=[];
        await files.forEach(file => {
          if(file.files!=filePathFinal) {
            audioData.push(file);
          }
          datafiles=datafiles.concat(file.files);
        });
        files=datafiles;
      }
    }

    let index=(files.length)? files.indexOf(filePathFinal):-1;
    if(index==-1) {
      return res.status(400).send({err: 'Invalid userid or filepath'});
    }
    const deleteRec=files.splice(index,1);
    delete files[JSON.stringify(deleteRec)];
    if(type=='images') {
      let update=await db.portfolio.update({images: files},{where: {userId: req.payload.id}});
    }
    if(type=='videos') {
      let update=await db.portfolio.update({videos: videoData},{where: {userId: req.payload.id}});
    }
    if(type=='audios') {
      let update=await db.portfolio.update({audios: audioData},{where: {userId: req.payload.id}});
    }
    filetoDelete=JSON.stringify(deleteRec);
    fileData=filetoDelete.split("files");
    finalFile="./files"+fileData[1].replace('"]','');
    await fs.unlinkSync(finalFile);

    res.status(200).send({status: 'success',message: 'file removed'});
  }
  else {
    return res.status(400).send({err: 'Something went wrong'});
  }

});

router.get('/portfolio/counts',auth.required,async function(req,res,next) {
  try {
    let data={
      images: 0,
      videos: 0,
      audios: 0
    };
    let userId=req.payload.id;
    let user=await db.User.findOne({where: {uuid: userId},attributes: ['premium']});
    let portfolioRec=await db.portfolio.findOne({where: {userId: userId},attributes: ['images','videos','audios']});

    if(portfolioRec) {
      let {images,videos,audios}=portfolioRec;
      data.images=(JSON.parse(images)||[]).length;
      data.audios=(JSON.parse(audios)||[]).length;
      data.videos=(JSON.parse(videos)||[]).length;
    }
    data.premium=user.premium;
    const {portfolio: {premium,nonPremium}}=config;
    data=data.premium? {...data,...premium}:{...data,...nonPremium};

    res.status(200).send({user: data,message: 'success'});
  } catch(err) {
    res.status(400).send({err: err});
  }
});

router.post('/user/login',function(req,res,next) {
  if(!req.body.email) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Email should not be empty"
    });
  }

  if(!req.body.password) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Password should not be empty"
    });
  }

  passport.authenticate('local',{
    session: false
  },function(err,user,info) {
    if(err) {
      return next(err);
    }

    if(user) {
      user.token=generateJWT(user);
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        data: toAuthJSON(user)
      });
    } else {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: info.errors
      });
    }
  })(req,res,next);
});

/**
 * Create users
 */
router.post('/user/register',async function(req,res,next) {
  var salt=CRYPTO.randomBytes(16).toString('hex');
  var hash=crypto.encrypt(req.body.password,salt);
  try {
    var user=await db.User.find({
      where: {email: req.body.email}
    });
    if(user) {
      return res.status(400).json({status: 'error',statusCode: 400,message: "user already exsited with this email"});
    } else {
      var data=await db.User.findAll({
        attributes: [[db.sequelize.fn('MAX',db.sequelize.col('id')),'uuid']]
      });
      var id=data.length>0? data[0].uuid+1:10000;

      user=await db.User.create({
        uuid: id,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        hearAboutUs: req.body.hearAboutUs,
        agentName: req.body.agentName,
        agentContact: req.body.agentContact,
        role: req.body.role||'user',
        salt: salt,
        hash: hash,
        image: config.defaultDp,
        companyOrAgencyName: req.body.companyOrAgencyName,
        createdDate: date.currentDate,
        updatedDate: date.currentDate,
        active: req.body.role==='client'
      });

      if(user.role==='user') {
        var profile=await db.Profile.create({
          userId: user.uuid,
          name: user.firstName+' '+user.lastName,
          image: config.defaultDp,
          email: user.email,
          visible: false,
          createdDate: date.currentDate,
          updatedDate: date.currentDate
        });
      }
      let link=`${config.baseUrl}/account-verification/${user.uuid}`;
      //let html = `<a href=${link}>Account confirmation</a>`;
      let html=`  
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <link rel="preconnect" href="https://fonts.gstatic.com">
                  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet">
                </head>
                <body style="font-family:'Ubuntu', sans-serif;">
                    <div id="container">
                      <div style='padding:14px; background-color: #faf7f7; width: 100%; border-radius: 6px;'>
                        <div style="padding:6px;"> Dear <b>${user.firstName} ${user.lastName}</b>,</div>
                        <br />
                        <div style='padding:6px;color:#8c1f3d;font-size:20px;font-weight:bold;'>Welcome to Medulla Productions!</div>
                        <div style='padding:10px;'>You have now successfully registered on our site</div>
                        <div style='padding:10px;'>
                          <a style='background-color:#8c1f3d;color:white;padding:7px 15px;border-radius:4px;font-size:14px;text-underline-position:under;' href=${link}>CLICK HERE TO CONFIRM YOUR REGISTRATION</a>
                        </div>
                        <div style='padding:6px;'>We are excited to work with you on our future projects!</div>
                        <br />

                        <div class="signature" style="line-height:1.5;">
                          <div style='padding:0 6px;'>Best regards, </div>
                          <div style='padding:0 6px;'><b>Ursula Manvatkar</b> </div>
                          <div style='padding:0 6px;'>Managing Director - Medulla Productions </div>
                          <div style='padding:0 6px;'>www.medullaproductions.com</div>
                        </div>
                        <br />
                        
                        <div class="footer-copyright" style='padding:12px; background-color: white; color:#6f7571; text-align: center; border-radius: 6px;'>
                          <nav class="navbar" style='justify-content: center;'>
                            <div class="navbar-nav">
                              <div style="margin-top:1rem;">
                                <a href="https://www.facebook.com/MedullaME/" target="_blank" style="font-size:unset;padding:10px;text-decoration:none;">
                                  <img src="${config.baseUrl}/assets/img/facebookIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                </a>
                                <a href="https://www.youtube.com/channel/UCCkm0q2N53D-TBgf-fGoJhA" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                  <img src="${config.baseUrl}/assets/img/youtubeIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                </a>
                                <a href="https://www.instagram.com/medullauae/" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                  <img src="${config.baseUrl}/assets/img/instagramIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                </a>
                              </div>
                            </div>
                          </nav>
                          <p style='margin-bottom:0.85rem;margin-top:0.85rem;color:#8c1f3d;'>
                            &#169; Medulla Productions & Consulting LLC <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> Sharjah Media City - UAE 
                            <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> <a target="_blank" href="tel:+971529800191" style='color:#8c1f3d;'>+971 52 980 0191</a>
                          </p>
                          <p style='color:#6f7571;padding:15px;padding-bottom:0;font-size:12px;line-height:1.25;'>
                            This is an e-mail from Medulla Productions. Its contents are confidential to the intended recipient. If you are not the intended recipient, be advised that you have received this e-mail in error and that any use, dissemination, forwarding,
                            printing or copying of this e-mail is strictly prohibited. It may not be disclosed to or used by anyone other than its intended recipient, nor may it be copied in any way. If received in error please email a reply to the sender, then delete it
                            from your system. Although this e-mail has been scanned for viruses, Medulla Productions cannot accept any responsibility for viruses and it is your responsibility to scan any attachments
                          </p>
                        </div>
                      </div>
                    </div>
                </body>
                </html>
                  `;

      if(user.role.toLowerCase()==='client') {
        html=['<div>','Login details','</br>',`username: ${user.email}`,'</br>',`password: ${req.body.password}`,'</div>'].join("\n");
      }

      mailData={
        "to": user.email,
        "subject": user.role.toLowerCase()==='client'? "Login details":"Account confirmation",
        "text": user.role.toLowerCase()==='client'? "Login details":"Account confirmation",
        "html": html
      };

      mailService(mailData).then(function() {
        res.status(200).json({
          status: "success",
          statusCode: 200,
          message: "User registerd successfully and verfication email sent to registered mail."
        });
      }).catch(async err => {
        await user.destroy();
        await profile.destroy();
        console.log(err)
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: err
        });
      });
    }
  } catch(err) {
    console.log(err)
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }

});

/**
 * user image upload
 */
router.post('/user/image',auth.required,imageFile,async function(req,res) {
  try {
    let filePath=config.baseUrl+'/files'+req.file.path.split('files')[1];
    var record=await db.User.update({image: filePath,updatedDate: date.currentDate},{where: {uuid: req.payload.id}});
    var profileImage=await db.Profile.update({image: filePath,updatedDate: date.currentDate},{where: {userId: req.payload.id}});
    res.status(200).json({
      message: "imgae uploaded",
      status: "success",
      filePath: filePath,
      statusCode: 200
    });
  } catch(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }
});

//Activate account
router.put('/user/account-status',async function(req,res) {
  try {
    let userId=req.body.userId? req.body.userId:null;
    var record=await db.User.update({active: true,updatedDate: date.currentDate},{where: {uuid: userId}});
    res.status(200).json({
      message: "success",
      status: "success",
      statusCode: 200
    });
  } catch(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }
});

/**
 * Get all the users
 */
router.get('/users',auth.required,async function(req,res) {
  db.User.findAll({
    where: {role: 'user',active: true},
    attributes: ['email','firstName','lastName','uuid','premium']
  }).then(function(users) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: users
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * Update the user premium
 */
router.put('/user/premium/:id',auth.required,async function(req,res) {
  let body={premium: true};

  db.User.update(body,{
    where:
    {
      uuid: req.params.id
    }
  }).then(function(user) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: 'user premium updated'
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * Get all the clients
 */
router.get('/clients',auth.required,async function(req,res) {
  db.User.findAll({
    where: {role: 'client'},
    attributes: ['email','firstName','lastName','hash','salt','companyOrAgencyName','uuid']
  }).then(function(clients) {
    let data=clients.map(function(client) {
      let obj={};
      obj.email=client.email;
      obj.firstName=client.firstName;
      obj.lastName=client.lastName;
      obj.password=crypto.decrypt(client.hash,client.salt);
      obj.companyOrAgencyName=client.companyOrAgencyName;
      obj.uuid=client.uuid;
      return obj;
    });
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: data
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * Update the client info
 */
router.put('/clients/:id',auth.required,async function(req,res) {
  let body=req.body;
  body.updatedDate=date.currentDate;
  db.User.update(body,{
    where:
    {
      uuid: req.params.id
    }
  }).then(function(user) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: 'client data updated'
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * Delete the client
 */
router.delete('/clients/:id',auth.required,async function(req,res) {
  db.User.destroy({
    where:
    {
      uuid: req.params.id
    }
  }).then(function(user) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: 'client deleted'
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * change password
 */
router.put('/user/changepassword',auth.required,function(req,res) {
  var id=req.payload.id;
  db.User.findOne({
    where: {
      uuid: id
    }
  })
    .then(function(user) {
      if(user) {
        var hash=crypto.encrypt(req.body.oldPassword,user.salt);
        if(hash==user.hash) {
          //update record
          user.hash=crypto.encrypt(req.body.newPassword,user.salt);
          user.save();
          res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Password updated Successfully"
          });
        } else {
          res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Your old password is incorrect"
          });
        }

      } else {
        res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Unable to update password"
        });
      }
    }).catch(err => {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: err
      });
    })
});

/**
 * Forgot password
 */
router.put('/users/forgotpassword',function(req,res) {
  var email=req.body.email;
  db.User.findOne({
    where: {
      email: email
    }
  })
    .then(function(user) {
      if(user) {
        var newPassword=Math.random().toString(36).substring(7);
        user.hash=crypto.encrypt(newPassword,user.salt,10000,512,'sha512').toString('hex');

        let html=`
          <!DOCTYPE html>
          <html lang="en">
              <head>
                  <link rel="preconnect" href="https://fonts.gstatic.com">
                  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet">
              </head>
              <body style="font-family:'Ubuntu', sans-serif;">
                  <div id="container">
                      <div style='padding:14px; background-color: #faf7f7; width: 100%; border-radius: 6px;'>
                          <div style="padding:6px;"> Dear <b>${user.firstName} ${user.lastName}</b>,</div>
                          <br />
                          <div style='padding:10px 6px;line-height:1.5;'>We received a request for resetting your password. Your temporary password is <b><u>${newPassword}</u></b>.<br> This is valid only for 5 minutes. Kindly change the password from after you have logged in</div>
                          <br />
                          <div style='padding:10px 6px;'>Please ignore if you have not sent this request.</div>
                          <br />

                          <div class="signature" style="line-height:1.5;">
                              <div style='padding:0 6px;'>Best regards, </div>
                              <div style='padding:0 6px;'><b>Ursula Manvatkar</b> </div>
                              <div style='padding:0 6px;'>Managing Director - Medulla Productions </div>
                              <div style='padding:0 6px;'>www.medullaproductions.com</div>
                          </div>
                          <br />                          
                          <div style='padding:10px;font-size:14px;line-height:1.5;font-style:italic;'>If the temporary password is not available then please use the link redirecting to the registration page where the user can be verified and change the password. Upto you.</div>

                          <div class="footer-copyright" style='padding:12px; background-color: white; color:#6f7571; text-align: center; border-radius: 6px;'>
                              <nav class="navbar" style='justify-content: center;'>
                                  <div class="navbar-nav">
                                      <div style="margin-top:1rem;">
                                          <a href="https://www.facebook.com/MedullaME/" target="_blank" style="font-size:unset;padding:10px;text-decoration:none;">
                                              <img src="${config.baseUrl}/assets/img/facebookIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                          </a>
                                          <a href="https://www.youtube.com/channel/UCCkm0q2N53D-TBgf-fGoJhA" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                              <img src="${config.baseUrl}/assets/img/youtubeIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                          </a>
                                          <a href="https://www.instagram.com/medullauae/" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                              <img src="${config.baseUrl}/assets/img/instagramIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                          </a>
                                      </div>
                                  </div>
                              </nav>
                              <p style='margin-bottom:0.85rem;margin-top:0.85rem;color:#8c1f3d;'>
                                  &#169; Medulla Productions & Consulting LLC <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> Sharjah Media City - UAE
                                  <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> <a target="_blank" href="tel:+971529800191" style='color:#8c1f3d;'>+971 52 980 0191</a>
                              </p>
                              <p style='color:#6f7571;padding:15px;padding-bottom:0;font-size:12px;line-height:1.25;'>
                                  This is an e-mail from Medulla Productions. Its contents are confidential to the intended recipient. If you are not the intended recipient, be advised that you have received this e-mail in error and that any use, dissemination, forwarding,
                                  printing or copying of this e-mail is strictly prohibited. It may not be disclosed to or used by anyone other than its intended recipient, nor may it be copied in any way. If received in error please email a reply to the sender, then delete it
                                  from your system. Although this e-mail has been scanned for viruses, Medulla Productions cannot accept any responsibility for viruses and it is your responsibility to scan any attachments
                              </p>
                          </div>
                      </div>
                  </div>
              </body>
          </html>
        `;

        //send mail
        mailData={
          "to": email,
          "subject": "Medulla Productions - Reset Password",
          "text": "Forgot Email",
          "html": html
        };
        mailService(mailData).then(function() {
          user.save();
          res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "New Password sent to your mailID"
          });
        }).catch(err => {
          res.status(400).json({
            err: err,
            statusCode: 400,
            message: "Error while sending an email"
          });
        });

      } else {
        res.json({
          message: "Can't find email address"
        });
      }
    }).catch(err => {
      res.json(err);
    })
});

/**
 * Get the user info
 */
router.get('/user/details',auth.required,function(req,res,next) {
  db.User.find({
    where: {uuid: req.payload.id},
    attributes: ['email','firstName','lastName','role','image']
  }).then(function(user) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: user
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * To get the user profile
 */
router.get('/user/profile',auth.required,function(req,res,next) {
  db.Profile.find({
    where: {userId: req.payload.id}
  }).then(function(user) {
    // let category = '';
    // if(user.categories){
    //   let datacategory = JSON.parse(user.categories);
    //   let lengtCategory = datacategory.length;
    //   let count = 1
    //   datacategory.forEach(function (value) {
    //     if(count == lengtCategory){
    //       category += `${value}`;
    //     }
    //     else{
    //       category += `${value}, `;
    //     }
    //     count++;
    //   });
    // }

    // user.categories = category
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: user,
    });
  }).catch(function(err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * To create the user profile
 */
router.post('/user/profile',auth.required,async function(req,res) {
  try {
    var record=await db.Profile.create(req.body);
    res.status(200).json({
      message: "profile created successfully",
      status: "success",
      statusCode: 200
    });
  } catch(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }
});


/**
 * To update the user profile
 */
router.put('/user/profile',auth.required,async function(req,res) {
  try {
    var body=req.body;
    // users = await db.Profile.findOne({
    //   where: { userId: req.payload.id }
    // });
    // if(Object.prototype.toString.call(body.categories) !== '[object Array]'){
    //    body.categories = JSON.parse(users.categories);
    // }
    // if(Object.prototype.toString.call(body.languages) !== '[object Array]'){
    //   body.languages = JSON.parse(users.languages);
    // }
    // if(Object.prototype.toString.call(body.singing) !== '[object Array]'){
    //   body.singing = JSON.parse(users.singing);
    // }
    // if(Object.prototype.toString.call(body.instruments) !== '[object Array]'){
    //   body.instruments = JSON.parse(users.instruments);
    // }
    // if(Object.prototype.toString.call(body.vocalRange) !== '[object Array]'){
    //   body.vocalRange = JSON.parse(users.vocalRange);
    // }


    // if(Object.prototype.toString.call(body.waterSports) !== '[object Array]'){
    //   body.waterSports = JSON.parse(users.waterSports);
    // }
    // if(Object.prototype.toString.call(body.winterSports) !== '[object Array]'){
    //   body.winterSports = JSON.parse(users.winterSports);
    // }
    // if(Object.prototype.toString.call(body.gymnastics) !== '[object Array]'){
    //   body.gymnastics = JSON.parse(users.gymnastics);
    // }
    // if(Object.prototype.toString.call(body.teamSports) !== '[object Array]'){
    //   body.teamSports = JSON.parse(users.teamSports);
    // }
    // if(Object.prototype.toString.call(body.miscSports) !== '[object Array]'){
    //   body.miscSports = JSON.parse(users.miscSports);
    // }
    // if(Object.prototype.toString.call(body.swimming) !== '[object Array]'){
    //   body.swimming = JSON.parse(users.swimming);
    // }
    // if(Object.prototype.toString.call(body.trackAndField) !== '[object Array]'){
    //   body.trackAndField = JSON.parse(users.trackAndField);
    // }
    // if(Object.prototype.toString.call(body.cycling) !== '[object Array]'){
    //   body.cycling = JSON.parse(users.cycling);
    // }


    body.updatedDate=date.currentDate;
    var record=await db.Profile.update(body,{where: {userId: req.payload.id}});
    res.status(200).json({
      record: "profile updated successfully",
      status: "success",
      statusCode: 200
    });
  } catch(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }
});




/**
 * Job creation
 */
router.post('/jobs',async function(req,res) {
  try {
    var body=req.body;
    body.createdDate=date.currentDate;
    body.updatedDate=date.currentDate;
    var job=await db.Jobs.create(body,{include: [{model: db.jobRoles,as: 'roles'}]});

    res.status(200).json({
      data: job,
      message: "Job created successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * Job image upload
 */
router.post('/jobs/image/:id',auth.required,jobImage,async function(req,res) {
  try {
    let jobId=req.params.id;
    let filePath=config.baseUrl+'/files/defaultJob.jpg';
    if(req.file) {
      filePath=config.baseUrl+'/files'+req.file.path.split('files')[1];
    }

    var job=await db.Jobs.update({image: filePath,updatedDate: date.currentDate},{where: {id: jobId}});

    res.status(200).json({
      message: "Job image updated successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * getting jobs by post
 */
router.post('/getJobs',async function(req,res) {
  try {
    let id=req.query.id? req.query.id:0;
    let clientEmail=req.query.clientEmail? req.query.clientEmail:null;
    let duration=req.query.duration? req.query.duration:null;
    let query={include: [{model: db.jobRoles,as: 'roles'}]};
    let userId=req.query.userId? req.query.userId:null;

    let categories=req.body.categories||[];

    let location=req.body.location||'';
    let gender=req.body.gender||'';

    let filters={};


    if(id) filters.id=id;
    if(clientEmail) filters.clientEmail=clientEmail;
    if(duration) filters.createdDate=duration=="week"? {[db.Op.gte]: date.week}:{[db.Op.gte]: date.month};

    if(categories.length) filters.category=categories;
    if(location!=='') {
      filters.location=location;
    }

    if(Object.keys(filters).length) query.where=filters;

    query.order=[['TITLE','ASC']];
    if(query) {
      var job=await db.Jobs.findAll(query);
    }
    else {
      var job=await db.Jobs.findAll();
    }

    if(gender!=='') {
      let final_job=[];
      job.forEach(r => {
        if(r.roles[0].gender===gender) {
          final_job.push(r);
        }
      })

      job=final_job;
    }


    if(userId&&job.length) {
      var applied=await db.jobApplications.findAll({where: {jobId: id,userId: userId}});
      applied.forEach(a => {
        job[0].roles.forEach(r => {
          if(r.id===a.dataValues.roleId) {
            r.dataValues.applied=true;
          }
        })
      });
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: job
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * getting jobs
 */
router.get('/jobs',async function(req,res) {
  try {
    let id=req.query.id? req.query.id:0;
    let clientEmail=req.query.clientEmail? req.query.clientEmail:null;
    let duration=req.query.duration? req.query.duration:null;
    let query={include: [{model: db.jobRoles,as: 'roles'}]};
    let userId=req.query.userId? req.query.userId:null;
    let category=req.query.category? req.query.category:null;
    let filters={};


    if(id) filters.id=id;
    if(category) filters.category=category;
    if(clientEmail) filters.clientEmail=clientEmail;
    if(duration) filters.createdDate=duration=="week"? {[db.Op.gte]: date.week}:{[db.Op.gte]: date.month};
    if(Object.keys(filters).length) query.where=filters;

    var job=await db.Jobs.findAll(query);

    if(userId&&job.length) {
      var applied=await db.jobApplications.findAll({where: {jobId: id,userId: userId}});
      applied.forEach(a => {
        job[0].roles.forEach(r => {
          if(r.id===a.dataValues.roleId) {
            r.dataValues.applied=true;
          }
        })
      });
    }
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: job
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * updating the job details by id
 */
router.put('/jobs/:id',async function(req,res) {
  try {
    var body=req.body;
    body.updatedDate=date.currentDate;
    var jobs=await db.Jobs.update(body,{where: {id: req.params.id}});
    var roles=await db.jobRoles.bulkCreate(body.roles,{updateOnDuplicate: []});

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Job updated sucessfully"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * creating the job roles details by id
 */
router.post('/jobs/roles',async function(req,res) {
  try {
    var body=req.body||{};
    var role=await db.jobRoles.create(body);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Job role created sucessfully"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * updating the job roles details by id
 */
router.put('/jobs/roles/:id',async function(req,res) {
  try {
    var body=req.body;
    var role=await db.jobRoles.update(body,{where: {id: req.params.id}});

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Job role updated sucessfully"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * deleting the job by id
 */
router.delete('/jobs/:id',async function(req,res) {
  try {
    var jobs=await db.Jobs.destroy({where: {id: req.params.id}});

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Job deleted successfully"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * deleting the job role by roleId
 */
router.delete('/jobs/role/:id',async function(req,res) {
  try {
    var jobs=await db.jobRoles.destroy({where: {id: req.params.id}});

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Job role deleted successfully"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * userJobs
 */
router.get('/user/jobs',auth.required,async function(req,res) {
  try {
    let jobs=await db.jobApplications.findAll({attributes: ['jobId','roleId'],where: {userId: req.payload.id}});
    let jobIds=jobs.map(obj => obj.jobId);
    let userJobs=await db.Jobs.findAll({where: {id: {[db.Op.in]: jobIds}},include: [{model: db.jobRoles,as: 'roles'}]});

    jobs.forEach((e) => {
      userJobs.forEach((u) => {
        u.roles.forEach((r) => {
          if(r.id===e.roleId) {
            r.dataValues.applied=true;
          }
        });
      })
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      jobs: userJobs
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * clientJobs
 */
router.get('/client/jobs',auth.required,async function(req,res) {
  try {
    let client=await db.User.findOne({attributes: ['email','role'],where: {uuid: req.payload.id}});
    if(client&&client.role=='client') {
      let clientJobs=await db.Jobs.findAll({where: {clientEmail: client.email},include: [{model: db.jobRoles,as: 'roles'}]});
      res.status(200).json({
        status: "success",
        statusCode: 200,
        jobs: clientJobs
      });
    } else {
      res.status(400).send({err: 'Not a Registered client',message: 'Not a Registered client'});
    }
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * Job apply
 */
router.post('/job/application',auth.required,async function(req,res) {
  try {
    let body=req.body;
    let userId=req.payload.id;
    body.userId=userId;
    body.createdDate=date.currentDate;
    body.updatedDate=date.currentDate;

    let user=await db.User.find({
      where: {uuid: userId},
      attributes: ['premium']
    });
    const premium=user.premium;
    if(!premium) {
      let query=`select count(*) as count from job_applications where userId=${userId} and created_date between '${date.startDate}' and '${date.currentDate}'`;
      let jobApplicationCount=await db.sequelize.query(query,{type: db.Sequelize.QueryTypes.SELECT});
      if(jobApplicationCount.length&&jobApplicationCount[0].count>=2) throw 'Not a premium user & Already applied 2 jobs ';
    }
    let jobApplication=await db.jobApplications.create(body);

    res.status(200).json({
      data: jobApplication,
      message: "Job Applied successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * Job apply notification
 */
router.put('/job/application/notification',auth.required,async function(req,res) {
  try {
    let body=req.body;
    let rejectedMails=[];
    for(let i=0;i<body.length;i++) {
      let obj=body[i];
      let data={};
      data.notification=obj.notification;
      data.updatedDate=date.currentDate;

      let user=await db.User.findOne({where: {uuid: obj.userId}});
      let job=await db.Jobs.findOne({where: {id: obj.jobId}});

      if(user) {
        //let html = `<h1>Job Notification</h1>`;
        let html=`
          <!DOCTYPE html>
          <html lang="en">
              <head>
                  <link rel="preconnect" href="https://fonts.gstatic.com">
                  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet">
              </head>
              <body style="font-family:'Ubuntu', sans-serif;">
                  <div id="container">
                      <div style='padding:14px; background-color: #faf7f7; width: 100%; border-radius: 6px;'>
                          <div style='padding:10px 6px;line-height:1.5;'>
                              Dear <b>${user.firstName} ${user.lastName},</b>
                          </div>
                          <div style='padding:10px 6px;line-height:1.5;'>
                            Congratulations!<br>
                            You have been shortlisted for the job ${job.title}<br>
                            Our representatives will be in touch with you shortly for next steps.<br>
                            We look forward to working with you!
                          </div>
                          <br />

                          <div class="signature" style="line-height:1.5;">
                              <div style='padding:0 6px;'>Best regards, </div>
                              <div style='padding:0 6px;'><b>Ursula Manvatkar</b> </div>
                              <div style='padding:0 6px;'>Managing Director - Medulla Productions </div>
                              <div style='padding:0 6px;'>www.medullaproductions.com</div>
                          </div>
                          <br />
                          <div class="footer-copyright" style='padding:12px; background-color: white; color:#6f7571; text-align: center; border-radius: 6px;'>
                              <nav class="navbar" style='justify-content: center;'>
                                  <div class="navbar-nav">
                                      <div style="margin-top:1rem;">
                                          <a href="https://www.facebook.com/MedullaME/" target="_blank" style="font-size:unset;padding:10px;text-decoration:none;">
                                              <img src="${config.baseUrl}/assets/img/facebookIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                          </a>
                                          <a href="https://www.youtube.com/channel/UCCkm0q2N53D-TBgf-fGoJhA" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                              <img src="${config.baseUrl}/assets/img/youtubeIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                          </a>
                                          <a href="https://www.instagram.com/medullauae/" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                              <img src="${config.baseUrl}/assets/img/instagramIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                          </a>
                                      </div>
                                  </div>
                              </nav>
                              <p style='margin-bottom:0.85rem;margin-top:0.85rem;color:#8c1f3d;'>
                                  &#169; Medulla Productions & Consulting LLC <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> Sharjah Media City - UAE
                              <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> <a target="_blank" href="tel:+971529800191" style='color:#8c1f3d;'>+971 52 980 0191</a>
                              </p>
                              <p style='color:#6f7571;padding:15px;padding-bottom:0;font-size:12px;line-height:1.25;'>
                                  This is an e-mail from Medulla Productions. Its contents are confidential to the intended recipient. If you are not the intended recipient, be advised that you have received this e-mail in error and that any use, dissemination, forwarding,
                                  printing or copying of this e-mail is strictly prohibited. It may not be disclosed to or used by anyone other than its intended recipient, nor may it be copied in any way. If received in error please email a reply to the sender, then delete it
                                  from your system. Although this e-mail has been scanned for viruses, Medulla Productions cannot accept any responsibility for viruses and it is your responsibility to scan any attachments
                              </p>
                          </div>
                      </div>
                  </div>
              </body>
          </html>
        `;
        let mailData={
          "to": user.email,
          "subject": `Shortlisted for ${job.title}`,
          "text": "Job Notification",
          "html": html
        };
        try {
          await mailService(mailData);

          let jobApplication=await db.jobApplications.update(data,{
            where:
            {
              id: obj.id
            }
          });
        } catch(e) {
          rejectedMails.push(mailData.to);
          console.log(e);
        }
      }

    }

    if(rejectedMails.length) {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        message: err
      });
    }

    res.status(200).json({
      message: "Notification sent successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * job selection
 */
router.post('/job/application/selection',auth.required,async function(req,res) {
  try {
    let body=req.body;
    // let data = await  db.jobApplications.bulkCreate(body, {updateOnDuplicate: ['id','userId', 'jobId', 'roleId']});
    //let data = await updateSelection(body);

    count = 0;
    body.forEach(async obj => {
      let data={};
      data.selected=obj.selected;
      data.updatedDate=date.currentDate;

      await db.jobApplications.update(data,{
        where: { id: obj.id }
      });
      
      if(obj.selected && count === 0){
        let jobApp = await db.jobApplications.findOne({where: {id: obj.id}});
        let jobDetails = await db.Jobs.findOne({where: {id: jobApp.jobId}});
        let clientDetails = await db.User.findOne({where: {email: jobDetails.clientEmail}});
        
        //send mail
        if(clientDetails){
            let html=`
              <!DOCTYPE html>
              <html lang="en">
                  <head>
                      <link rel="preconnect" href="https://fonts.gstatic.com">
                      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet">
                  </head>
                  <body style="font-family:'Ubuntu', sans-serif;">
                      <div id="container">
                          <div style='padding:14px; background-color: #faf7f7; width: 100%; border-radius: 6px;'>
                              <div style="padding:6px;"><b>Hello!</b></div>
                              <br />
                              <div style='padding:10px 6px;line-height:1.5;'>
                                  The Client <b>${clientDetails.firstName} ${clientDetails.lastName}</b> would like to book some talents for their Job# ${jobApp.jobId} - ${jobDetails.title}.
                              </div>
                              <div style='padding:10px 6px;'>Please get in touch with them on <b>( ${clientDetails.email} / ${clientDetails.agentContact? clientDetails.agentContact:''} )</b> to complete the booking.</div>
                              <div style='padding:10px 6px;'><a href='${config.baseUrl}/job/${jobApp.jobId}'>click here to view booked profiles</a></div>
                              <br />

                              <div class="signature" style="line-height:1.5;">
                                  <div style='padding:0 6px;'>Best regards, </div>
                                  <div style='padding:0 6px;'><b>Ursula Manvatkar</b> </div>
                                  <div style='padding:0 6px;'>Managing Director - Medulla Productions </div>
                                  <div style='padding:0 6px;'>www.medullaproductions.com</div>
                              </div>
                              <br />

                              <div class="footer-copyright" style='padding:12px; background-color: white; color:#6f7571; text-align: center; border-radius: 6px;'>
                                  <nav class="navbar" style='justify-content: center;'>
                                      <div class="navbar-nav">
                                          <div style="margin-top:1rem;">
                                              <a href="https://www.facebook.com/MedullaME/" target="_blank" style="font-size:unset;padding:10px;text-decoration:none;">
                                                  <img src="${config.baseUrl}/assets/img/facebookIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                              </a>
                                              <a href="https://www.youtube.com/channel/UCCkm0q2N53D-TBgf-fGoJhA" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                                  <img src="${config.baseUrl}/assets/img/youtubeIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                              </a>
                                              <a href="https://www.instagram.com/medullauae/" target="_blank" style="font-size:unset;padding:10px;padding-left:20px;text-decoration:none;">
                                                  <img src="${config.baseUrl}/assets/img/instagramIcon.png" style="width:30px;height:30px;border-radius:2px;" />
                                              </a>
                                          </div>
                                      </div>
                                  </nav>
                                  <p style='margin-bottom:0.85rem;margin-top:0.85rem;color:#8c1f3d;'>
                                      &#169; Medulla Productions & Consulting LLC <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> Sharjah Media City - UAE
                                  <span style='margin-left: 0.5rem; margin-right: 0.5rem;'>|</span> <a target="_blank" href="tel:+971529800191" style='color:#8c1f3d;'>+971 52 980 0191</a>
                                  </p>
                                  <p style='color:#6f7571;padding:15px;padding-bottom:0;font-size:12px;line-height:1.25;'>
                                      This is an e-mail from Medulla Productions. Its contents are confidential to the intended recipient. If you are not the intended recipient, be advised that you have received this e-mail in error and that any use, dissemination, forwarding,
                                      printing or copying of this e-mail is strictly prohibited. It may not be disclosed to or used by anyone other than its intended recipient, nor may it be copied in any way. If received in error please email a reply to the sender, then delete it
                                      from your system. Although this e-mail has been scanned for viruses, Medulla Productions cannot accept any responsibility for viruses and it is your responsibility to scan any attachments
                                  </p>
                              </div>
                          </div>
                      </div>
                  </body>
              </html>
            `;

            mailData={
              "to": 'ursula@medullame.com',
              "subject": `Congrats! You have a booking for Job #${jobApp.jobId} - ${jobDetails.title}`,
              "text": "Talent Booked",
              "html": html
            };
            await mailService(mailData).then(function() {
              console.log('email send')
            }).catch(err => {
              res.status(400).json({
                err: err,
                statusCode: 400,
                message: "Error while sending an email"
              });
            });

            count++;
        }
      }

    });
    res.status(200).json({
      data: [],
      message: "candidate selected",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * users applied for jobs
 */
router.get('/job-applicants',auth.required,async function(req,res) {
  try {
    let users=await db.jobApplications.findAll({attributes: ['userId','notification','selected','id'],where: {jobId: req.query.jobId,roleId: req.query.roleId}});
    let userIds=users.map(obj => obj.userId);
    let userDetails=await db.Profile.findAll({where: {userId: {[db.Op.in]: userIds}}});

    const userProfiles=userDetails.map(obj => {
      let user=obj.dataValues;
      let jobs=users.filter(job => {
        return obj.userId==job.userId;
      });
      user.notification=jobs.length>0? jobs[0].notification:null;
      user.selected=jobs.length>0? jobs[0].selected:null;
      user.appliedId=jobs[0].id;
      return user;
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      jobs: userProfiles
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

router.post('/user/category',auth.required,async function(req,res) {
  try {
    var record=await db.Category.create(req.body);
    res.status(200).json({
      data: record,
      message: "Category created successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

router.get('/job/categories',async function(req,res) {
  try {
    let categories=await db.jobCategories.findAll({});
    res.status(200).json({
      data: categories,
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

router.put('/user/category',auth.required,async function(req,res) {
  try {
    var record=await db.Category.update(req.body,{
      where:
      {
        id: req.payload.id
      }
    });
    res.status(200).json({
      message: "Category updated successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

router.delete('/user/category',auth.required,async function(req,res) {
  try {
    var record=await db.Category.destroy({
      where: {
        id: req.payload.id
      }
    });
    res.status(200).json({
      message: "Category deleted successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err.error
    });
  }
});

router.get('/talents',async function(req,res) {
  try {
    var filters=helpers.getFilters(req);
  } catch(e) {
    console.log(e);
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: e
    });
  }

  //search by name,gender,nationality,location and age
  var query=`SELECT user_id as userId,name,image,about_me as aboutMe, email, phone_number as phoneNumber, professional_details as professionalDetails,
  nationality,gender,location,ethnic_look as ethnicLook, ethnicity, hair_color as hairColor,hair_type as hairType,
  eye_color as eyeColor,height,shoe_size as shoeSize,tshirt_size as tshirtSize,pant_size as pantSize,jacket_size as jacketSize,
  dress_size as dressSize,chest,waist,hips,performance,languages,singing,instruments,dance,
  vocal_range as vocalRange,water_sports as waterSports,winter_sports as winterSports,
  gymnastics,team_sports as teamSports,misc_sports as miscSports,swimming,track_and_field as trackAndField,
  cycling,willing_to_travel as willingToTravel,tattoos,piercings,facial_hair as facialHair,
  wardrobe_items as wardrobeItems,stage_combat_training as stageCombatTraining,martial_arts as martialArts,
  martial_arts_weapons_training as martialArtsWeaponsTraining,general_weapons_training as generalWeaponsTraining,
  special_features as specialFeatures,driving_skills as drivingSkills,improvisation,circus_skills as circusSkills,
  horseRiding_skills as horseRidingSkills,smoking ,miscellaneous_skills as miscellaneousSkills,
  categories,DATE_OF_BIRTH as dateOfBirth, ROUND(DATEDIFF(CURDATE(),DATE_OF_BIRTH)/365) AS age FROM profile ` +filters;

  console.log(query);

  let result=[];

  await db.sequelize.query(query,{type: db.Sequelize.QueryTypes.SELECT}).then(function(data) {
    if(data&&data.length) {
      let categories=req.query.categories!='null'? req.query.categories:[];
      let languages=req.query.languages!='null'? req.query.languages:[];
      if(categories.length||languages.length) {
        for(const detail of data) {
          let included=false;
          if(detail.categories) {
            let datacategory=JSON.parse(detail.categories);
            for(const data2 of datacategory) {
              if(categories.includes(data2)) {
                included=true;
                break;
              }
            };
          }
          if(categories.length&&!included) {
            included=false;
          }
          else if(included&&!languages.length) {
            include=true;
          }
          else {
            included=false;
            if(detail.languages) {
              let datalanguages=JSON.parse(detail.languages);
              for(const data2 of datalanguages) {
                if(languages.includes(data2)) {
                  included=true;
                  break;
                }
              };
            }
          }
          if(included) {
            result.push(detail);
          }
        }
      }
      else {
        result=data;
      }
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: result
    });
  }).catch(function(err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  });
});

/**
 * To get category
 */
router.get('/categories',async function(req,res) {
  db.Category.findAll({
    include: [{model: db.jobCategories,as: 'subCategory'}]
  }).then(data => {
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: data
    });
  }).catch(err => {
    console.log(err)
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

router.get('/categories/profile',async function(req,res) {
  // const reqData = ['Actors','Directors'];
  let reqData=[];
  if(req.query.categories) {
    reqData=req.query.categories;
  }


  let result=[];

  await db.Profile.find().then(user => {
    if(user&&user.categories) {
      let datacategory=JSON.parse(user.categories);

      // datacategory.map(data => {
      for(const data of datacategory) {
        if(reqData.includes(data)) {
          result.push(user);
          break;
        }
      };

    }
  });

  res.status(200).json({
    status: "success",
    statusCode: 200,
    data: result
  });

});


router.get('/user/dropdown',async function(req,res) {
  var type=req.query.type? req.query.type:'all';

  async.parallel({
    appearance: function(callback) {
      if(type==='appearance'||type==='all') {
        db.appearance.findAll({}).then(data => {
          data=data.length>0? data[0]:{};
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,{});
      }
    },
    arts: function(callback) {
      if(type==='arts'||type==='all') {
        db.arts.findAll({}).then(data => {
          data=data.length>0? data[0]:{};
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,{});
      }
    },
    combatTraining: function(callback) {
      if(type==='combatTraining'||type==='all') {
        db.CombatTraining.findAll({}).then(data => {
          data=data.length>0? data[0]:{};
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,{});
      }
    },
    features: function(callback) {
      if(type==='features'||type==='all') {
        db.features.findAll({}).then(data => {
          data=data.length>0? data[0]:{};
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,{});
      }
    },
    languages: function(callback) {
      if(type==='languages'||type==='all') {
        db.Languages.findAll({}).then(data => {
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,[]);
      }
    },
    otherSkills: function(callback) {
      if(type==='otherSkills'||type==='all') {
        db.OtherSkills.findAll({}).then(data => {
          data=data.length>0? data[0]:{};
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,{});
      }
    },
    sports: function(callback) {
      if(type==='sports'||type==='all') {
        db.Sports.findAll({}).then(data => {
          data=data.length>0? data[0]:{};
          callback(null,data);
        }).catch(err => {
          callback(err);
        });
      } else {
        callback(null,{});
      }
    }
  },function(err,results) {
    if(err) {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        message: err
      });
    } else {
      try {
        var data={};
        var arts=JSON.parse(JSON.stringify(results.arts));
        arts.languages=results.languages;

        data.appearance=results.appearance;
        data.arts=arts;
        data.combatTraining=results.combatTraining;
        data.features=results.features;
        data.otherSkills=results.otherSkills;
        data.sports=results.sports;
        data.languages=results.languages;

        res.status(200).json({
          status: "success",
          statusCode: 200,
          data: data
        });
      } catch(e) {
        res.status(400).json({
          status: "error",
          statusCode: 400,
          message: e
        });
      }
    }
  });
});

router.get('/countries',async function(req,res) {
  db.countries.findAll({
  }).then(function(countries) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: countries
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

router.get('/states/:countryId',auth.required,async function(req,res) {
  db.states.findAll({
    where: {country_id: req.params.countryId}
  }).then(function(states) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: states
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

router.get('/cities/:countryName',async function(req,res) {
  let countryName=req.params.countryName;
  let query=`SELECT * FROM cities WHERE state_id IN (SELECT id FROM states WHERE country_id IN (SELECT id FROM countries WHERE name='${countryName}')) order by name asc`;
  db.sequelize.query(query,{type: db.Sequelize.QueryTypes.SELECT}).then(function(states) {
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: states
    });
  }).catch(function(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

router.get('/works', async function(req, res) {
  db.works.findAll().then(data => {
    res.status(200).send({data: data,message: 'success'});
  }).catch(err => {
    res.status(400).send({err: err});
  });
});

router.post('/works',auth.required,async function(req,res) {
  try {
    var works = await db.works.create(req.body);
    res.status(200).json({
      data: works,
      message: "Works created successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

router.delete('/works/:workid',auth.required,async function(req,res) {
  try {
    await db.works.destroy({
      where: {
        id: req.params.workid
      }
    });
    res.status(200).json({
      message: "Category deleted successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err.error
    });
  }
});

router.put('/works/:workid',auth.required,async function(req,res) {
  try {
    var works=await db.works.update(req.body,{
      where:
      {
        id: req.params.workid
      }
    });
    res.status(200).json({
      data: works,
      message: "Works created successfully",
      statusCode: 200,
      status: "success"
    });
  } catch(err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err
    });
  }
});

/**
 * Admin routes 👇
 */

/**
 * To get the user profile via admin
 */
router.get('/user/:userId/profile',auth.required,function(req,res,next) {

  var { userId } = req.params;

  if( userId === null || userId === undefined ) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "UserId not found"
    });
  }

  db.Profile.find({
    where: { userId }
  })
  .then(function(user) {

    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: user,
    });
  })
  .catch(function(err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  });
});

/**
 * To update the user profile via admin
 */
router.put('/user/:userId/profile',auth.required,async function(req,res) {
  try {
    var body = req.body;
    var { userId } = req.params;

    if( userId === null || userId === undefined ) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "UserId not found"
      });
    }

    let profile = await db.Profile.findOne({
      where: { userId }
    });


    if( userId === null || userId === undefined ) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "User not found with specific id"
      });
    }
    
    profile.update(req.body);
    profile.save();
    
    res.status(200).json({
      record: "Profile updated successfully",
      status: "success",
      statusCode: 200
    });
  } catch(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }
});

router.post('/user/:userId/image',auth.required,imageFile,async function(req,res) {
  try {
    var { userId } = req.params;

    if( userId === null || userId === undefined ) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "UserId not found"
      });
    }

    let filePath=config.baseUrl+'/files'+req.file.path.split('files')[1];
    var record=await db.User.update({image: filePath,updatedDate: date.currentDate},{where: { uuid }});
    var profileImage=await db.Profile.update({image: filePath,updatedDate: date.currentDate},{where: { userId }});
    res.status(200).json({
      message: "imgae uploaded",
      status: "success",
      filePath: filePath,
      statusCode: 200
    });
  } catch(err) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err
    });
  }
});

router.post('/user/:userId/portfolio',auth.required,portfolio,async function(req,res,next) {

  var { userId } = req.params;

  if( userId === null || userId === undefined ) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "UserId not found"
    });
  }

  let image=req.files.image? req.files.image:null;
  let video=req.files.video? req.files.video:null;
  let audio=req.files.audio? req.files.audio:null;
  let images=[],videos=[],audios=[];
  let body={};
  try {
    let user=await db.portfolio.findOne({where: { userId }});
    if(image) {
      images=image.map(obj => {
        obj.path=config.baseUrl+'/files'+obj.path.split('files')[1].replace(/\\/g,"/");
        return obj.path;
      });
      if(user&&user.images) {
        if(user.images) {
          getUserImage=JSON.parse(user.images);
          if(getUserImage.length) {
            await getUserImage.forEach(function(value) {
              images=_.uniq(images.concat(value));
            });
            body.images=images
          }
          else {
            body.images=images;
          }

        } else {
          body.images=images;
        }

      } else {
        body.images=images;
      }
      if(body.images.length>10) return res.status(400).send({message: "exceeded maximum range",limit: 10,previous: user.images.length,current: images.length});
    }
    if(video) {
      videos=video.map(obj => {
        obj.path=config.baseUrl+'/files'+obj.path.split('files')[1].replace(/\\/g,"/");
        return obj.path;
      });
      if(user&&user.videos) {
        if(user.videos) {
          data=[{
            'files': videos,
            'description': req.body.description? req.body.description:''
          }]
          videos=data;
          getUserImage=JSON.parse(user.videos);
          if(getUserImage.length) {
            await getUserImage.forEach(function(value) {
              videos=_.uniq(videos.concat(value));
            });
            body.videos=videos;
          }
          else {
            body.videos=videos;
          }

        } else {
          data=[{
            'files': videos,
            'description': req.body.description? req.body.description:''
          }]
          body.videos=data;
        }
      } else {
        data=[{
          'files': videos,
          'description': req.body.description? req.body.description:''
        }]
        body.videos=data;
      }
      if(body.videos>10) return res.status(400).send({message: "exceeded maximum range",limit: 10,previous: user.videos.length,current: videos.length});
    }
    if(audio) {
      audios=audio.map(obj => {
        obj.path=config.baseUrl+'/files'+obj.path.split('files')[1];
        return obj.path;
      });
      if(user&&user.audios) {
        if(user.audios) {
          data=[{
            'files': audios,
            'description': req.body.description? req.body.description:''
          }]
          audios=data;
          getUserImage=JSON.parse(user.audios);
          if(getUserImage.length) {
            await getUserImage.forEach(function(value) {
              audios=_.uniq(audios.concat(value));
            });
            body.audios=audios;
          }
          else {
            body.audios=audios;
          }

        } else {
          data=[{
            'files': audios,
            'description': req.body.description? req.body.description:''
          }]
          body.audios=data;
        }
      } else {
        data=[{
          'files': audios,
          'description': req.body.description? req.body.description:''
        }]
        body.audios=data;
      }
      if(body.audios>10) return res.status(400).send({message: "exceeded maximum range",limit: 10,previous: user.audios.length,current: audios.length});
    }
    if(user) {
      let update=await db.portfolio.update(body,{where: {userId: req.payload.id}});
    } else {
      body.userId=req.payload.id;
      let create=await db.portfolio.create(body);
    }
    res.status(200).send({images: images,videos: videos,audios: audios});
  } catch(err) {
    console.log(err);
    res.status(400).send({err: err});
  }
})

router.get('/portfolio/:userId/counts',auth.required,async function(req,res,next) {
  try {
    let data={
      images: 0,
      videos: 0,
      audios: 0
    };
    var { userId } = req.params;

    if( userId === null || userId === undefined ) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "UserId not found"
      });
    }
     
    let user=await db.User.findOne({where: {uuid: userId},attributes: ['premium']});
    let portfolioRec=await db.portfolio.findOne({where: {userId: userId},attributes: ['images','videos','audios']});

    if(portfolioRec) {
      let {images,videos,audios}=portfolioRec;
      data.images=(JSON.parse(images)||[]).length;
      data.audios=(JSON.parse(audios)||[]).length;
      data.videos=(JSON.parse(videos)||[]).length;
    }
    data.premium=user.premium;
    const {portfolio: {premium,nonPremium}}=config;
    data=data.premium? {...data,...premium}:{...data,...nonPremium};

    res.status(200).send({user: data,message: 'success'});
  } catch(err) {
    res.status(400).send({err: err});
  }
});

router.put('/user/:userId/changepassword',auth.required,function(req,res) {
  var { userId } = req.params;

  if( userId === null || userId === undefined ) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "UserId not found"
    });
  }

  db.User.findOne({
    where: {
      uuid : userId
    }
  })
    .then(function(user) {
      if(user) {
        var hash=crypto.encrypt(req.body.oldPassword,user.salt);
        if(hash==user.hash) {
          //update record
          user.hash=crypto.encrypt(req.body.newPassword,user.salt);
          user.save();
          res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Password updated Successfully"
          });
        } else {
          res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Your old password is incorrect"
          });
        }

      } else {
        res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Unable to update password"
        });
      }
    }).catch(err => {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: err
      });
    })
});

router.put('/user/:userId/update-status',auth.required,async function(req,res,next) {
  try {
    var { userId } = req.params;

    if( userId === null || userId === undefined ) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "UserId not found"
      });
    }
     
    let user = await db.User.findOne({where: { uuid: userId } });
    
    if( user === null || user === undefined ) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "User not found"
      });
    }

    let profile = await db.Profile.findOne({ where: { userId }});

    console.log(profile);
    
    profile.visible = !profile.visible;
    profile.save();


    res.status(200).send({message: 'User profile visibility updated', profile});
  } catch(err) {
    res.status(400).send({err: err});
  }
});


router.post('/user/:userId/portfolio/delete',auth.required,async function(req,res,next) {
  const {type,filePath}=req.body;
  var { userId } = req.params;

  if( userId === null || userId === undefined ) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "UserId not found"
    });
  }
  
  let filePathFinal=filePath;
  let user=await db.portfolio.findOne({where: { userId }});
  // user = (user && user.dataValues) ? user.dataValues : null;
  if(user) {
    files=JSON.parse(user[type])

    if(type=='videos') {
      videoData=[];
      if(files.length>0) {
        datafiles=[];
        await files.forEach(file => {
          if(file.files!=filePath) {
            videoData.push(file);
          }
          datafiles=datafiles.concat(file.files);
        });
        files=datafiles;
      }
    }

    if(type=='audios') {
      filePathFinal=filePath[0];
      audioData=[];
      if(files.length>0) {
        datafiles=[];
        await files.forEach(file => {
          if(file.files!=filePathFinal) {
            audioData.push(file);
          }
          datafiles=datafiles.concat(file.files);
        });
        files=datafiles;
      }
    }

    let index=(files.length)? files.indexOf(filePathFinal):-1;
    if(index==-1) {
      return res.status(400).send({err: 'Invalid userid or filepath'});
    }
    const deleteRec=files.splice(index,1);
    delete files[JSON.stringify(deleteRec)];
    if(type=='images') {
      let update=await db.portfolio.update({images: files},{where: { userId }});
    }
    if(type=='videos') {
      let update=await db.portfolio.update({videos: videoData},{where: { userId }});
    }
    if(type=='audios') {
      let update=await db.portfolio.update({audios: audioData},{where: { userId }});
    }
    filetoDelete=JSON.stringify(deleteRec);
    fileData=filetoDelete.split("files");
    finalFile="./files"+fileData[1].replace('"]','');
    await fs.unlinkSync(finalFile);

    res.status(200).send({status: 'success',message: 'file removed'});
  }
  else {
    return res.status(400).send({err: 'Something went wrong'});
  }

});


var generateJWT=function(_this) {
  var today=new Date();
  var exp=new Date(today);
  exp.setDate(today.getDate()+60);

  return jwt.sign({
    id: _this.uuid,
    role: 1,
    exp: parseInt(exp.getTime()/1000),
  },secret);
};

var toAuthJSON=function(_this) {
  var res={
    email: _this.email,
    role: _this.role,
    userId: _this.uuid,
    firstName: _this.firstName,
    lastName: _this.lastName,
    image: _this.image,
    token: generateJWT(_this)
  };
  return res;
};

module.exports=router;