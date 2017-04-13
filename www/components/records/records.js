/**
 * Created by bakeneko on 3/31/17.
 */


var RECORDS_FOUND = 'records_found';
angular.module('StepMonitor')
    .controller('RecordsController', function ($scope, $rootScope, $DBService, $BLEService, $GlobalState) {

            $scope.availableRecords = [],
            $scope.selectedElements = false,
            $rootScope.selectElem = null,

            $scope.stopRecording = function () {
                $GlobalState.stopRecording();
            },

            $scope.__startRecording = function (results) {

                if (results.buttonIndex == 1) { //Ok
                    $GlobalState.startRecording();
                    $GlobalState.setZeroInstant((new Date()).getTime());
                    var name = results.input1;
                    if (name) {
                        var id = $DBService.create_workout(name);
                        $rootScope.selectElem = {'id': id, 'name': name};
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
                    ['Ok', 'Exit'],             // buttonLabels
                    ''
                );
            },

            $scope.load_records = function () {
                var loadRecord = function (tx, results) {
                    $rootScope.$broadcast(RECORDS_FOUND, results.rows);
                };
                $DBService.load_workouts(loadRecord);
            },

            $scope.deleteRecord = function () {
                console.log('About to delete: ' + $rootScope.selectElem.id);
                $DBService.delete_workout($rootScope.selectElem.id, function () {
                    $scope.load_records();
                });

            },

            $scope.select_element = function (item) {
                $rootScope.selectElem = item;
                $scope.availableRecords.map(function (item) {
                    item.selected = false;
                })
                item.selected = true;
            },

            $scope.sentRecord = function () {
                console.log('About to sent: ' + $rootScope.selectElem.id);

                $DBService.get_workout($rootScope.selectElem.id, function (tx, workout) {
                    $DBService.get_details($rootScope.selectElem.id, function (d_tx, details) {

                        var work = workout.rows.item(0);

                        var msg = "Name: [" + work.name + "] - Date[" + work.start + "]\n";
                        msg += "INSTANT,LEFT_HEEL,LEFT_SOLE,RIGHT_HEEL,RIGHT_SOLE\n";
                        for (var i in details.rows) {
                            var d = details.rows.item(i);
                            msg += d.instant + "," + d.l_h + "," + d.l_i + "," + d.r_h + "," + d.r_i + "\n";
                        }

                        var callback = function (msg) {
                            console.log("Email: " + msg);
                        };

                        cordova.plugins.email.open({
                            to: ['step_monitor@mailinator.com', 'sandoval.guido@gmail.com'],
                            cc: [],
                            bcc: [],
                            subject: "Name: [" + work.name + "] - Date[" + work.start + "]",
                            body: msg,
                            isHtml: false
                        }, callback);

                    });
                });
            }  ,

            $rootScope.$on(RECORDS_FOUND, function (event_name, records) {
                $scope.availableRecords.length = 0;
                for (var i = 0; i < records.length; i++) {
                    records[i].selected = false;
                    $scope.availableRecords.push(records[i]);
                }
                $rootScope.$digest();

            }),

            $rootScope.$on($BLEService.ON_DATA_TO_STORE, function (event, strData) {

                var add = function (a, b) {
                    return a + b;
                };

                try {
                    if ($GlobalState.recordingState()) {
                        var data = JSON.parse(strData);
                        var vector = data.f;

                        var state = vector.reduce(add);
                        if (state != $GlobalState.getLastState()) {
                            $GlobalState.setLastState(state);

                            var instant = (new Date()).getTime();
                            instant = instant - $GlobalState.getZeroInstant();
                            $DBService.insert_event($rootScope.selectElem.id,
                                instant, vector);
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            })


    });

