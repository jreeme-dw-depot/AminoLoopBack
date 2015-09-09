'use strict';
var app = angular.module('com.module.users');
app.controller('UsersCtrl', function ($scope, $stateParams, $state, CoreService,
                                      User, Role, AppAuth, gettextCatalog) {
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
      Role.find().$promise.then(function (allRoles) {
        //TODO: Maybe un-nest this loop?
        $scope.user.memberRoles = [];
        var displayRoles = [];
        for (var i = 0; i < allRoles.length; ++i) {
          displayRoles.push({
            value: allRoles[i].name,
            name: allRoles[i].name
          });
          for (var j = 0; j < AppAuth.currentUser.roles.length; ++j) {
            if (AppAuth.currentUser.roles[j].name === allRoles[i].name) {
              $scope.user.memberRoles.push(allRoles[i].name);
              break;
            }
          }
        }
        $scope.formFields.push(
          {
            key: 'memberRoles',
            type: 'multiCheckbox',
            templateOptions: {
              label: 'Roles',
              options: displayRoles,
              disabled: !AppAuth.currentUser.isAdmin
            }
          }
        );
      });
      /*      if(AppAuth.currentUser.isAdmin){
       $scope.formFields.push(
       {
       key: 'roles',
       type: 'multiCheckbox',
       templateOptions: {
       label: 'Roles',
       options: $scope.user.roles,
       labelProp: 'name'
       }
       }
       );
       }*/
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
  //Dual list management for Roles/Teams
  //http://www.bootply.com/mRcBel7RWm
  var userData = [
    {id: 1, firstName: 'Mary', lastName: 'Goodman', approved: true, points: 34},
    {id: 2, firstName: 'Mark', lastName: 'Wilson', approved: true, points: 4},
    {id: 3, firstName: 'Alex', lastName: 'Davies', approved: true, points: 56},
    {id: 4, firstName: 'Bob', lastName: 'Banks', approved: false, points: 14},
    {id: 5, firstName: 'David', lastName: 'Stevens', approved: false, points: 100},
    {id: 6, firstName: 'Jason', lastName: 'Durham', approved: false, points: 0},
    {id: 7, firstName: 'Jeff', lastName: 'Marks', approved: true, points: 8},
    {id: 8, firstName: 'Betty', lastName: 'Abercrombie', approved: true, points: 18},
    {id: 9, firstName: 'Krista', lastName: 'Michaelson', approved: true, points: 10},
    {id: 11, firstName: 'Devin', lastName: 'Sumner', approved: false, points: 3},
    {id: 12, firstName: 'Navid', lastName: 'Palit', approved: true, points: 57},
    {id: 13, firstName: 'Bhat', lastName: 'Phuart', approved: false, points: 314},
    {id: 14, firstName: 'Nuper', lastName: 'Galzona', approved: true, points: 94}
  ];
  $scope.getRoles = function () {
    return [];
  };
  $scope.roleChecked = function (role, checked) {
    var r = role;
  };
  $scope.selectedA = [];
  $scope.selectedB = [];
  $scope.listA = userData.slice(0, 5);
  $scope.listB = userData.slice(6, 10);
  $scope.items = userData;
  $scope.checkedA = false;
  $scope.checkedB = false;
  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  $scope.aToB = function () {
    for (var i in $scope.selectedA) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedA[i], "id");
      $scope.listB.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i], "id");
      $scope.listA.splice(delId, 1);
    }
    reset();
  };
  $scope.bToA = function () {
    for (var i in $scope.selectedB) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedB[i], "id");
      $scope.listA.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i], "id");
      $scope.listB.splice(delId, 1);
    }
    reset();
  };
  function reset() {
    $scope.selectedA = [];
    $scope.selectedB = [];
    $scope.toggle = 0;
  }

  $scope.toggleA = function () {
    if ($scope.selectedA.length > 0) {
      $scope.selectedA = [];
    }
    else {
      for (var i in $scope.listA) {
        $scope.selectedA.push($scope.listA[i].id);
      }
    }
  }
  $scope.toggleB = function () {
    if ($scope.selectedB.length > 0) {
      $scope.selectedB = [];
    }
    else {
      for (var i in $scope.listB) {
        $scope.selectedB.push($scope.listB[i].id);
      }
    }
  }
  $scope.selectA = function (i) {
    $scope.selectedA.push(i);
  };
  $scope.selectB = function (i) {
    $scope.selectedB.push(i);
  };
});
