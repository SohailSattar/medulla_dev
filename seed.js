var db = require('./models')
var data = require("./master-data/seedData.json");
var countries = require('./master-data/nationalities.json');
var states = require('./master-data/states.json');
var cities = require('./master-data/cities.json');
var admin = require('./master-data/admin.json');
var profiles = require('./master-data/profiles.json');
var CRYPTO = require('crypto');
var crypto = require('./config/crypto');
var adminImage = require('./config/adminImage');
var config = require('./config/config')['development'];
var helpers = require('./helpers/apiHelpers');
var date = helpers.currentDate();
var id = 0;
var ethnicity = require('./master-data/ethnicity.json');
var mainCategory = require('./master-data/category.json');

var basicDetals = data.appearance ? data.appearance : {};
var haveTheFollowing = data.features ? data.features : {};
var sports = data.sports ? data.sports : {};
var languages = data.languages ? data.languages : [];
var arts = data.arts ? data.arts : {}
var combatTraining = data.combatTraining ? data.combatTraining : {};
var otherSkills = data.otherSkills ? data.otherSkills : {};
var categories = data.jobCategories ? data.jobCategories : [];

//ethnicity
var Weist = db.ethnicity.bulkCreate(ethnicity.waist);
var Hips = db.ethnicity.bulkCreate(ethnicity.hips);
var Performance = db.ethnicity.bulkCreate(ethnicity.performance);
var Category = db.Category.bulkCreate(mainCategory.main_category);

var basicDetalsData = db.appearance.create(basicDetals);
var haveTheFollowingData = db.features.create(haveTheFollowing);
var sportsData = db.Sports.create(sports);
var languagesData = db.Languages.bulkCreate(languages);
var artData = db.arts.create(arts);
var combatTrainingData = db.CombatTraining.create(combatTraining);
var otherSkillsData = db.OtherSkills.create(otherSkills);
var jobCategories = db.jobCategories.bulkCreate(categories);
var countriesData = db.countries.bulkCreate(countries);
var statesData = db.states.bulkCreate(states);
var citiesData = db.cities.bulkCreate(cities);

      
Promise.all([
    Category,
    Weist,
    Hips,
    Performance,
    basicDetalsData, 
    haveTheFollowingData, 
    sportsData, 
    jobCategories,
    languagesData, 
    artData, 
    combatTrainingData, 
    otherSkillsData, 
    jobCategories, 
    countriesData, 
    countriesData, 
    statesData, 
    citiesData  
]).then(function (values) {
    console.log("***** seed data inserted *****");
    process.exit();
}).catch(function (err) {
    console.log(err);
    process.exit();
});

async function getUserId () {
    try{
        var data = await db.User.findAll({
            attributes: [[db.sequelize.fn('MAX', db.sequelize.col('id')), 'uuid']]
        });
        id = data.length > 0 && data[0].uuid ? data[0].uuid + 1 : 10000;
        console.log('retrieved userId--->', id);
    }catch(err){
        console.log('Error while retrieving userId--->', err);
    }
}

async function createAdmin() {
    try {
        const _admin = admin.map(obj=>{
            let salt = CRYPTO.randomBytes(16).toString('hex');
            let hash = crypto.encrypt(obj.password, salt);
            obj.uuid = id;
            obj.salt = salt;
            obj.hash = hash;
            obj.image = config.defaultDp;
            obj.createdDate = date.currentDate;
            obj.updatedDate = date.currentDate;
            id++;
            return obj;
        })
        db.User.bulkCreate(_admin);
        console.log('admin created');
    }catch(err){
        console.log('Error while creating admin', err);
    }
   
}

async function createUsers() {
    try{
        let data = [];
        let profileData = [];
        profiles.forEach(obj => {
            let salt = CRYPTO.randomBytes(16).toString('hex');
            let hash = crypto.encrypt(obj.password, salt);
            data.push({
                "uuid": id,
                "firstName": obj.firstName,
                "lastName": obj.lastName,
                "email": obj.email,
                "image": config.defaultDp,
                "salt": salt,
                "hash": hash,
                "hearAboutUs": obj.hearAboutUs,
                "active": obj.active,
                "role": obj.role,
                "createdDate": date.currentDate,
                "updatedDate": date.currentDate
              });
              obj.userId = id;
              obj.image =config.defaultDp;
              obj.name = obj.firstName + ' ' + obj.lastName;
              obj.createdDate = obj.currentDate;
              obj.updatedDate = obj.currentDate;
              profileData.push(obj);
              id++;
        });
        let userData = await db.User.bulkCreate(data);
        console.log('Users created successfully');
        let profile = await db.Profile.bulkCreate(profileData);
        console.log('Profiles created successfully');
    }catch(err){
        console.log('Error while creating Profiles', err);
    }
}

async function doProcess(){
    await getUserId();
    await createAdmin();
    //await createUsers();
}

doProcess();