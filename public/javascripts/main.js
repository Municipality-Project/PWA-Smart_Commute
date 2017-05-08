//   @todo

"use strict";

class main {
     constructor() {
          main.loadServiceWorker();
          main.prepApp();
          new EventHandler();
          this.user = [];
     }

     static loadServiceWorker() {
          if ('serviceWorker' in navigator) {
               navigator.serviceWorker.register('/ServiceWorker.js');
          }
     }

     static prepApp() {
          document.getElementById('log').style.display = 'none';
          document.getElementById('create').style.display = 'none';
          document.getElementById('result').style.display = 'none';
          document.getElementById('login').style.display = 'block';
     }
}

class EventHandler {
     constructor() {
          this.handleFB();
          this.handleContinue();
          this.handleCreate();
          this.handleSubmit();
          this.handleEnterLog();
          this.handleNewLog();
     }

     handleFB() {
          window.fbAsyncInit = function() {
               FB.init({
                    appId      : '1365458466881593',
                    xfbml      : true,
                    version    : 'v2.8'
               });
               FB.AppEvents.logPageView();
          };
          (function(d, s, id){
               var js, fjs = d.getElementsByTagName(s)[0];
               if (d.getElementById(id)) {return;}
               js = d.createElement(s); js.id = id;
               js.src = "//connect.facebook.net/en_US/sdk.js";
               fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
          document.getElementById('fb').addEventListener('click', () => {
               document.getElementById('create').style.display = 'none';
               document.getElementById('login').style.display = 'none';
               document.getElementById('result').style.display = 'none';
               document.getElementById('log').style.display = 'block';
          });
     }

     handleContinue() {
          document.getElementById('continue').addEventListener('click', () => {
               if (document.getElementById('getEmail').value === '' || ! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('getEmail').value)) {
                    alert(`Incorrect email address. Please try again.`)
               } else {
                    this.performAjax('XMLHttpRequest0', JSON.stringify([document.getElementById('getEmail').value, document.getElementById('password').value]), (response) => {
                         if (response === 'false') {
                              alert('You must provide your proper email address to continue.');
                         } else {
                              this.user = JSON.parse(response);
                              document.getElementById('create').style.display = 'none';
                              document.getElementById('login').style.display = 'none';
                              document.getElementById('result').style.display = 'none';
                              document.getElementById('log').style.display = 'block';
                              if (Object.prototype.toString.call(this.user) === '[object Object]') {
                                   document.getElementById('name').innerHTML = `${this.user.firstName} ${this.user.lastName}`;
                              } else {
                                   document.getElementById('name').innerHTML = `${this.user[0].firstName} ${this.user[0].lastName}`;
                              }
                         }
                    });
               }
          });
     }

     handleCreate() {
          document.getElementById('creator').addEventListener('click', () => {
               document.getElementById('login').style.display = 'none';
               document.getElementById('result').style.display = 'none';
               document.getElementById('log').style.display = 'none';
               document.getElementById('create').style.display = 'block';
          });
     }

     handleSubmit() {
          document.getElementById('submit').addEventListener('click', () => {
               if (document.getElementById('createEmail').value !== 'undefined' &&
                    document.getElementById('createPassword').value !== 'undefined' &&
                    document.getElementById('confirmPassword').value !== 'undefined' &&
                    document.getElementById('createFirstName').value !== 'undefined' &&
                    document.getElementById('createLastName').value !== 'undefined') {
                    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('createEmail').value)) {
                         if (/^[a-z0-9]{1,20}$/i.test(document.getElementById('createPassword').value) && document.getElementById('createPassword').value === document.getElementById('confirmPassword').value) {
                              if (/^[a-z]{1,30}$/i.test(document.getElementById('createFirstName').value) && /^[a-z]{1,30}$/i.test(document.getElementById('createLastName').value)) {
                                   let data = new FormData(document.querySelector('#createAccount'));
                                   this.performAjax('XMLHttpRequest1', data, (responseText) => {
                                        document.getElementById('createAccount').reset();
                                        if (responseText !== 'false') {
                                             alert(`Account created`);
                                             this.user = JSON.parse(responseText);
                                             document.getElementById('name').innerHTML = `${this.user.firstName} ${this.user.lastName}`;
                                             document.getElementById('login').style.display = 'none';
                                             document.getElementById('result').style.display = 'none';
                                             document.getElementById('create').style.display = 'none';
                                             document.getElementById('log').style.display = 'block';
                                        } else {
                                             alert(`Account already exists`);
                                             document.getElementById('login').style.display = 'block';
                                             document.getElementById('result').style.display = 'none';
                                             document.getElementById('create').style.display = 'none';
                                             document.getElementById('log').style.display = 'none';
                                        }
                                   });
                              } else {
                                   alert(`Invalid name data, please try again.`);
                              }
                         } else {
                              alert(`Passwords don't match or invalid password, please try again.`);
                         }
                    } else {
                         alert(`Invalid email, please try again.`);
                    }
               } else {
                    alert(`Please fill in all data.`);
               }
          });
     }

     handleEnterLog() {
          document.getElementById('enterLog').addEventListener('click', () => {
               let numTrips = Number(document.getElementById('tripNums').value);
               let tripMiles = Number(document.getElementById('tripMileage').value);
               if (numTrips > 0 && numTrips < 99 &&  tripMiles > 0 && tripMiles < 9999) {
                    document.getElementById('log').style.display = 'none';
                    document.getElementById('create').style.display = 'none';
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('result').style.display = 'block';
                    let data = new FormData(document.querySelector('#logData'));
                    data.append('email', this.user.email);
                    this.performAjax('XMLHttpRequest2', data);
               } else {
                    alert(`Invalid trip data, please try again.`);
               }
          });
     }

     handleNewLog() {
          document.getElementById('newLog').addEventListener('click', () => {
               document.getElementById('logData').reset();
               document.getElementById('login').style.display = 'none';
               document.getElementById('result').style.display = 'none';
               document.getElementById('create').style.display = 'none';
               document.getElementById('log').style.display = 'block';
          });
     }

     performAjax(requestNum, sendToNode, callback) {
          let bustCache = '?' + new Date().getTime();
          const XHR = new XMLHttpRequest();
          XHR.open('POST', document.url  + bustCache, true);
          XHR.setRequestHeader('X-Requested-with', requestNum);
          XHR.send(sendToNode);
          XHR.onload = () => {
               if (XHR.readyState == 4 && XHR.status == 200 && callback) {
                    return callback(XHR.responseText);
               }
          };
     }
}

window.addEventListener('load', () => {
     new main();
});


/*
 http://stackoverflow.com/a/17067016/466246 (for of JSON object)
 for (const ITEM of data.entries()) {
 console.log(ITEM);
 }
 */