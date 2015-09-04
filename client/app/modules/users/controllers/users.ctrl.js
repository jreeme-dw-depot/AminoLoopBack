'use strict';
var app = angular.module('com.module.users');
app.controller('UsersCtrl', function ($scope, $stateParams, $state, CoreService,
                                      User, gettextCatalog) {
  if ($stateParams.id) {
    User.findOne({
      filter: {
        where: {
          id: $stateParams.id
        },
        include: ['roles', 'identities', 'credentials', 'accessTokens']
      }
    }, function (result) {
      $scope.user = result;
    }, function (err) {
      console.log(err);
    });
  } else {
    $scope.user = {};
  }
  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function () {
        User.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'User deleted'), gettextCatalog.getString(
              'Your user is deleted!'));
            $state.go('app.users.list');
          },
          function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting user'), gettextCatalog.getString(
              'Your user is not deleted:' + err));
          });
      },
      function () {
        return false;
      });
  };
  $scope.loading = true;
  $scope.safeDisplayedUsers = User.find({
    filter: {
      include: ['roles']
    }
  }, function () {
    $scope.loading = false;
  });
  $scope.displayedUsers = [].concat($scope.safeDisplayedUsers);
  $scope.onSubmit = function () {
    User.upsert($scope.user, function () {
      CoreService.toastSuccess(gettextCatalog.getString('User saved'),
        gettextCatalog.getString('This user is save!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
        'Error saving user: ', +err));
    });
  };
  $scope.formFields = [{
    key: 'email',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Username'),
      disabled: true
    }
  }, {
    key: 'email',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('E-mail'),
      type: 'email',
      required: true
    }
  }, {
    key: 'firstName',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('First name'),
      required: true
    }
  }, {
    key: 'lastName',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Last name'),
      required: true
    }
  }];
});
