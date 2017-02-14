angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);

angular.module('starter.services', ['ngCordova'])

//NOTE: We are including the constant `ApiEndpoint` to be used here.
  .factory('Api', function($http, ApiEndpoint) {
    console.log('ApiEndpoint', ApiEndpoint);

    var getApiData = function() {
      return $http.get(ApiEndpoint.url + '/tasks')
        .then(function(data) {
          console.log('Got some data: ', data);
          return data;
        });
    };

    return {
      getApiData: getApiData
    };
  })
    .factory('NotesDataService', function ($cordovaSQLite, $ionicPlatform) {
        var db, dbName = "noteDemo.db";

        function useWebSql() {
            db = window.openDatabase(dbName, "1.0", "Note database", 200000)
            console.info('Using webSql')
        }

        function useSqlLite() {
            db = $cordovaSQLite.openDB({name: dbName, location : 1})
            console.info('Using SQLITE')
        }

        function initDatabase(){
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_NOTE (id integer primary key, title, content)')
                .then(function(res){

                }, onErrorQuery)
        }

        $ionicPlatform.ready(function () {
            if(window.cordova){
                useSqlLite()
            } else {
                useWebSql()
            }

            initDatabase()
        });

        function onErrorQuery(err){
            console.error(err)
        }

        return {
            createNote: function (note) {
                return $cordovaSQLite.execute(db, 'INSERT INTO T_NOTE (title, content) VALUES(?, ?)', [note.title, note.content])
            },
            updateNote: function(note){
                return $cordovaSQLite.execute(db, 'UPDATE T_NOTE set title = ?, content = ? where id = ?', [note.title, note.content, note.id])
            },
            getAll: function(callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_NOTE').then(function (results) {
                        var data = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            data.push(results.rows.item(i))
                        }

                        callback(data)
                    }, onErrorQuery)
                })
            },

            deleteNote: function(id){
                return $cordovaSQLite.execute(db, 'DELETE FROM T_NOTE where id = ?', [id])
            },

            getById: function(id, callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_NOTE where id = ?', [id]).then(function (results) {
                        callback(results.rows.item(0))
                    })
                })
            }
        }
    }).factory('GetUserInfo', function ($cordovaSQLite,$rootScope, $ionicPlatform,$cordovaLocalNotification) {

    // from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }


    // Notifications

    $ionicPlatform.ready(function () {

        // ========== Scheduling

        $scope.scheduleSingleNotification = function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Title here',
                text: 'Text here',
                data: {
                    customProperty: 'custom value'
                }
            }).then(function (result) {
                // ...
            });
        };

        $scope.scheduleMultipleNotifications = function () {
            $cordovaLocalNotification.schedule([
                {
                    id: 1,
                    title: 'Title 1 here',
                    text: 'Text 1 here',
                    data: {
                        customProperty: 'custom 1 value'
                    }
                },
                {
                    id: 2,
                    title: 'Title 2 here',
                    text: 'Text 2 here',
                    data: {
                        customProperty: 'custom 2 value'
                    }
                },
                {
                    id: 3,
                    title: 'Title 3 here',
                    text: 'Text 3 here',
                    data: {
                        customProperty: 'custom 3 value'
                    }
                }
            ]).then(function (result) {
                // ...
            });
        };

        $scope.scheduleDelayedNotification = function () {
            var now = new Date().getTime();
            var _10SecondsFromNow = new Date(now + 10 * 1000);

            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Title here',
                text: 'Text here',
                at: _10SecondsFromNow
            }).then(function (result) {
                // ...
            });
        };

        $scope.scheduleEveryMinuteNotification = function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Title here',
                text: 'Text here',
                every: 'minute'
            }).then(function (result) {
                // ...
            });
        };

        // =========/ Scheduling

        // ========== Update

        $scope.updateSingleNotification = function () {
            $cordovaLocalNotification.update({
                id: 1,
                title: 'Title - UPDATED',
                text: 'Text - UPDATED'
            }).then(function (result) {
                // ...
            });
        };

        $scope.updateMultipleNotifications = function () {
            $cordovaLocalNotification.update([
                {
                    id: 1,
                    title: 'Title 1 - UPDATED',
                    text: 'Text 1 - UPDATED'
                },
                {
                    id: 2,
                    title: 'Title 2 - UPDATED',
                    text: 'Text 2 - UPDATED'
                },
                {
                    id: 3,
                    title: 'Title 3 - UPDATED',
                    text: 'Text 3 - UPDATED'
                }
            ]).then(function (result) {
                // ...
            });
        };

        // =========/ Update

        // ========== Cancelation

        $scope.cancelSingleNotification = function () {
            $cordovaLocalNotification.cancel(1).then(function (result) {
                // ...
            });
        };

        $scope.cancelMultipleNotifications = function () {
            $cordovaLocalNotification.cancel([1, 2]).then(function (result) {
                // ...
            });
        };

        $scope.cancelAllNotifications = function () {
            $cordovaLocalNotification.cancelAll().then(function (result) {
                // ...
            });
        };

        // =========/ Cancelation

        // ========== Events

        $rootScope.$on('$cordovaLocalNotification:schedule',
            function (event, notification, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:trigger',
            function (event, notification, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:update',
            function (event, notification, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:clear',
            function (event, notification, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:clearall',
            function (event, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:cancel',
            function (event, notification, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:cancelall',
            function (event, state) {
                // ...
            });

        $rootScope.$on('$cordovaLocalNotification:click',
            function (event, notification, state) {
                // ...
            });

        // =========/ Events

    });

}).factory('NotificationService', function ($scope, $rootScope, $ionicPlatform, $cordovaLocalNotification) {

    return {
        scheduleSingleNotification : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'Title here',
                    text: 'Text here',
                    data: {
                        customProperty: 'custom value'
                    }
                }).then(function (result) {
                    // ...
                });
            })
        },
        scheduleMultipleNotifications : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule([
                    {
                        id: 1,
                        title: 'Title 1 here',
                        text: 'Text 1 here',
                        data: {
                            customProperty: 'custom 1 value'
                        }
                    },
                    {
                        id: 2,
                        title: 'Title 2 here',
                        text: 'Text 2 here',
                        data: {
                            customProperty: 'custom 2 value'
                        }
                    },
                    {
                        id: 3,
                        title: 'Title 3 here',
                        text: 'Text 3 here',
                        data: {
                            customProperty: 'custom 3 value'
                        }
                    }
                ]).then(function (result) {
                    // ...
                })
            })
        },
        scheduleDelayedNotification : function (value) {
            $ionicPlatform.ready(function () {
                var now = new Date().getTime();
                var _10SecondsFromNow = new Date(now + 10 * 1000);

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'Title here',
                    text: 'Text here',
                    at: _10SecondsFromNow
                }).then(function (result) {
                    // ...
                })

            })
        },


        scheduleEveryMinuteNotification : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'Title here',
                    text: 'Text here',
                    every: 'minute'
                }).then(function (result) {
                    // ...
                })
            })
        },

        // =========/ Scheduling

        // ========== Update

        updateSingleNotification : function () {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.update({
                    id: 1,
                    title: 'Title - UPDATED',
                    text: 'Text - UPDATED'
                }).then(function (result) {
                    // ...
                })
            })
        },

        updateMultipleNotifications : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.update([
                    {
                        id: 1,
                        title: 'Title 1 - UPDATED',
                        text: 'Text 1 - UPDATED'
                    },
                    {
                        id: 2,
                        title: 'Title 2 - UPDATED',
                        text: 'Text 2 - UPDATED'
                    },
                    {
                        id: 3,
                        title: 'Title 3 - UPDATED',
                        text: 'Text 3 - UPDATED'
                    }
                ]).then(function (result) {
                    // ...
                })
            })
        },

        // =========/ Update

        // ========== Cancelation

        cancelSingleNotification : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.cancel(1).then(function (result) {
                    // ...
                })
            })
        },

        cancelMultipleNotifications : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.cancel([1, 2]).then(function (result) {
                    // ...
                })
            })
        },

        cancelAllNotifications : function (value) {
            $ionicPlatform.ready(function () {
                $cordovaLocalNotification.cancelAll().then(function (result) {
                    // ...
                })
            })
        }

        // =========/ Cancelation

    }


})

    .factory('NotesDataService', function ($cordovaSQLite, $ionicPlatform) {
        var db, dbName = "noteDemo.db"

        function useWebSql() {
            db = window.openDatabase(dbName, "1.0", "Note database", 200000)
            console.info('Using webSql')
        }

        function useSqlLite() {
            db = $cordovaSQLite.openDB({name: dbName, location: 1})
            console.info('Using SQLITE')
        }

        function initDatabase() {
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_NOTE (id integer primary key, title, content)')
                .then(function (res) {

                }, onErrorQuery)
        }

        $ionicPlatform.ready(function () {
            if (window.cordova) {
                useSqlLite()
            } else {
                useWebSql()
            }

            initDatabase()
        })

        function onErrorQuery(err) {
            console.error(err)
        }

        return {
            createNote: function (note) {
                return $cordovaSQLite.execute(db, 'INSERT INTO T_NOTE (title, content) VALUES(?, ?)', [note.title, note.content])
            },
            updateNote: function (note) {
                return $cordovaSQLite.execute(db, 'UPDATE T_NOTE set title = ?, content = ? where id = ?', [note.title, note.content, note.id])
            },
            getAll: function (callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_NOTE').then(function (results) {
                        var data = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            data.push(results.rows.item(i))
                        }

                        callback(data)
                    }, onErrorQuery)
                })
            },

            deleteNote: function (id) {
                return $cordovaSQLite.execute(db, 'DELETE FROM T_NOTE where id = ?', [id])
            },

            getById: function (id, callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_NOTE where id = ?', [id]).then(function (results) {
                        callback(results.rows.item(0))
                    })
                })
            }
        }
    })

;
