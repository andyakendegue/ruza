angular.module('app.services', ['ngCordova'])

.factory('randomString', function () {
         
         return {
         
         random: function (m) {
         var m = m || 9;
         s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
         for (var i = 0; i < m; i++) {
         s += r.charAt(Math.floor(Math.random() * r.length));
         }
         return s;
         }
         }
         
         }).factory('objUser', function ($rootScope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {
                    
                    var scope = $rootScope.$new();
                    
                    return {
                    logout: function (id) {
                    var url = 'https://hotspot.azur-wifly.com/portal_api.php?action=disconnect&login=' + id;
                    //var url ='https://hotspot.azur-wifly.com/portal_api.php?action=init'
                    $http.get(url, {
                              headers: {
                              'Accept': '*/*',
                              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                              'Access-Control-Max-Age': '3600',
                              'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                              'Access-Control-Allow-Credentials': 'true'
                              }
                              }).success(function (data) {
                                         $ionicLoading.hide().then(function () {
                                                                   console.log("The loading indicator is now hidden");
                                                                   });
                                         //console.log(data);
                                         if (data.error_code === 1) {
                                         // An alert dialog
                                         $ionicPopup.alert({
                                                           title: 'Il y a eu un problème!',
                                                           template: data.status
                                                           });
                                         
                                         //popupalert.show();
                                         console.log(data);
                                         } else {
                                         sessionStorage.clear();
                                         console.log('deconnexion');
                                         $state.go('connexion');
                                         }
                                         }).error(function (data) {
                                                  $ionicLoading.hide().then(function () {
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
                    
                    
                    },
                    login: function (id, password, radio) {
                    // Vérification que l'utilisateur a bien rentré un numéro de téléphone
                    if (id == "phone") {
                    
                    
                    
                    // Si rien n'est rentré alerter l'utilisateur
                    // An alert dialog
                    $ionicPopup.alert({
                                      title: 'Il y a eu un problème!',
                                      template: "Vous n'avez pas entré de numéro de téléphone"
                                      });
                    
                    
                    }
                    
                    // Vérification de l'existence du mot de passe
                    else if (password == "mdp") {
                    
                    
                    // Si rien n'est rentré alerter l'utilisateur
                    // An alert dialog
                    $ionicPopup.alert({
                                      title: 'Il y a eu un problème!',
                                      template: "Vous n'avez pas entré de mot de passe"
                                      });
                    } else {
                    
                    // si le téléphone et le mot de passe ont été renseigné
                    
                    // On sauvegarde ll'identifiant de l'utilisateur
                    sessionStorage.setItem("phone", id);
                    
                    // On vérifie si l'utilisateur souhaite enregistrer ses identifiants
                    if (radio == true) {
                    
                    // On renseigne que les informations sont enregistrées et on sauvegarde le mot de passe
                    
                    sessionStorage.setItem("registered", "true");
                    
                    sessionStorage.setItem("mdp", password);
                    
                    }
                    
                    // On initialise la connexion à UCOPIA
                    
                    // La fenêtre d'attente
                    $ionicLoading.show({
                                       template: 'Connexion...'
                                       }).then(function () {
                                               console.log("The loading indicator is now displayed");
                                               });
                    
                    
                    // Le lien pour la requête REST
                    var url = 'https://hotspot.azur-wifly.com/portal_api.php?action=authenticate&login=' + id + '&password=' + password;
                    
                    // Envoi de la requête en GET
                    
                    $http.get(url, {
                              headers: {
                              'Accept': '*/*',
                              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                              'Access-Control-Max-Age': '3600',
                              'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                              'Access-Control-Allow-Credentials': 'true'
                              }
                              }).success(function (data) {
                                         
                                         // La requête a été transmise on ferme la fenêtre d'attentes
                                         $ionicLoading.hide().then(function () {
                                                                   console.log("The loading indicator is now hidden");
                                                                   });
                                         //console.log(data);
                                         
                                         // On vérifie que l'opération n'a pas d'erreur
                                         var desData = angular.fromJson(data);
                                         if (desData.error) {
                                         // Une erreur s'est produite au niveau d'UCOPIA
                                         // An alert dialog
                                         $ionicPopup.alert({
                                                           title: 'Il y a eu une erreur!',
                                                           template: desData.error.code
                                                           });
                                         
                                         //popupalert.show();
                                         //console.log(data);
                                         } else {
                                         
                                         
                                         
                                         // Il n'y a eu aucune erreur au niveau d'UCOPIA et nous avons reçu un objet avec des informations
                                         
                                         
                                         try {
                                         // On récupère dans l'objet les informations de l'utilisateur
                                         var userInfo = angular.fromJson(desData.user);
                                         
                                         // stay connected?
                                         sessionStorage.setItem("registered", "false");
                                         
                                         // User Info
                                         sessionStorage.setItem("phone", userInfo.login.value);
                                         
                                         // Sauvegarde du profil/forfait
                                         sessionStorage.setItem("profile_id", userInfo.profile.id);
                                         sessionStorage.setItem("profile_value", userInfo.profile.value);
                                         
                                         // Sauvegarde option deconnexion auto
                                         sessionStorage.setItem("autodisconnect", userInfo.autoDisconnect.value);
                                         
                                         // Sauvegarde validité profil
                                         /* Début */
                                         /*sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin.day);
                                          sessionStorage.setItem("schedule_begin_hour",userInfo.schedule.begin.hour);
                                          sessionStorage.setItem("schedule_begin_day",userInfo.schedule.begin.min);
                                          */
                                         sessionStorage.setItem("schedule_begin_day", userInfo.schedule.begin);
                                         
                                         /* Fin */
                                         /*
                                          sessionStorage.setItem("schedule_end_day",userInfo.schedule.end.day);
                                          sessionStorage.setItem("schedule_end_hour",userInfo.schedule.end.hour);
                                          sessionStorage.setItem("schedule_end_day",userInfo.schedule.end.min);
                                          */
                                         sessionStorage.setItem("schedule_end_day", userInfo.schedule.value[0].begin.day);
                                         
                                         // Validité
                                         sessionStorage.setItem("validity", userInfo.validity.value);
                                         
                                         // Initialisation du temps de la nouvelle connexion
                                         sessionStorage.setItem("init_time", userInfo.initTimeGMT.value);
                                         
                                         // Crédit temps
                                         sessionStorage.setItem("time_credit_value", userInfo.timeCredit);
                                         //sessionStorage.setItem("time_credit_remaining_value",userInfo.timeCredit.remaining);
                                         //sessionStorage.setItem("time_credit_reneweach_value",userInfo.timeCredit.reneweach);
                                         //sessionStorage.setItem("time_credit_initialremaining_value",userInfo.timeCredit.initialRemaining);
                                         
                                         // Informations utilisateurs
                                         sessionStorage.setItem("user_lastname", userInfo.lastName);
                                         sessionStorage.setItem("user_firstname", userInfo.firstName);
                                         sessionStorage.setItem("user_email", userInfo.email);
                                         sessionStorage.setItem("user_phone", userInfo.phoneNumber);
                                         
                                         } catch (ex) {
                                         // Une erreur s'est produite en enregistrant les données
                                         console.error('inner', ex.message);
                                         throw ex;
                                         } finally {
                                         // L'utilisateur est redirigé vers la page d'accueil
                                         $state.go('home');
                                         //console.log(userInfo);
                                         //console.log('finally');
                                         }
                                         
                                         }
                                         })
                    // La requête n'a pas pu être envoyée et a retourné une erreur
                    
                    .error(function (data) {
                           // On masque la fenêtre d'attente
                           
                           $ionicLoading.hide().then(function () {
                                                     
                                                     console.log("The loading indicator is now hidden");
                                                     
                                                     });
                           
                           //$scope.errors.push(status);
                           // On affiche une fenêtre pour alerter l'utilisateur sur l'erreur
                           
                           
                           // An alert dialog
                           
                           $ionicPopup.alert({
                                             
                                             title: 'Il y a eu un problème!',
                                             template: 'Nous n\'avons pas pu vous connecter'
                                             
                                             });
                           console.log(data);
                           });
                    }
                    
                    },
                    loginRegistered: function (id, password) {
                    // Affichage de la fenêtre d'attente
                    $ionicLoading.show({
                                       template: 'Connexion...'
                                       }).then(function () {
                                               console.log("Connexion de l'utilisateur...");
                                               });
                    
                    //Initialisation du lien de connexion
                    // Le lien est initialisé selon les recommandations du Manuel UCOPIA Portal API Version 5.1
                    var url = 'https://hotspot.azur-wifly.com/portal_api.php?action=authenticate&login=' + id + '&password=' + password;
                    
                    /// Transaction REST pour connecter l'utilisateur à UCOPIA
                    $http.get(
                              url, {
                              headers: {
                              'Accept': '*/*',
                              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                              'Access-Control-Max-Age': '3600',
                              'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                              'Access-Control-Allow-Credentials': 'true'
                              }
                              })
                    
                    // La connexion de l'utilisateur est réussie
                    .success(function (data) {
                             
                             // Fermeture de la fenêtre d'attente
                             $ionicLoading.hide().then(function () {
                                                       console.log("Connexion à Ucopia réussie");
                                                       });
                             //console.log(data);
                             
                             // Récupération de la réponse JSON du MiddleWare
                             // La liste des informations renvoyées par UCOPIA se trouve dans le manuel UCOPIA Portal API Version 5.1
                             var desData = angular.fromJson(data);
                             
                             // Vérification du message d'erreur
                             // Si il existe Message d'alerte à l'utilisateur
                             if (desData.error) {
                             
                             
                             $ionicPopup.alert({
                                               title: 'Il y a eu une erreur!',
                                               template: desData.error.code
                                               });
                             
                             }
                             // Si il n'y a aucun message d'erreur, enclencher une séquence pour stocker localement les informations
                             // de l'utilisateur envoyés par UCOPIA et rediriger l'utilisateur vers la page d'accueil.
                             else {
                             
                             // Récupération des informations utilisateurs
                             var userInfo = angular.fromJson(desData.user);
                             
                             // stay connected?"
                             //sessionStorage.setItem("registered","true");
                             
                             
                             // Informations de l'utilisateur
                             sessionStorage.setItem("phone", userInfo.login.value);
                             
                             // Sauvegarde de l'id et du libellé de l'option d'achat en vigueur
                             
                             sessionStorage.setItem("profile_id", userInfo.profile.id);
                             sessionStorage.setItem("profile_value", userInfo.profile.value);
                             
                             // Sauvegarde de l'état de l'option deconnexion auto
                             sessionStorage.setItem("autodisconnect", userInfo.autoDisconnect.value);
                             
                             
                             // Sauvegarde durée de validité profil
                             
                             /* Début */
                             
                             sessionStorage.setItem("schedule_begin_day", userInfo.schedule.value[0].begin.day);
                             
                             sessionStorage.setItem("schedule_begin_hour", userInfo.schedule.value[0].begin.hour);
                             sessionStorage.setItem("schedule_begin_day", userInfo.schedule.value[0].begin.min);
                             
                             
                             sessionStorage.setItem("schedule_begin_day", userInfo.schedule.begin);
                             
                             /* Fin */
                             
                             
                             sessionStorage.setItem("schedule_end_day", userInfo.schedule.value[0].end.day);
                             sessionStorage.setItem("schedule_end_hour", userInfo.schedule.value[0].end.hour);
                             sessionStorage.setItem("schedule_end_day", userInfo.schedule.value[0].end.min);
                             
                             
                             sessionStorage.setItem("schedule_end_day", userInfo.schedule.value[0].begin.day);
                             
                             
                             // Validité
                             
                             sessionStorage.setItem("validity", userInfo.validity.value);
                             
                             
                             // Initialisation du temps de la nouvelle connexion
                             
                             sessionStorage.setItem("init_time", userInfo.initTimeGMT.value);
                             
                             
                             // Crédit temps
                             
                             sessionStorage.setItem("time_credit_value", userInfo.timeCredit);
                             
                             //sessionStorage.setItem("time_credit_remaining_value",userInfo.timeCredit.remaining);
                             
                             //sessionStorage.setItem("time_credit_reneweach_value",userInfo.timeCredit.reneweach);
                             
                             //sessionStorage.setItem("time_credit_initialremaining_value",userInfo.timeCredit.initialRemaining);
                             
                             
                             // Informations utilisateurs
                             
                             sessionStorage.setItem("user_lastname", userInfo.lastName);
                             
                             sessionStorage.setItem("user_firstname", userInfo.firstName);
                             
                             sessionStorage.setItem("user_email", userInfo.email);
                             
                             sessionStorage.setItem("user_phone", userInfo.phoneNumber);
                             
                             
                             // Redirection de l'utilisateur vers la page d'accueil
                             $state.go('home');
                             
                             console.log(userInfo);
                             }
                             })
                    //En cas d'erreur lors de la connexion au MiddleWare
                    
                    .error(function (data, status) {
                           // Massquer la fenêtre d'attente
                           $ionicLoading.hide().then(function () {
                                                     console.log(data);
                                                     });
                           //$scope.errors.push(status);
                           // Afficher une alerte à l'utilisateur
                           $ionicPopup.alert({
                                             title: 'Il y a eu un problème!',
                                             template: data
                                             });
                           console.log(data);
                           });
                    
                    },
                    register: function (nom, prenom, phoneNumber, email, mdp) {
                    
                    
                    
                    // Une fenêtre d'attente est ouverte pour faire patienter l'utilisateur
                    $ionicLoading.show({
                                       template: 'Inscription...'
                                       }).then(function () {
                                               console.log("Inscription en cours...");
                                               });
                    
                    
                    
                    
                    
                    // On initialise le lien de connexion à UCOPIA
                    var url = 'https://hotspot.azur-wifly.com/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=adduser&user_id=' + phoneNumber + '&user_pwd=' + mdp + '&user_grp=test&user_lastname=' + nom + '&user_firstname=' + prenom + '&user_email=' + email + '&user_phonenumber=' + phoneNumber;
                    
                    
                    // On lance la requête d'inscription en GET
                    $http.get(url, {
                              headers: {
                              'Accept': '*/*',
                              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                              'Access-Control-Max-Age': '3600',
                              'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                              'Access-Control-Allow-Credentials': 'true'
                              }
                              }
                              
                              )
                    .success(function (data) {
                             // La requête a été reçue par UCOPIA
                             // On masque la fenêtre d'attente
                             
                             $ionicLoading.hide().then(function () {
                                                       console.log("La requête a bien été reçue par UCOPIA");
                                                       });
                             
                             // Récupération de la réponse d'UCOPIA pour analyse d'éventuels message d'erreurs
                             //
                             var desData = data.split(':');
                             if (desData[0] != 0) {
                             // Si le premier caractère du message est différent de zéro c'est qu'il y a eu une erreur lors de la tentative d'enregistrement
                             // On alerte l'utilisateur en lui donnant l'explication sur l'erreur fournie par UCOPIA
                             $ionicPopup.alert({
                                               title: 'Il y a eu une erreur!',
                                               template: desData[1]
                                               
                                               });
                             
                             } else {
                             // Le premier chiffre correspond à Zero et l'enregistrement s'est bien passé
                             // Préparation de l'envoi du SMS à l'utilisateur
                             
                             // Initialisation des variables du message
                             var from = "HotSpot AZUR-WIFLY";
                             var text = "Vous avez enregistré votre compte avec succès. \n Voici vos informations personnelles : \n Votre nom : " + nom + "\n Votre prénom : " + prenom + "\n Votre adresse Email : " + email + "\n Votre mot de passe : " + localStorage.mdp + "\n L\'équipe d\'Azur-Wifly vous souhaites une bon surf sur ses HotSpot.";
                             
                             
                             
                             // Nous devons vérifier à quel maison de téléphonie appartient l'utilisateur
                             var pref = phoneNumber.split('');
                             
                             if (pref[1] == '3') {
                             // L'utilisateur fait partie du réseau azur
                             // On initialise la variable pour envoyer le sms
                             var urlSmsc = 'http://azur-wifly.com:13132/cgi-bin/sendsms?smsc=smsc1&from=' + from + '&username=capp&password=musobase&to=' + phoneNumber + '&text=' + text;
                             
                             //Envoi de la requête pour l'envoi du sms à kannel sur le MiddleWare
                             $http.get(urlSmsc, {
                                       headers: {
                                       'Accept': '*/*',
                                       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                                       'Access-Control-Allow-Origin': '*',
                                       'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                       'Access-Control-Max-Age': '3600',
                                       'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                                       'Access-Control-Allow-Credentials': 'true'
                                       }
                                       })
                             .success(function (data) {
                                      // Le serveur a bien reçu la requête d'envoi de sms à l'utilisateur
                                      
                                      
                                      })
                             .error(function (data, status) {
                                    // La requête d'envoi de sms n'a pas pu être envoyées
                                    // On masque la fenêtre d'attente de l'utilisateur
                                    $ionicLoading.hide().then(function () {
                                                              console.log("une erreur s'est produite");
                                                              });
                                    
                                    // On affiche une fenêtre pour alerter l'utilisateur
                                    // An alert dialog
                                    var text = "Nous n'avons pu vous envoyer le sms. \n Voici vos informations personnelles.\n Vous devez les conserver précieusement, ils vous serviront pour vous connecter : \n Votre nom : " + nom + "\n Votre prénom : " + prenom + "\n Votre adresse Email : " + email + "\n Votre mot de passe : " + localStorage.mdp + "\n L\'équipe d\'Azur-Wifly vous souhaites une bon surf sur ses HotSpot.";
                                    
                                    $ionicPopup.alert({
                                                      title: 'Il y a eu un problème!',
                                                      template: text
                                                      });
                                    
                                    });
                             
                             
                             } else {
                             // Envoi du sms par un autre moyen
                             
                             }
                             
                             
                             
                             
                             // Lancer la vue Home
                             $state.go('home');
                             }
                             })
                    .error(function (data) {
                           // L'enregistrement n'a pu être fait et aucune requête n'est parvenue à UCOPIA
                           // On masque la fenêtre d'attente
                           $ionicLoading.hide().then(function () {
                                                     console.log("L'enregistrement n'a pu être fait et aucune requête n'est parvenue à UCOPIA");
                                                     console.log(data)
                                                     });
                           
                           // On alerte l'utilisateur
                           
                           $ionicPopup.alert({
                                             title: 'Il y a eu un problème!',
                                             template: "Nous n'avons pas pu procéder à votre enregistrement. \n Veuillez recommencer s'il vous plait."
                                             });
                           
                           
                           });
                    
                    },
                    loadInit: function (e) {
                    sessionStorage.clear();
                    
                    
                    var url = 'https://hotspot.azur-wifly.com/portal_api.php?action=init';
                    $http.get(url, {
                              headers: {
                              'Accept': '*/*',
                              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                              'Access-Control-Max-Age': '3600',
                              'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                              'Access-Control-Allow-Credentials': 'true'
                              }
                              }).success(function (data) {
                                         $ionicLoading.hide().then(function () {
                                                                   console.log("The loading indicator is now hidden");
                                                                   
                                                                   });
                                         //console.log(data);
                                         
                                         var desData = angular.fromJson(data);
                                         console.log(desData);
                                         scope.forfaits = angular.fromJson(desData);
                                         
                                         console.log(angular.fromJson(desData));
                                         
                                         var userInfo = angular.fromJson(desData.user);
                                         
                                         // stay connected?
                                         sessionStorage.setItem("registered", "false");
                                         
                                         // User Info
                                         sessionStorage.setItem("phone", userInfo.login.value);
                                         
                                         // Sauvegarde du profil/forfait
                                         sessionStorage.setItem("profile_id", userInfo.profile.id);
                                         sessionStorage.setItem("profile_value", userInfo.profile.value);
                                         
                                         // Sauvegarde option deconnexion auto
                                         sessionStorage.setItem("autodisconnect", userInfo.autoDisconnect.value);
                                         
                                         // Sauvegarde validité profil
                                         /* Début */
                                         sessionStorage.setItem("schedule_begin_day", userInfo.schedule.value[0].begin.day);
                                         sessionStorage.setItem("schedule_begin_hour", userInfo.schedule.value[0].begin.hour);
                                         sessionStorage.setItem("schedule_begin_day", userInfo.schedule.value[0].begin.min);
                                         
                                         
                                         /* Fin */
                                         
                                         
                                         sessionStorage.setItem("schedule_end_day", userInfo.schedule.value[0].end.day);
                                         sessionStorage.setItem("schedule_end_hour", userInfo.schedule.value[0].end.hour);
                                         sessionStorage.setItem("schedule_end_day", userInfo.schedule.value[0].end.min);
                                         
                                         
                                         // Validité
                                         sessionStorage.setItem("validity", userInfo.validity.value);
                                         
                                         //Données consommées
                                         sessionStorage.setItem("consumed_montant", userInfo.consumedData.upload.value);
                                         sessionStorage.setItem("consumed_descendant", userInfo.consumedData.download.value);
                                         
                                         //Données restantes
                                         sessionStorage.setItem("debit_restant_montant", userInfo.consumedData.extra.value[1].available.upload);
                                         sessionStorage.setItem("debit_restant_descendant", userInfo.consumedData.extra.value[1].available.download);
                                         
                                         //Bande passante
                                         sessionStorage.setItem("bande_passante", userInfo.consumedData.extra.value[0].bandwidth.download);
                                         
                                         
                                         // Initialisation du temps de la nouvelle connexion
                                         sessionStorage.setItem("init_time", userInfo.initTimeGMT.value);
                                         
                                         // Crédit temps
                                         sessionStorage.setItem("time_credit_value", userInfo.timeCredit);
                                         //sessionStorage.setItem("time_credit_remaining_value",userInfo.timeCredit.remaining);
                                         //sessionStorage.setItem("time_credit_reneweach_value",userInfo.timeCredit.reneweach);
                                         //sessionStorage.setItem("time_credit_initialremaining_value",userInfo.timeCredit.initialRemaining);
                                         
                                         // Informations utilisateurs
                                         sessionStorage.setItem("user_lastname", userInfo.lastName);
                                         sessionStorage.setItem("user_firstname", userInfo.firstName);
                                         sessionStorage.setItem("user_email", userInfo.email);
                                         sessionStorage.setItem("user_phone", userInfo.phoneNumber);
                                         
                                         
                                         
                                         }).error(function (data, status) {
                                                  $ionicLoading.hide().then(function () {
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
                    },
                    initView: function (e) {
                    scope.useruserName = sessionStorage.phone;
                    scope.userProfile = sessionStorage.profile_value;
                    scope.userautoDisconnect = sessionStorage.autodisconnect;
                    var date = new Date(sessionStorage.validity * 1000);
                    //Day
                    var day = date.getDay();
                    switch (day) {
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
                    switch (month) {
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
                    var formattedTime = day + ' ' + date_of_day + ' ' + month + ' ' + year + ' à ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    scope.userValidity = formattedTime;
                    //$scope.userTimeremain = sessionStorage.init_time;
                    
                    //$scope.userTimeremain = bytesToSize(sessionStorage.consumed_montant);
                    scope.debit_montant = bytesToSize(sessionStorage.consumed_montant);
                    scope.debit_descendant = bytesToSize(sessionStorage.consumed_descendant);
                    
                    scope.reste_montant = bytesToSize(sessionStorage.debit_restant_montant);
                    scope.reste_descendant = bytesToSize(sessionStorage.debit_restant_descendant);
                    scope.bande_passante = bytesToSize2(sessionStorage.bande_passante);
                    
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
                    },
                    airtelMoney: function (mnt) {
                    
                    
                    
                    
                    }
                    }
                    
                    }).factory('objPayment', function ($rootScope, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {
                               
                               var scope = $rootScope.$new();
                               return {
                               getOR: function () {
                               // Dès que l'utilisateur entre dans la vue on initialise le lien pour récupérer les options de rechargement
                               
                               var url_forfait = 'https://hotspot.azur-wifly.com/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=get_refill_options&reply_format=json';
                               
                               // On lance la requête pour les options de rechargement
                               $http.get(url_forfait, {
                                         headers: {
                                         'Accept': '*/*',
                                         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                                         'Access-Control-Allow-Origin': '*',
                                         'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                         'Access-Control-Max-Age': '3600',
                                         'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                                         'Access-Control-Allow-Credentials': 'true'
                                         }
                                         })
                               .success(function (data) {
                                        // la requête a bien été reçue par UCOPIA
                                        
                                        // On masque la fenêtre d'attente
                                        $ionicLoading.hide().then(function () {
                                                                  console.log("la requête a bien été reçue par UCOPIA");
                                                                  
                                                                  });
                                        
                                        
                                        // On récupère les données Json envoyés par UCOPIA et on les insère dans une variable tableau
                                        var desData = angular.fromJson(data);
                                        console.log(desData);
                                        scope.forfaits = angular.fromJson(desData);
                                        
                                        })
                               
                               .error(function (data, status) {
                                      // La requête n'a pas été recue par UCOPIA
                                      // On masque la fenêtre d'attente
                                      $ionicLoading.hide().then(function () {
                                                                console.log("La requête n'a pas été recue par UCOPIA");
                                                                });
                                      
                                      
                                      // On alerte l'utilisateur
                                      $ionicPopup.alert({
                                                        title: 'Il y a eu un problème!',
                                                        template: "Une erreur s'est produite, nous n'avons pas pu récupérer les options de rechargement. \n Veuillez redémarrer votre application."
                                                        });
                                      
                                      });
                               
                               },
                               initForfait: function (forfait, radio) {
                               // L'utilisateur souhaite créditer son compte pour accéder à internet
                               //console.log(value);
                               
                               
                               
                               if (forfait != null) {
                               // L'utilisateur a bien renseigné une option de rechargement pour achat
                               
                               
                               // On stocke les informations particulères de l'option dans des variables
                               sessionStorage.setItem("forfait", forfait);
                               //sessionStorage.setItem("montant",value.selectforfait);
                               var prix = sessionStorage.forfait;
                               var prix_parse = prix.split(",");
                               //console.log(prix_parse[1]);
                               
                               sessionStorage.setItem("montant", prix_parse[1]);
                               sessionStorage.setItem("forfait_id", prix_parse[0]);
                               
                               
                               
                               switch (radio) {
                               
                               
                               // Si l'utilisateur a selectionné azur comme méthode de paiement
                               case "azur":
                               /*$state.go("azur");
                                console.log("azur");
                                sessionStorage.setItem("portefeuille","azur");*/
                               $ionicLoading.show({
                                                  template: 'Connexion...'
                                                  }).then(function () {
                                                          console.log("The loading indicator is now displayed");
                                                          });
                               
                               
                               
                               
                               var url = 'http://azur-wifly.com/service/soap/client-azur.php?montant=' + sessionStorage.montant + '&transaction=debit&phone=' + sessionStorage.phone;
                               
                               $http.get(url, {
                                         headers: {
                                         'Accept': '*/*',
                                         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                                         'Access-Control-Allow-Origin': '*',
                                         'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                         'Access-Control-Max-Age': '3600',
                                         'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                                         'Access-Control-Allow-Credentials': 'true'
                                         }
                                         }).success(function (data) {
                                                    
                                                    $ionicLoading.hide().then(function () {
                                                                              console.log("The loading indicator is now hidden");
                                                                              });
                                                    
                                                    console.log(data);
                                                    
                                                    if (typeof data.soapenvBody.ns9createSubscriptionTransactionResponse != "undefined") {
                                                    //noinspection JSAnnotator
                                                    sessionStorage.setItem('accountId', data.soapenvBody.ns9createSubscriptionTransactionResponse.ns9return.ns3accountID);
                                                    //noinspection JSAnnotator
                                                    sessionStorage.setItem('amount', data.soapenvBody.ns9createSubscriptionTransactionResponse.ns9return.ns3amount);
                                                    //noinspection JSAnnotator
                                                    sessionStorage.setItem('balance', data.soapenvBody.ns9createSubscriptionTransactionResponse.ns9return.ns3balance);
                                                    
                                                    //
                                                    } else {
                                                    $ionicLoading.hide().then(function () {
                                                                              console.log("The loading indicator is now hidden");
                                                                              });
                                                    console.log('Une erreur est survenue. Votre solde est insufisant. \nVeuillez recharger votre compte !');
                                                    //if ()
                                                    $ionicPopup.alert({
                                                                      title: 'une erreur est survenue',
                                                                      template: data
                                                                      });
                                                    
                                                    }
                                                    
                                                    // console.log('ok'+data);
                                                    
                                                    }).error(function (data, status) {
                                                             $ionicLoading.hide().then(function () {
                                                                                       console.log("The loading indicator is now hidden");
                                                                                       });
                                                             console.log('une erreur est survenue' + data);
                                                             $ionicPopup.alert({
                                                                               title: 'une erreur est survenue',
                                                                               template: data
                                                                               });
                                                             
                                                             
                                                             });
                               break;
                               case "bgfi":
                               $state.go("bgfi1");
                               console.log("bgfi");
                               sessionStorage.setItem("portefeuille", "bgfi");
                               break;
                               case "airtel":
                               $state.go("airtel");
                               console.log("airtel");
                               sessionStorage.setItem("portefeuille", "airtel");
                               break;
                               case "flooz":
                               $state.go("flooz");
                               console.log("flooz");
                               sessionStorage.setItem("portefeuille", "flooz");
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
                               },
                               flooz: function () {
                               
                               },
                               airtel: function () {
                               
                               },
                               refill: function (forfait) {
                               var url_forfait = 'https://hotspot.azur-wifly.com/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=get_refill_code&option_id=' + forfait + '&reply_format=json';
                               
                               $http.get(url_forfait, {
                                         headers: {
                                         'Accept': '*/*',
                                         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                                         'Access-Control-Allow-Origin': '*',
                                         'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                         'Access-Control-Max-Age': '3600',
                                         'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                                         'Access-Control-Allow-Credentials': 'true'
                                         }
                                         }).success(function (data) {
                                                    $ionicLoading.hide().then(function () {
                                                                              console.log("The loading indicator is now hidden");
                                                                              
                                                                              });
                                                    
                                                    sessionStorage.setItem("refill_code", data.result)
                                                    
                                                    
                                                    
                                                    }).error(function (data, status) {
                                                             $ionicLoading.hide().then(function () {
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
                               
                               },
                               webcodeBgfi: function (webcode) {
                               
                               if (webcode == "webcode") {
                               // L'utilisateur n'a pas renseigné aucun webcode
                               
                               // On affiche une fenêtre pour l'alerter
                               $ionicPopup.alert({
                                                 title: 'Il y a eu un problème!',
                                                 template: "Vous n'avez pas renseigné le webcode fourni par BGFI"
                                                 });
                               
                               } else {
                               // creation du lien pour l'API BGFI
                               
                               var url = 'http://azur-wifly.com/service/bgfi.php?tag=payment&phone=241' + sessionStorage.phoneMoney + '&montant=' + sessionStorage.montant + '&token=' + sessionStorage.token + '&reference=' + sessionStorage.reference + '&webcode=' + webcode;
                               
                               // On affiche une fenêtre d'attente
                               $ionicLoading.show({
                                                  
                                                  template: 'Transaction en cours...'
                                                  
                                                  }).then(function () {
                                                          
                                                          console.log("Transaction en cours...");
                                                          
                                                          });
                               
                               
                               // On lance la requête auprès de BGFI
                               $http.get(url)
                               
                               .success(function (data) {
                                        // BGFI a reçu la requête
                                        
                                        // On masque la fenêtre d'attente
                                        $ionicLoading.hide().then(function () {
                                                                  
                                                                  console.log("The loading indicator is now hidden");
                                                                  
                                                                  });
                                        
                                        //on cherche les erreurs venant d'UCOPIA
                                        
                                        if (data.error_code === 1) {
                                        // UCOPIA nous a renvoyé une erreur
                                        
                                        
                                        // Nous alertons l'utilisateur
                                        $ionicPopup.alert({
                                                          
                                                          title: 'Il y a eu un problème!',
                                                          
                                                          template: data.message
                                                          });
                                        
                                        
                                        } else {
                                        // UCOPIA n'a renvoyé aucune erreur
                                        
                                        
                                        // On initialise le lien
                                        
                                        var url_forfait = 'https://hotspot.azur-wifly.com/deleg/api_admin_deleg.php?deleg_id=andy&deleg_pwd=andy&action=set_refill_code_info&refill_code=' + sessionStorage.refill_code + '&user_id=' + sessionStorage.phone;
                                        
                                        
                                        
                                        // On lance la requête
                                        $http.get(url_forfait, {
                                                  headers: {
                                                  'Accept': '*/*',
                                                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit (KHTML, like Gecko) Chrome Safari',
                                                  'Access-Control-Allow-Origin': '*',
                                                  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                                  'Access-Control-Max-Age': '3600',
                                                  'Access-Control-Allow-Headers': 'x-requested-with,origin,content-type,accept,X-XSRF-TOKEN',
                                                  'Access-Control-Allow-Credentials': 'true'
                                                  }
                                                  })
                                        .success(function (data) {
                                                 // UCOPIA a bien reçu la requête
                                                 // On masque la fenêtre d'attente
                                                 
                                                 $ionicLoading.hide().then(function () {
                                                                           
                                                                           console.log("The loading indicator is now hidden");
                                                                           
                                                                           
                                                                           });
                                                 
                                                 console.log(data);
                                                 
                                                 // On redirige l'utilisateur vers la page d'accueil
                                                 $state.go('home');
                                                 
                                                 })
                                        .error(function (data, status) {
                                               //UCOPIA n'a pas reçu de requête
                                               
                                               // On masque la fenêtre d'attente
                                               $ionicLoading.hide().then(function () {
                                                                         
                                                                         console.log("The loading indicator is now hidden");
                                                                         
                                                                         });
                                               
                                               // On alerte l'utilisateur sur l'erreur
                                               $ionicPopup.alert({
                                                                 title: 'Il y a eu un problème!',
                                                                 template: data
                                                                 });
                                               console.log(data);
                                               });
                                        
                                        }
                                        })
                               .error(function (data, status) {
                                      // Bgfi n'a reçu aucune requête
                                      
                                      // On masque la fenêtre d'attente
                                      $ionicLoading.hide().then(function () {
                                                                
                                                                console.log("The loading indicator is now hidden");
                                                                
                                                                });
                                      
                                      
                                      // On alerte l'utilisateur
                                      
                                      $ionicPopup.alert({
                                                        
                                                        title: 'Il y a eu un problème!',
                                                        
                                                        template: status
                                                        
                                                        });
                                      
                                      console.log(status);
                                      });
                               
                               }
                               
                               },
                               phoneBgfi: function (phone) {
                               
                               
                               if (phone == "phone") {
                               
                               // An alert dialog
                               $ionicPopup.alert({
                                                 title: 'Il y a eu un problème!',
                                                 template: "Vous n'avez pas renseigné votre numéro de téléphone"
                                                 });
                               
                               } else {
                               sessionStorage.setItem("phoneMoney", phone);
                               var url = 'http://azur-wifly.com/service/bgfi.php?tag=init&phone=241' + phone + '&montant=' + sessionStorage.montant;
                               
                               
                               
                               $ionicLoading.show({
                                                  template: 'Transaction en cours...'
                                                  }).then(function () {
                                                          console.log("The loading indicator is now displayed ok");
                                                          });
                               
                               // Récupération d'un token
                               
                               $http.get(url
                                         
                                         ).success(function (data) {
                                                   
                                                   //console.log(data);
                                                   if (data.error_code === 1) {
                                                   $ionicLoading.hide().then(function () {
                                                                             console.log("The loading indicator is now hidden");
                                                                             });
                                                   // An alert dialog
                                                   $ionicPopup.alert({
                                                                     title: 'Il y a eu un problème!',
                                                                     template: data.message
                                                                     });
                                                   
                                                   } else {
                                                   sessionStorage.setItem("token", data.token);
                                                   sessionStorage.setItem("reference", data.reference);
                                                   
                                                   console.log(sessionStorage.token);
                                                   console.log(sessionStorage.reference);
                                                   console.log(sessionStorage.portefeuille);
                                                   
                                                   
                                                   
                                                   $state.go('bgfi2');
                                                   
                                                   
                                                   }
                                                   }).error(function (data, status) {
                                                            $ionicLoading.hide().then(function () {
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
                               }
                               });
