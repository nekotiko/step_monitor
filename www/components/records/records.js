/**
 * Created by bakeneko on 3/31/17.
 */


stepMonitorApp
    .controller('RecordsController', function ($scope, $rootScope, $DBService, $timeout) {


            $scope.availableRecords = [],


            $scope.recording = false,

            $scope.stopRecording = function () {
                $scope.recording = false;
            },

            $scope.__startRecording = function (results) {

                if (results.buttonIndex == 0){ //ok
                    $scope.recording = true;
                }
             } ,

            $scope.startRecording = function () {

                navigator.notification.prompt(
                    'Session Name',  // message
                    $scope.__startRecording,                  // callback to invoke
                    'Workout',            // title
                    ['Ok','Exit'],             // buttonLabels
                    ''
                );
            }


    });