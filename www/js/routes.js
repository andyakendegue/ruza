angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('connexion', {
    url: '/page1',
    templateUrl: 'templates/connexion.html',
    controller: 'connexionCtrl'
  })

  .state('inscription', {
    url: '/page2',
    templateUrl: 'templates/inscription.html',
    controller: 'inscriptionCtrl'
  })

  .state('home', {
    url: '/page3',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('sLectionDuForfait', {
    url: '/page5',
    templateUrl: 'templates/sLectionDuForfait.html',
    controller: 'sLectionDuForfaitCtrl'
  })

  .state('bgfi1', {
    url: '/page6',
    templateUrl: 'templates/bGFI1.html',
    controller: 'bGFI1Ctrl'
  })

  .state('bgfi2', {
    url: '/page7',
    templateUrl: 'templates/bGFI2.html',
    controller: 'bGFI2Ctrl'
  })

  .state('airtel', {
    url: '/page10',
    templateUrl: 'templates/aIRTEL.html',
    controller: 'aIRTELCtrl'
  })

  .state('flooz', {
    url: '/page13',
    templateUrl: 'templates/fLOOZ.html',
    controller: 'fLOOZCtrl'
  })

  .state('clientsAzur', {
    url: '/page14',
    templateUrl: 'templates/clientsAzur.html',
    controller: 'clientsAzurCtrl'
  })


      .state('azur', {
        url: '/page16',
        templateUrl: 'templates/fLOOZ.html',
        controller: 'fLOOZCtrl'
      })

$urlRouterProvider.otherwise('/page1')

  

});