/**
 * Created by bakeneko on 3/31/17.
 */


var RECORDS_FOUND = 'records_found';
angular.module('StepMonitor')
    .controller('RecordsController', function ($scope, $rootScope, $DBService) {

            console.log('Records Controller Loaded');

            $scope.availableRecords = [],
            $scope.recording = false,
            $scope.recording_zero_instant = 0,

            $scope.stopRecording = function () {
                $scope.recording = false;
            },

            $scope.__startRecording = function (results) {

                if (results.buttonIndex == 1){ //Ok
                    $scope.recording = true;
                    $scope.recording_zero_instant = (new Date()).getTime();
                    var name = results.input1;
                    if (name)
                        $DBService.create_workout(name);
                    else{

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

            $rootScope.$on(RECORDS_FOUND, function(event_name, records){
                console.log('Record Found');
                console.log(records);
                if (!records){
                    records.push({id: 'abc', name: 'TEst Record'});
                }
                $scope.availableRecords.length = 0;
                $scope.availableRecords.push(records);
                $rootScope.$digest();

            })
    });

