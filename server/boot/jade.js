'use strict';
module.exports = function (app) {
  var path = require('path');
  app.set('views', path.join(__dirname, '../../client/app/modules/users/views'));
  app.set('view engine', 'jade');
  app.get('/modules/users/views/form', function(req,res){
    res.render('form', { title: 'Form'});
  });
  app.get('/modules/users/views/login', function(req,res){
    res.render('login', { title: 'Login'});
  });
};
