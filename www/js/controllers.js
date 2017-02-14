angular.module('app.controllers', [])


.controller('connexionCtrl', ['$scope', '$http', '$stateParams',  '$state', '$ionicPopup', '$ionicLoading','$cordovaLocalNotification','$ionicPlatform', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading,$cordovaLocalNotification,$ionicPlatform) {

    //Notifications Start
    $scope.add = function() {
        var alarmTime = new Date();
        alarmTime.setMinutes(alarmTime.getMinutes() + 1);
        $cordovaLocalNotification.add({
            id: "1234",
            date: alarmTime,
            message: "This is a message",
            title: "This is a title",
            autoCancel: true,
            sound: null
        }).then(function () {
            console.log("The notification has been set");
        });
    };

    $scope.isScheduled = function() {
        $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
        });
    };
    /*
    $ionicPlatform.ready(function() {
        if(device.platform === "iOS") {
            window.plugin.notification.local.promptForPermission();
        }
    });
    */

    $scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
        alert("Added a notification");
    });


    // Notifications End

    if(sessionStorage.connected == "true") {

        $ionicLoading.show({
            template: 'Connexion...'
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });
      var url = 'https://controller.access.network/portal_api.php?action=authenticate&login='+sessionStorage.phone+'&password='+sessionStorage.mdp;

      $http.get(url, {headers: {'Accept':'*/*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
          'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
      'Access-Control-Allow-Credentials': 'true'}}
      ).success(function(data) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //console.log(data);
        var desData = angular.fromJson(data);
        if (desData.error)
        {
          // An alert dialog
          $ionicPopup.alert({
            title: 'Il y a eu une erreur!',
            template: desData.error.code
          });

        }
            else
            {
              var userInfo =angular.fromJson(desData.user);

              // stay connected?"
              sessionStorage.setItem("connected","false");

              // User Info
              sessionStorage.setItem("phone",userInfo.login.value );

              // Sauvegarde du profil/forfait
              sessionStorage.setItem("profile_id",userInfo.profile.id);
              sessionStorage.setItem("profile_value",userInfo.profile.value);

              // Sauvegarde option deconnexion auto
              sessionStorage.setItem("autodisconnect",userInfo.autoDisconnect.value);

              // Sauvegarde validité profil
              /* Début */
              /*sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin.day);
               sessionStorage.setItem("schedule_begin_hour",userInfo.schedule.begin.hour);
               sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin.min);
               */
              sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin);

              /* Fin */

              /*
               sessionStorage.setItem("schedule_end_day",userInfo.schedule.end.day);
               sessionStorage.setItem("schedule_end_hour",userInfo.schedule.end.hour);
               sessionStorage.setItem("schedule_end_day",userInfo.schedule.end.min);
               */
              sessionStorage.setItem("schedule_end_day",userInfo.schedule.value[0].begin.day);

              // Validité
              sessionStorage.setItem("validity",userInfo.validity.value);

              // Initialisation du temps de la nouvelle connexion
              sessionStorage.setItem("init_time",userInfo.initTimeGMT.value);

              // Crédit temps
              sessionStorage.setItem("time_credit_value",userInfo.timeCredit);
              //sessionStorage.setItem("time_credit_remaining_value",userInfo.timeCredit.remaining);
              //sessionStorage.setItem("time_credit_reneweach_value",userInfo.timeCredit.reneweach);
              //sessionStorage.setItem("time_credit_initialremaining_value",userInfo.timeCredit.initialRemaining);

              // Informations utilisateurs
              sessionStorage.setItem("user_lastname",userInfo.lastName);
              sessionStorage.setItem("user_firstname",userInfo.firstName);
              sessionStorage.setItem("user_email",userInfo.email);
              sessionStorage.setItem("user_phone",userInfo.phoneNumber);

              $state.go('home');
              console.log(userInfo);
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log(data);
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: data
            });
            console.log(data);
        });

    } else {

        $scope.authClient = function(value) {
            //console.log(value);
            //var url = 'http://ilink-app.com/cfao/v1/index.php/register';
            //var url = 'http://144.217.80.224/service/auth_ucopia.php';



            if (value.phone=="phone" ) {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: "Vous n'avez pas entré de numéro de téléphone"
                });


            } else  {
                if (value.mdp=="mdp") {
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: "Vous n'avez pas entré de mot de passe"
                    });
                } else {
                  sessionStorage.setItem("phone",value.phone);

                    if (value.radio==true) {

                        sessionStorage.setItem("connected","true");

                        sessionStorage.setItem("mdp",value.mdp);

                    }

                    $ionicLoading.show({
                        template: 'Connexion...'
                    }).then(function(){
                        console.log("The loading indicator is now displayed");
                    });
                  var url = 'https://controller.access.network/portal_api.php?action=authenticate&login='+value.phone+'&password='+value.mdp;

                    $http.get(url, {headers: {'Accept':'*/*',
                      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                      'Access-Control-Max-Age': '3600',
                      'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                      'Access-Control-Allow-Credentials': 'true'}}
                    ).success(function(data) {
                        $ionicLoading.hide().then(function(){
                            console.log("The loading indicator is now hidden");
                        });
                        //console.log(data);
                      var desData = angular.fromJson(data);
                        if (desData.error)
                        {
                            // An alert dialog
                            $ionicPopup.alert({
                                title: 'Il y a eu une erreur!',
                                template: desData.error.code
                            });

                            //popupalert.show();
                            //console.log(data);
                        }
                        else
                        {


                          var userInfo =angular.fromJson(desData.user);

                          // stay connected?
                          sessionStorage.setItem("connected","false");

                          // User Info
                          sessionStorage.setItem("phone",userInfo.login.value );

                          // Sauvegarde du profil/forfait
                          sessionStorage.setItem("profile_id",userInfo.profile.id);
                          sessionStorage.setItem("profile_value",userInfo.profile.value);

                          // Sauvegarde option deconnexion auto
                          sessionStorage.setItem("autodisconnect",userInfo.autoDisconnect.value);

                          // Sauvegarde validité profil
                          /* Début */
                          /*sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin.day);
                          sessionStorage.setItem("schedule_begin_hour",userInfo.schedule.begin.hour);
                          sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin.min);
                          */
                          sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin);

                          /* Fin */

                          /*
                          sessionStorage.setItem("schedule_end_day",userInfo.schedule.end.day);
                          sessionStorage.setItem("schedule_end_hour",userInfo.schedule.end.hour);
                          sessionStorage.setItem("schedule_end_day",userInfo.schedule.end.min);
                          */
                          sessionStorage.setItem("schedule_end_day",userInfo.schedule.value[0].begin.day);

                          // Validité
                          sessionStorage.setItem("validity",userInfo.validity.value);

                          // Initialisation du temps de la nouvelle connexion
                          sessionStorage.setItem("init_time",userInfo.initTimeGMT.value);

                          // Crédit temps
                          sessionStorage.setItem("time_credit_value",userInfo.timeCredit);
                          //sessionStorage.setItem("time_credit_remaining_value",userInfo.timeCredit.remaining);
                          //sessionStorage.setItem("time_credit_reneweach_value",userInfo.timeCredit.reneweach);
                          //sessionStorage.setItem("time_credit_initialremaining_value",userInfo.timeCredit.initialRemaining);

                          // Informations utilisateurs
                          sessionStorage.setItem("user_lastname",userInfo.lastName);
                          sessionStorage.setItem("user_firstname",userInfo.firstName);
                          sessionStorage.setItem("user_email",userInfo.email);
                          sessionStorage.setItem("user_phone",userInfo.phoneNumber);

                          $state.go('home');
                          console.log(userInfo);
                        }
                    }).error(function(data, status) {
                        $ionicLoading.hide().then(function(){
                            console.log("The loading indicator is now hidden");
                        });
                        //$scope.errors.push(status);
                        // An alert dialog
                        $ionicPopup.alert({
                            title: 'Il y a eu un problème!',
                            template: data
                        });
                        console.log(data);
                    });

                }
            }




        };


    }


}])

.controller('inscriptionCtrl', ['$scope', '$http', '$stateParams',  '$state',  '$ionicLoading', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicLoading, $ionicPopup) {


    $scope.registerClient = function(value) {
        //console.log(value);
        //var url = 'http://ilink-app.com/cfao/v1/index.php/register';
        //var url = 'http://144.217.80.224/service/register_ucopia.php';

      $ionicLoading.show({
            template: 'Inscription...'
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });

      //var url = 'https://controller.access.network/portal_api.php?action=subscribe&type=one&user_login='+value.phone+'&last_name='+value.name+'&first_name='+value.lastname+'&email_address='+value.email+'&phone_number='+value.phone+'&connect_policy_accept=true&policy_accept=true';

      var url = 'https://controller.access.network/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=adduser&user_id='+value.phone+'&user_pwd=capp&user_grp=test&user_lastname='+value.name+'&user_firstname='+value.lastname+'&user_email='+value.email+'&user_phonenumber='+value.phone;

      $http.get(url, {headers: {'Accept':'*/*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
        'Access-Control-Allow-Credentials': 'true'}}
      ).success(function(data) {
        $ionicLoading.hide().then(function(){
          console.log("The loading indicator is now hidden");
        });
        console.log(data);
        //var desData = angular.fromJson(data);
        var desData = data.split(':');
        if (desData[0]!=0)
        {
          // An alert dialog
          $ionicPopup.alert({
            title: 'Il y a eu une erreur!',
            template: desData[1]
          });
            }
            else
            {
                $state.go('home');
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: status
            });
            console.log(status);
        });

    };

  function randomStr(m) {
    var m = m || 9; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return s;
  };

}])

.controller('homeCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http,$ionicLoading) {

    $scope.logout = function() {


      var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
      //var url ='https://controller.access.network/portal_api.php?action=init'
      $http.get(url, {headers: {'Accept':'*/*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
        'Access-Control-Allow-Credentials':'true'}}
      ).success(function(data) {
        $ionicLoading.hide().then(function(){
          console.log("The loading indicator is now hidden");
        });
        //console.log(data);
        if (data.error_code === 1)
        {
          // An alert dialog
          $ionicPopup.alert({
            title: 'Il y a eu un problème!',
            template: data.status
          });

          //popupalert.show();
          console.log(data);
        }
        else
        {
          sessionStorage.clear();
          console.log('deconnexion');
          $state.go('connexion');
        }
      }).error(function(data, status) {
        $ionicLoading.hide().then(function(){
          console.log("The loading indicator is now hidden");
        });
        //$scope.errors.push(status);
        // An alert dialog
        $ionicPopup.alert({
          title: 'Il y a eu un problème!',
          template: data
        });
        console.log(data);
      });

    };

  $scope.$on('$ionicView.enter', function(){
    sessionStorage.clear();

    //var url_forfait = 'https://controller.access.network/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=get_refill_options&reply_format=json';
var url ='https://controller.access.network/portal_api.php?action=init';
    $http.get(url, {headers: {'Accept':'*/*',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
      'Access-Control-Allow-Credentials': 'true'}}
    ).success(function(data) {
      $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");

      });
      //console.log(data);

      var desData = angular.fromJson(data);
      console.log(desData);
      $scope.forfaits = angular.fromJson(desData);

      console.log(angular.fromJson(desData));

      var userInfo =angular.fromJson(desData.user);

      // stay connected?
      sessionStorage.setItem("connected","false");

      // User Info
      sessionStorage.setItem("phone",userInfo.login.value );

      // Sauvegarde du profil/forfait
      sessionStorage.setItem("profile_id",userInfo.profile.id);
      sessionStorage.setItem("profile_value",userInfo.profile.value);

      // Sauvegarde option deconnexion auto
      sessionStorage.setItem("autodisconnect",userInfo.autoDisconnect.value);

      // Sauvegarde validité profil
      /* Début */
       sessionStorage.setItem("schedule_begin_day",userInfo.schedule.value[0].begin.day);
       sessionStorage.setItem("schedule_begin_hour",userInfo.schedule.value[0].begin.hour);
       sessionStorage.setItem("schedule_begin_day",userInfo.schedule.value[0].begin.min);


      /* Fin */


       sessionStorage.setItem("schedule_end_day",userInfo.schedule.value[0].end.day);
       sessionStorage.setItem("schedule_end_hour",userInfo.schedule.value[0].end.hour);
       sessionStorage.setItem("schedule_end_day",userInfo.schedule.value[0].end.min);


      // Validité
      sessionStorage.setItem("validity",userInfo.validity.value);

        //Données consommées
        sessionStorage.setItem("consumed_montant",userInfo.consumedData.upload.value);
        sessionStorage.setItem("consumed_descendant",userInfo.consumedData.download.value);

        //Données restantes
        sessionStorage.setItem("debit_restant_montant",userInfo.consumedData.extra.value[1].available.upload);
        sessionStorage.setItem("debit_restant_descendant",userInfo.consumedData.extra.value[1].available.download);

        //Bande passante
        sessionStorage.setItem("bande_passante",userInfo.consumedData.extra.value[0].bandwidth.download);


        // Initialisation du temps de la nouvelle connexion
      sessionStorage.setItem("init_time",userInfo.initTimeGMT.value);

      // Crédit temps
      sessionStorage.setItem("time_credit_value",userInfo.timeCredit);
      //sessionStorage.setItem("time_credit_remaining_value",userInfo.timeCredit.remaining);
      //sessionStorage.setItem("time_credit_reneweach_value",userInfo.timeCredit.reneweach);
      //sessionStorage.setItem("time_credit_initialremaining_value",userInfo.timeCredit.initialRemaining);

      // Informations utilisateurs
      sessionStorage.setItem("user_lastname",userInfo.lastName);
      sessionStorage.setItem("user_firstname",userInfo.firstName);
      sessionStorage.setItem("user_email",userInfo.email);
      sessionStorage.setItem("user_phone",userInfo.phoneNumber);



    }).error(function(data, status) {
      $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");
      });
      //$scope.errors.push(status);
      // An alert dialog
      $ionicPopup.alert({
        title: 'Il y a eu un problème!',
        template: data
      });
      console.log(data);
    });


  });


    $scope.useruserName = sessionStorage.phone;
  $scope.userProfile = sessionStorage.profile_value;
  $scope.userautoDisconnect = sessionStorage.autodisconnect;
    var date = new Date(sessionStorage.validity*1000);
    //Day
    var day = date.getDay();
    switch (day)
    {
        case 1:
            day = 'Lundi';
            break;
        case 2:
            day = 'Mardi';
            break;
        case 3:
            day = 'Mercredi';
            break;
        case 4:
            day = 'Jeudi';
            break;
        case 5:
            day = 'Vendredi';
            break;
        case 6:
            day = 'Samedi';
            break;
        case 7:
            day = 'Dimanche';
            break;
    }
    // Date
    var date_of_day = date.getDate();
    // Month
    var month = date.getMonth();
    switch (month)
    {
        case 1:
            month = 'Janvier';
            break;
        case 2:
            month = 'Février';
            break;
        case 3:
            month = 'Mars';
            break;
        case 4:
            month = 'Avril';
            break;
        case 5:
            month = 'Mai';
            break;
        case 6:
            day = 'Juin';
            break;
        case 7:
            month = 'Juillet';
            break;
        case 8:
            month = 'Aout';
            break;
        case 9:
            month = 'Septembre';
            break;
        case 10:
            month = 'Octobre';
            break;
        case 11:
            month = 'Novembre';
            break;
        case 12:
            month = 'Décembre';
            break;
    }
    // Year
    var year = date.getFullYear();
// Hours part from the timestamp
    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    var formattedTime = day+ ' '+date_of_day+ ' '+month+' '+year+ ' à '+ hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  $scope.userValidity = formattedTime;
  //$scope.userTimeremain = sessionStorage.init_time;

  //$scope.userTimeremain = bytesToSize(sessionStorage.consumed_montant);
    $scope.debit_montant = bytesToSize(sessionStorage.consumed_montant);
    $scope.debit_descendant = bytesToSize(sessionStorage.consumed_descendant);

    $scope.reste_montant = bytesToSize(sessionStorage.debit_restant_montant);
    $scope.reste_descendant = bytesToSize(sessionStorage.debit_restant_descendant);
    $scope.bande_passante = bytesToSize2(sessionStorage.bande_passante);

// from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }
    function bytesToSize2(bytes) {
        var sizes = ['KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }
}])

.controller('sLectionDuForfaitCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup', '$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, $ionicPopup, $ionicLoading) {

  $scope.$on('$ionicView.enter', function(){

    var url_forfait = 'https://controller.access.network/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=get_refill_options&reply_format=json';

    $http.get(url_forfait, {headers: {'Accept':'*/*',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
      'Access-Control-Allow-Credentials': 'true'}}
    ).success(function(data) {
      $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");

      });
      //console.log(data);

        var desData = angular.fromJson(data);
        console.log(desData);
        //var test_wifi = desData.split("_");
      $scope.forfaits = angular.fromJson(desData);

      console.log(angular.fromJson(desData));

      //console.log(desData.length);


    }).error(function(data, status) {
      $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");
      });
      //$scope.errors.push(status);
      // An alert dialog
      $ionicPopup.alert({
        title: 'Il y a eu un problème!',
        template: data
      });
      console.log(data);
    });


  });

    $scope.logout = function() {


        var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
        //var url ='https://controller.access.network/portal_api.php?action=init'
        $http.get(url, {headers: {'Accept':'*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
            'Access-Control-Allow-Credentials':'true'}}
        ).success(function(data) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //console.log(data);
            if (data.error_code === 1)
            {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: data.status
                });

                //popupalert.show();
                console.log(data);
            }
            else
            {
                sessionStorage.clear();
                console.log('deconnexion');
                $state.go('connexion');
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: data
            });
            console.log(data);
        });


    };
    $scope.selectForfait = function(value) {
        //console.log(value);



        if (value.selectforfait!= null) {

            sessionStorage.setItem("forfait",value.selectforfait);
            //sessionStorage.setItem("montant",value.selectforfait);

            switch (value.radio) {

                case "azur":
                    $state.go("azur");
                    console.log("azur");
                    sessionStorage.setItem("portefeuille","azur");
                    break;
                case "bgfi":
                    $state.go("bgfi1");
                    console.log("bgfi");
                    sessionStorage.setItem("portefeuille","bgfi");
                    break;
                case "airtel":
                    $state.go("airtel");
                    console.log("airtel");
                    sessionStorage.setItem("portefeuille","airtel");
                    break;
                case "flooz":
                    $state.go("flooz");
                    console.log("flooz");
                    sessionStorage.setItem("portefeuille","flooz");
                    break;
                default:
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: "Vous n'avez sélectionné aucun porte-feuille"
                    });

            }

        } else {

            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: "Vous n'avez sélectionné aucun forfait"
            });

        }

    };

}])

.controller('bGFI1Ctrl', ['$scope', '$http', '$stateParams', '$state', '$ionicPopup', '$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {

    $scope.logout = function() {


        var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
        //var url ='https://controller.access.network/portal_api.php?action=init'
        $http.get(url, {headers: {'Accept':'*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
            'Access-Control-Allow-Credentials':'true'}}
        ).success(function(data) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //console.log(data);
            if (data.error_code === 1)
            {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: data.status
                });

                //popupalert.show();
                console.log(data);
            }
            else
            {
                sessionStorage.clear();
                console.log('deconnexion');
                $state.go('connexion');
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: data
            });
            console.log(data);
        });


    };

    var prix = sessionStorage.forfait;
    var prix_parse = prix.split(",");
    //console.log(prix_parse[1]);

    sessionStorage.setItem("montant",prix_parse[1]);
    sessionStorage.setItem("forfait_id",prix_parse[0]);

    console.log(sessionStorage.montant);
    console.log(sessionStorage.forfait_id);


    $scope.phoneBGFI = function(value) {


        if (value.phone == "phone") {

            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: "Vous n'avez pas renseigné votre numéro de téléphone"
            });

        } else {
            sessionStorage.setItem("phoneMoney", value.phone);
            var url = 'http://144.217.80.224/service/bgfi.php?tag=init&phone=241'+value.phone+'&montant='+sessionStorage.montant;



            $ionicLoading.show({
                template: 'Transaction en cours...'
            }).then(function(){
                console.log("The loading indicator is now displayed ok");
            });

            // Récupération d'un token

            $http.get(url

            ).success(function (data) {

                //console.log(data);
                if (data.error_code === 1) {
                    $ionicLoading.hide().then(function(){
                        console.log("The loading indicator is now hidden");
                    });
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: data.message
                    });

                }
                else {
                    sessionStorage.setItem("token",data.token);
                    sessionStorage.setItem("reference",data.reference);

                    console.log(sessionStorage.token);
                    console.log(sessionStorage.reference);
                    console.log(sessionStorage.portefeuille);



                    $state.go('bgfi2');


                }
            }).error(function (data, status) {
                $ionicLoading.hide().then(function(){
                    console.log("The loading indicator is now hidden");
                });
                //$scope.errors.push(status);
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: data
                });
                console.log(data);
            });
            /*var url = 'http://144.217.80.224/service/register_ucopia.php';


             $http.post(url,
             {'name': value.name, 'lastname': value.lastname, 'phone': value.phone, 'email': value.email}
             ).success(function (data) {

             //console.log(data);
             if (data.error_code === 1) {
             console.log(data);
             }
             else {
             $state.go('home');
             }
             }).error(function (data, status) {
             //$scope.errors.push(status);
             console.log(status);
             });*/
        }


    };


}])

.controller('bGFI2Ctrl', ['$scope', '$http', '$stateParams', '$state', '$ionicPopup', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {

  $scope.$on('$ionicView.enter', function(){

    var url_forfait = 'https://controller.access.network/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=get_refill_code&option_id='+sessionStorage.forfait_id+'&reply_format=json';

    $http.get(url_forfait, {headers: {'Accept':'*/*',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
      'Access-Control-Allow-Credentials': 'true'}}
    ).success(function(data) {
      $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");

      });
      console.log(data.result);
        console.log(sessionStorage.phoneMoney);
        console.log(sessionStorage.montant);
        console.log(sessionStorage.token);
        console.log(sessionStorage.reference);
        

      sessionStorage.setItem("refill_code",data.result)



    }).error(function(data, status) {
      $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");
      });
      //$scope.errors.push(status);
      // An alert dialog
      $ionicPopup.alert({
        title: 'Il y a eu un problème!',
        template: data
      });
      console.log(data);
    });


  });


    $scope.logout = function() {


        var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
        //var url ='https://controller.access.network/portal_api.php?action=init'
        $http.get(url, {headers: {'Accept':'*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
            'Access-Control-Allow-Credentials':'true'}}
        ).success(function(data) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //console.log(data);
            if (data.error_code === 1)
            {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: data.status
                });

                //popupalert.show();
                console.log(data);
            }
            else
            {
                sessionStorage.clear();
                console.log('deconnexion');
                $state.go('connexion');
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: data
            });
            console.log(data);
        });


    };

    $scope.webcodeBGFI = function(value) {
        if (value.webcode == "webcode") {

            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: "Vous n'avez pas renseigné le webcode fourni par BGFI"
            });

        } else {
            var url = 'http://144.217.80.224/service/bgfi.php?tag=payment&phone=241'+sessionStorage.phoneMoney+'&montant='+sessionStorage.montant+'&token='+sessionStorage.token+'&reference='+sessionStorage.reference+'&webcode='+value.webcode;
            $ionicLoading.show({
                template: 'Transaction en cours...'
            }).then(function(){
                console.log("The loading indicator is now displayed");
            });
            $http.get(url
            ).success(function (data) {
                $ionicLoading.hide().then(function(){
                    console.log("The loading indicator is now hidden");
                });

                //console.log(data);
                if (data.error_code === 1) {
                    console.log(data.message);
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: data.message
                    });


                }
                else {
                    console.log(data);


                  var url_forfait = 'https://controller.access.network/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=set_refill_code_info&refill_code='+sessionStorage.refill_code+'&user_id='+sessionStorage.phone;

                  $http.get(url_forfait, {headers: {'Accept':'*/*',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                    'Access-Control-Max-Age': '3600',
                    'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                    'Access-Control-Allow-Credentials': 'true'}}
                  ).success(function(data) {
                    $ionicLoading.hide().then(function(){
                      console.log("The loading indicator is now hidden");

                    });
                    console.log(data);

                      $state.go('home');

                  }).error(function(data, status) {
                    $ionicLoading.hide().then(function(){
                      console.log("The loading indicator is now hidden");
                    });
                    //$scope.errors.push(status);
                    // An alert dialog
                    $ionicPopup.alert({
                      title: 'Il y a eu un problème!',
                      template: data
                    });
                    console.log(data);
                  });

                }
            }).error(function (data, status) {
                $ionicLoading.hide().then(function(){
                    console.log("The loading indicator is now hidden");
                });
                //$scope.errors.push(status);
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: status
                });
                console.log(status);
            });

        }

    };

}])

.controller('aIRTELCtrl', ['$scope', '$http', '$stateParams', '$state', '$ionicPopup', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {


    $scope.logout = function() {


        var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
        //var url ='https://controller.access.network/portal_api.php?action=init'
        $http.get(url, {headers: {'Accept':'*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
            'Access-Control-Allow-Credentials':'true'}}
        ).success(function(data) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //console.log(data);
            if (data.error_code === 1)
            {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: data.status
                });

                //popupalert.show();
                console.log(data);
            }
            else
            {
                sessionStorage.clear();
                console.log('deconnexion');
                $state.go('connexion');
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: data
            });
            console.log(data);
        });


    };

    $scope.fluxAIRTEL = function(value) {
        var url1 = 'http://ilink-app.com/login_web_service.php';
        var url2 = 'http://ilink-app.com/transaction_web_service.php';
        var username = 'cfao';
        var mdp = 'cfao';


        if (value.phone=="phone") {
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: "Vous n'avez pas entré de numéro de téléphone"
            });


        } else  {
            if (value.secret=="code secret") {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: "Vous n'avez pas entré de mot de passe"
                });
            } else {

                $ionicLoading.show({
                    template: 'Transaction en cours...'
                }).then(function(){
                    console.log("The loading indicator is now displayed");
                });

                // Récupération d'un token
                $http.post(url1,
                    {'username': username, 'mdp': mdp}
                ).success(function (data) {

                    //console.log(data);
                    if (data.error_code === 1) {
                        $ionicLoading.hide().then(function(){
                            console.log("The loading indicator is now hidden");
                        });
                        // An alert dialog
                        $ionicPopup.alert({
                            title: 'Il y a eu un problème!',
                            template: data.status
                        });

                    }
                    else {
                        sessionStorage.setItem("token", data.token);

                        $http.post(url2,
                            {'token':sessionStorage.token,'phone':value.phone, 'mdp':value.secret, 'produit':'forfait','montant':sessionStorage.forfait}
                        ).success(function(data) {
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });
                            //console.log(data);
                            if (data.error_code === 1)
                            {
                                // An alert dialog
                                $ionicPopup.alert({
                                    title: 'Il y a eu un problème!',
                                    template: data.status
                                });




                                //popupalert.show();
                                console.log(data);
                            }
                            else
                            {
                                $state.go('home');
                            }
                        }).error(function(data, status) {
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });

                            //$scope.errors.push(status);
                            // An alert dialog
                            $ionicPopup.alert({
                                title: 'Il y a eu un problème!',
                                template: status
                            });
                            console.log(status);
                        });




                    }

                }).error(function (data, status) {
                    $ionicLoading.hide().then(function(){
                        console.log("The loading indicator is now hidden");
                    });
                    //$scope.errors.push(status);
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: status
                    });
                    console.log(status);
                });

            }
        }

    };


}])

.controller('fLOOZCtrl', ['$scope', '$http', '$stateParams', '$state', '$ionicPopup', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {

    $scope.logout = function() {


        var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
        //var url ='https://controller.access.network/portal_api.php?action=init'
        $http.get(url, {headers: {'Accept':'*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
            'Access-Control-Allow-Credentials':'true'}}
        ).success(function(data) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //console.log(data);
            if (data.error_code === 1)
            {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: data.status
                });

                //popupalert.show();
                console.log(data);
            }
            else
            {
                sessionStorage.clear();
                console.log('deconnexion');
                $state.go('connexion');
            }
        }).error(function(data, status) {
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
            //$scope.errors.push(status);
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: data
            });
            console.log(data);
        });


    };

    $scope.fluxFLOOZ = function(value) {
        var url1 = 'http://ilink-app.com/login_web_service.php';
        var url2 = 'http://ilink-app.com/transaction_web_service.php';
        var username = 'cfao';
        var mdp = 'cfao';


        if (value.phone=="phone") {
            // An alert dialog
            $ionicPopup.alert({
                title: 'Il y a eu un problème!',
                template: "Vous n'avez pas entré de numéro de téléphone"
            });


        } else  {
            if (value.secret=="code secret") {
                // An alert dialog
                $ionicPopup.alert({
                    title: 'Il y a eu un problème!',
                    template: "Vous n'avez pas entré de mot de passe"
                });
            } else {

                $ionicLoading.show({
                    template: 'Transaction en cours...'
                }).then(function(){
                    console.log("The loading indicator is now displayed");
                });

                // Récupération d'un token
                $http.post(url1,
                    {'username': username, 'mdp': mdp}
                ).success(function (data) {

                    //console.log(data);
                    if (data.error_code === 1) {
                        $ionicLoading.hide().then(function(){
                            console.log("The loading indicator is now hidden");
                        });
                        // An alert dialog
                        $ionicPopup.alert({
                            title: 'Il y a eu un problème!',
                            template: data.status
                        });

                    }
                    else {
                        sessionStorage.setItem("token", data.token);

                        $http.post(url2,
                            {'token':sessionStorage.token,'phone':value.phone, 'mdp':value.secret, 'produit':'forfait','montant':sessionStorage.forfait}
                        ).success(function(data) {
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });
                            //console.log(data);
                            if (data.error_code === 1)
                            {
                                // An alert dialog
                                $ionicPopup.alert({
                                    title: 'Il y a eu un problème!',
                                    template: data.status
                                });




                                //popupalert.show();
                                console.log(data);
                            }
                            else
                            {
                                $state.go('home');
                            }
                        }).error(function(data, status) {
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });

                            //$scope.errors.push(status);
                            // An alert dialog
                            $ionicPopup.alert({
                                title: 'Il y a eu un problème!',
                                template: status
                            });
                            console.log(status);
                        });




                    }

                }).error(function (data, status) {
                    $ionicLoading.hide().then(function(){
                        console.log("The loading indicator is now hidden");
                    });
                    //$scope.errors.push(status);
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: status
                    });
                    console.log(status);
                });

            }
        }

    };


}])

    .controller('azurCtrl', ['$scope', '$http', '$stateParams', '$state', '$ionicPopup', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {

            $scope.logout = function() {


                var url = 'https://controller.access.network/portal_api.php?action=disconnect&login='+sessionStorage.phone;
                //var url ='https://controller.access.network/portal_api.php?action=init'
                $http.get(url, {headers: {'Accept':'*/*',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                    'Access-Control-Max-Age': '3600',
                    'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                    'Access-Control-Allow-Credentials':'true'}}
                ).success(function(data) {
                    $ionicLoading.hide().then(function(){
                        console.log("The loading indicator is now hidden");
                    });
                    //console.log(data);
                    if (data.error_code === 1)
                    {
                        // An alert dialog
                        $ionicPopup.alert({
                            title: 'Il y a eu un problème!',
                            template: data.status
                        });

                        //popupalert.show();
                        console.log(data);
                    }
                    else
                    {
                        sessionStorage.clear();
                        console.log('deconnexion');
                        $state.go('connexion');
                    }
                }).error(function(data, status) {
                    $ionicLoading.hide().then(function(){
                        console.log("The loading indicator is now hidden");
                    });
                    //$scope.errors.push(status);
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: data
                    });
                    console.log(data);
                });


            };
            $scope.fluxAZUR = function(value) {
                var url1 = 'http://ilink-app.com/login_web_service.php';
                var url2 = 'http://ilink-app.com/transaction_web_service.php';
                var username = 'cfao';
                var mdp = 'cfao';


                if (value.phone=="phone") {
                    // An alert dialog
                    $ionicPopup.alert({
                        title: 'Il y a eu un problème!',
                        template: "Vous n'avez pas entré de numéro de téléphone"
                    });


                } else  {
                    if (value.secret=="code secret") {
                        // An alert dialog
                        $ionicPopup.alert({
                            title: 'Il y a eu un problème!',
                            template: "Vous n'avez pas entré de mot de passe"
                        });
                    } else {

                        $ionicLoading.show({
                            template: 'Transaction en cours...'
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });

                        // Récupération d'un token
                        $http.post(url1,
                            {'username': username, 'mdp': mdp}
                        ).success(function (data) {

                            //console.log(data);
                            if (data.error_code === 1) {
                                $ionicLoading.hide().then(function(){
                                    console.log("The loading indicator is now hidden");
                                });
                                // An alert dialog
                                $ionicPopup.alert({
                                    title: 'Il y a eu un problème!',
                                    template: data.status
                                });

                            }
                            else {
                                sessionStorage.setItem("token", data.token);

                                $http.post(url2,
                                    {'token':sessionStorage.token,'phone':value.phone, 'mdp':value.secret, 'produit':'forfait','montant':sessionStorage.forfait}
                                ).success(function(data) {
                                    $ionicLoading.hide().then(function(){
                                        console.log("The loading indicator is now hidden");
                                    });
                                    //console.log(data);
                                    if (data.error_code === 1)
                                    {
                                        // An alert dialog
                                        $ionicPopup.alert({
                                            title: 'Il y a eu un problème!',
                                            template: data.status
                                        });




                                        //popupalert.show();
                                        console.log(data);
                                    }
                                    else
                                    {
                                        $state.go('home');
                                    }
                                }).error(function(data, status) {
                                    $ionicLoading.hide().then(function(){
                                        console.log("The loading indicator is now hidden");
                                    });

                                    //$scope.errors.push(status);
                                    // An alert dialog
                                    $ionicPopup.alert({
                                        title: 'Il y a eu un problème!',
                                        template: status
                                    });
                                    console.log(status);
                                });




                            }

                        }).error(function (data, status) {
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });
                            //$scope.errors.push(status);
                            // An alert dialog
                            $ionicPopup.alert({
                                title: 'Il y a eu un problème!',
                                template: status
                            });
                            console.log(status);
                        });

                    }
                }

            };


        }])

.controller('clientsAzurCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {


}])

.controller('clientsWiFlyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}]).controller('ListCtrl', function ($scope,$ionicPlatform, $state, NotesDataService) {
    $scope.$on('$ionicView.enter', function(e) {
        NotesDataService.getAll(function(data){
            $scope.itemsList = data
        })
    })

    $scope.gotoEdit = function(idNote){
        $state.go('form', {id: idNote})
    }
})

    .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, NotesDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            initForm()
        })

        function initForm(){
            if($stateParams.id){
                NotesDataService.getById($stateParams.id, function(item){
                    $scope.noteForm = item
                })
            } else {
                $scope.noteForm = {}
            }
        }
        function onSaveSuccess(){
            $state.go('list')
        }
        $scope.saveNote = function(){

            if(!$scope.noteForm.id){
                NotesDataService.createNote($scope.noteForm).then(onSaveSuccess)
            } else {
                NotesDataService.updateNote($scope.noteForm).then(onSaveSuccess)
            }
        }

        $scope.confirmDelete = function(idNote) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer une note',
                template: 'êtes vous sûr de vouloir supprimer ?'
            })

            confirmPopup.then(function(res) {
                if(res) {
                    NotesDataService.deleteNote(idNote).then(onSaveSuccess)
                }
            })
        }


    });




