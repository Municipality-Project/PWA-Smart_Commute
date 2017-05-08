//   todo:

"use strict";

const FS = require('fs');
const DATASTORE = require('nedb');
const DB = new DATASTORE({ filename: 'data/log_db.json', autoload: true });

class DataHandler {
     constructor() {

     }

     static renderDom(path, contentType, callback, encoding) {
          FS.readFile(path, encoding ? encoding : 'utf-8', (error, string) => {
               callback(error, string, contentType);
          });
     }

     static handleUserData(whichAjax, data, callback) {
          data = JSON.parse(data);
          const FILE_PATH = 'data/users.csv';
          FS.readFile(FILE_PATH, 'utf8', (err, file) => {
               let user = {};
               const COLUMNS = 4;
               let tempArray, finalData = [];
               let found = false;
               tempArray = file.split(/\r?\n/); //remove newlines
               for (let i = 0; i < tempArray.length; i++) {
                    finalData[i] = tempArray[i].split(/,/).slice(0, COLUMNS);
               }
               if (whichAjax === 1) {
                    for (let i = 0; i < finalData.length; i++) {
                         // console.log(`${data.createEmail} :: ${finalData[i][0]}`);
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
                         console.log(`returning created user`);
                         user = JSON.stringify({
                              'email': data.createEmail,
                              'password': data.createPassword,
                              'lastName': data.createLastName,
                              'firstName': data.createFirstName
                         });
                    }
                    callback(user);
               } else {
                    for (let i = 0; i < finalData.length; i++) {
                         if (data === finalData[i][0]) {
                              found = true;
                              DataHandler.findRecords(finalData[i][0], (data2) => {
                                   if (data2 !== false) {
                                        user = data2;
                                   } else {
                                        user = JSON.stringify({
                                             'email': finalData[i][0],
                                             'password': finalData[i][1],
                                             'lastName': finalData[i][2],
                                             'firstName': finalData[i][3]
                                        });
                                   }
                              });
                              break;
                         } else {
                              user = 'false';
                         }
                    }
                    callback(user);
               }
          });
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

     static addData(data) {
          console.log(`Adding new user....`);
          DB.insert(data);
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
}

module.exports = DataHandler;