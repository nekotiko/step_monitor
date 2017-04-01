/**
 * Created by bakeneko on 3/31/17.
 */


var RECORDS_FOUND = 'records_found';
angular.module('StepMonitor')
    .controller('RecordsController', function ($scope, $rootScope, $DBService) {

            console.log('Records Controller Loaded');

            $scope.availableRecords = [],
            $scope.recording = false,
            $scope.selectedElements = false,
            $scope.recording_zero_instant = 0,
            $scope.selectElem = null,

            $scope.stopRecording = function () {
                $scope.recording = false;
            },

            $scope.__startRecording = function (results) {

                if (results.buttonIndex == 1){ //Ok
                    $scope.recording = true;
                    $scope.recording_zero_instant = (new Date()).getTime();
                    var name = results.input1;
                    if (name) {
                        $DBService.create_workout(name);
                        $scope.load_records();
                    } else {
                        navigator.notification.alert('Could not create record');
                    }
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
            },

            $scope.load_records = function () {
                var loadRecord = function (tx, results){
                    $rootScope.$broadcast(RECORDS_FOUND, results.rows);
                };
                $DBService.load_workouts(loadRecord);
            },
            
            $scope.deleteRecord = function () {
                console.log('About to delete' + $scope.selectElem.id);
                $DBService.delete_workout($scope.selectElem.id);

                $scope.load_records();
            },

            $scope.select_element = function (item) {
                $scope.selectElem = item;


            },

            $rootScope.$on(RECORDS_FOUND, function(event_name, records){
                $scope.availableRecords.length = 0;
                 for (var i in records){
                    $scope.availableRecords.push(records[i]);
                }
                $rootScope.$digest();

            })
    });

