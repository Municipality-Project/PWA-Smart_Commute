//   todo:

"use strict";

const FS = require ('fs'),
     DATASTORE = require('nedb'),
     DB = new DATASTORE({ filename: './data/log_db.json', autoload: true });

class DataHandler {
	constructor() {
          this.data = [];
	}

     static handleUserData(data, whichAjax) {
          data = JSON.parse(data);
          const FILE_PATH = 'data/users.csv';
          let users = FS.readFileSync(FILE_PATH, 'utf8');
          let user = {};
          const COLUMNS = 4;
          let tempArray, finalData = [];
          tempArray = users.split(/\r?\n/); //remove newlines
          for (let i = 0; i < tempArray.length; i++) {
               finalData[i] = tempArray[i].split(/,/).slice(0, COLUMNS);
          }
          if (Object.prototype.toString.call(data) !== '[object Array]' && whichAjax === 1) {
               for (let i = 0; i < finalData.length; i++) {
                    console.log(`${data.createEmail} :: ${finalData[i][0]}`);
                    if (data.createEmail === finalData[i][0]) {
                         console.log(`returning error: user exists`);
                         user = 'false';
                         break;
                    }
               }
               if (user !== 'false') {
                    FS.appendFileSync(FILE_PATH, `${data.createEmail},`, 'utf8');
                    FS.appendFileSync(FILE_PATH, `${data.createPassword},`, 'utf8');
                    FS.appendFileSync(FILE_PATH, `${data.createLastName},`, 'utf8');
                    FS.appendFileSync(FILE_PATH, data.createFirstName, 'utf8');
                    FS.appendFileSync(FILE_PATH, '\n', 'utf8');
                    console.log(`returning created`);
                    user = 'created'
               }
          } else {
               for (let i = 0; i < finalData.length; i++) {
                    if (data[0] === finalData[i][0] && data[1] === finalData[i][1]) {
                         user = JSON.stringify({
                              'email': finalData[i][0],
                              'password': finalData[i][1],
                              'lastName': finalData[i][2],
                              'firstName': finalData[i][3]
                         });
                         console.log(`returning existing user`);
                         break;
                    } else {
                         user = 'false';
                    }
               }
          }
          return user;
     }

     static findRecords(user, callback) {
          DB.find({ userID: user }, (err, docs) => {
               if (docs.length > 0) {
                    callback(docs);
               } else {
                    callback(false);
               }
          });
     }

     static updateData(data) {
          DB.update({ _id: data.id }, {
                 userID: data.userID
               , lastName: data.lastName
               , firstName: data.firstName
               , eventDate: data.eventDate
               , miles: data.miles
          }, { upsert: true,
               returnUpdatedDocs: true });
     }

     static addData(data) {
          delete data.id;  // remove id field out of JSON parameter
          DB.insert(data);
     }

     static queryData(data) {
          DB.findOne({ _id: data.id }, (err, docs) => {
               if (docs == null) {
                    DataHandler.addData(data);
               } else {
                    DataHandler.updateData(data);
               }
          });
     }
}

module.exports = DataHandler;