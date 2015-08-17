'use strict';
module.exports = function (app) {
  var path = require('path');
  console.log('*** Doing the JADE boogie!');
  app.set('views', path.join(__dirname, '../../client/app/modules/users/views'));
  app.set('view engine', 'jade');
  app.get('/modules/users/views/login', function(req,res){
    res.render('login', { title: 'Login'});
  });
};
