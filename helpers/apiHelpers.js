let moment = require('moment');
exports.getFilters = function(req){
    let filters = '';
    let sortBy = req.query.sortBy;
    let order = req.query.order ? req.query.order : null;
    let gender = req.query.gender !== 'null' ? req.query.gender : null;
    let ageTo = req.query.ageTo !== 'null' ? req.query.ageTo : 100;
    let ageFrom = req.query.ageFrom !== 'null' ? req.query.ageFrom : 0;
    let ethnicLook = req.query.ethnicLook !== 'null' ? req.query.ethnicLook : null;
    let hairColor = req.query.hairColor !== 'null' ? req.query.hairColor : null;
    let hairType = req.query.hairType !== 'null' ? req.query.hairType : null;
    let eyeColor = req.query.eyeColor !== 'null' ? req.query.eyeColor : null;
    let age = ` ROUND(DATEDIFF(CURDATE(),DATE_OF_BIRTH)/365) BETWEEN ${ageFrom} AND ${ageTo}`;
    // let height = heightRange.length ? ` height BETWEEN ${heightRange[0]} AND ${heightRange[1]}` : '';

    // let genders = gender.length ? "('" + gender.toString().replace(/,/g,"','") + "')" : null;
    // let ethnicLooks = ethnicLook.length ? "('" + ethnicLook.toString().replace(/,/g,"','") + "')" : null;
    // let hairColors = hairColor.length ? "('" + hairColor.toString().replace(/,/g,"','") + "')" : null;
    // let hairTypes = hairType.length ? "('" + hairType.toString().replace(/,/g,"','") + "')" : null;
    // let eyeColors = eyeColor.length ? "('" + eyeColor.toString().replace(/,/g,"','") + "')" : null;

    let genders = gender ? "('" + gender.toString() + "')" : null;
    let ethnicLooks = ethnicLook ? "('" + ethnicLook.toString() + "')" : null;
    let hairColors = hairColor ? "('" + hairColor.toString() + "')" : null;
    let hairTypes = hairType ? "('" + hairType.toString() + "')" : null;
    let eyeColors = eyeColor ? "('" + eyeColor.toString() + "')" : null;

    filters = req.query.nameOrId !== 'null' ? ` (name like '%${req.query.nameOrId}%' or user_id like '%${req.query.nameOrId}%' )` : '';
    // filters = (filters.length > 0 && gender.length) ? (filters + ` and gender IN ${genders}`) : 
    //                (gender.length ? ` gender IN ${genders}` : filters);
    // filters = (filters.length > 0 && req.query.nationality) ? (filters + ` and nationality='${req.query.nationality}'`) : 
    //                (req.query.nationality ? ` nationality='${req.query.nationality}'` : filters);
    // filters = (filters.length > 0 && req.query.location) ? (filters + ` and location='${req.query.location}'`) : 
    //                (req.query.location ? ` location='${req.query.location}'` : filters);
    // filters = (filters.length > 0 && ethnicLook.length) ? (filters + ` and ethnic_look IN ${ethnicLooks}`) : 
    //                (ethnicLook.length ? ` ethnic_look IN ${ethnicLooks}` : filters);
    // filters = (filters.length > 0 && hairColor.length) ? (filters + ` and hair_color IN ${hairColors}`) : 
    //                (hairColor.length ? ` hair_color IN ${hairColors}` : filters);
    // filters = (filters.length > 0 && hairType.length) ? (filters + ` and hair_type IN ${hairTypes}`) : 
    //                (hairType.length ? ` hair_type IN ${hairTypes}` : filters);
    // filters = (filters.length > 0 && eyeColor.length) ? (filters + ` and eye_color IN ${eyeColors}`) : 
    //                (eyeColor.length ? ` eye_color IN ${eyeColors}` : filters);
    // filters = (filters.length > 0 && age.length > 0) ? (filters + ` and` + age) :
    //                (age.length > 0 ? age : filters);
    // filters = (filters.length > 0 && height.length > 0) ? (filters + ` and` + height) :
   	// 			(height.length > 0 ? height : filters);
    // filters = filters.length > 0 ? ' where '+filters : '';
    filters = (filters.length > 0 && gender) ? (filters + ` and gender IN ${genders}`) : 
                   (gender ? ` gender IN ${genders}` : filters);
    // filters = (filters.length > 0 && req.query.nationality) ? (filters + ` and nationality='${req.query.nationality}'`) : 
    //                (req.query.nationality ? ` nationality='${req.query.nationality}'` : filters);
    filters = (filters.length > 0 && req.query.location !== 'null') ? (filters + ` and location='${req.query.location}'`) : 
                   (req.query.location !== 'null' ? ` location='${req.query.location}'` : filters);
    // filters = (filters.length > 0 && req.query.languages !== 'null') ? (filters + ` and languages='${req.query.languages}'`) : 
    //                (req.query.languages !== 'null' ? ` location='${req.query.languages}'` : filters);               
    filters = (filters.length > 0 && ethnicLook) ? (filters + ` and ethnic_look IN ${ethnicLooks}`) : 
                   (ethnicLook ? ` ethnic_look IN ${ethnicLooks}` : filters);
    filters = (filters.length > 0 && hairColor) ? (filters + ` and hair_color IN ${hairColors}`) : 
                   (hairColor ? ` hair_color IN ${hairColors}` : filters);
    filters = (filters.length > 0 && hairType) ? (filters + ` and hair_type IN ${hairTypes}`) : 
                   (hairType ? ` hair_type IN ${hairTypes}` : filters);
    filters = (filters.length > 0 && eyeColor) ? (filters + ` and eye_color IN ${eyeColors}`) : 
                   (eyeColor ? ` eye_color IN ${eyeColors}` : filters);
    filters = (filters.length > 0 && age) ? (filters + ` and` + age) :
                   (age ? age : filters);
    filters+= ` and visible is true`;
    // filters = (filters.length > 0 && height.length > 0) ? (filters + ` and` + height) :
   	// 			(height.length > 0 ? height : filters);
    filters = filters.length > 0 ? ' where '+filters : '';
    
    if(sortBy === 'name'){
        filters = filters+ ` order by name `+ order;
    }else if(sortBy === 'createdDate'){
        filters = filters+ ` order by created_date `+ order;
    }
    return filters;
};

exports.currentDate = function(){
    let date = {};
    date.currentDate = moment().format('YYYY-MM-DD');
    date.startDate = moment().format('YYYY-MM-01');
    date.week = moment(date.currentDate, 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD');
    date.month = moment(date.currentDate, 'YYYY-MM-DD').subtract(30, 'days').format('YYYY-MM-DD');

    return date;
}