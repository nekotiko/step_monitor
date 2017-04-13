/**
 * Created by bakeneko on 12/30/16.
 */



angular.module('StepMonitor')
    .controller('MonitorController', function ($scope, $rootScope, $BLEService) {

        //What the device send should match this order
        $scope.FEET_PART_INDEX = ['H', 'I', 'S', 'T'],


            $scope.LEFT_FEET = {
                'H': 255,
                'I': 255,
                'S': 255,
                'T': 255

            },

            $scope.RIGHT_FEET = {
                'H': 255,
                'I': 255,
                'S': 255,
                'T': 255

            },

            $rootScope.$on($BLEService.ON_DATA_EVENT, function (event, strData) {
                try {
                    var data = JSON.parse(strData);
                    //console.log('About to load data ' + strData);
                    if (data.f) {

                        var feet = data.f.slice(0, 2);
                        var value = parseInt((feet[0] * 255) / 100);
                        $scope.LEFT_FEET['H'] = value;
                        $scope.LEFT_FEET['I'] = value;

                        value = parseInt((feet[1] * 255) / 100);
                        $scope.LEFT_FEET['S'] = value;
                        $scope.LEFT_FEET['T'] = value;


                        feet = data.f.slice(2, 4);

                        value = parseInt((feet[0] * 255) / 100);
                        $scope.RIGHT_FEET['H'] = value;
                        $scope.RIGHT_FEET['I'] = value;

                        value = parseInt((feet[1] * 255) / 100);
                        $scope.RIGHT_FEET['S'] = value;
                        $scope.RIGHT_FEET['T'] = value;

                        $rootScope.$broadcast($BLEService.ON_DATA_TO_STORE, strData);
                    }

                } catch (err) {
                    console.error("MSg: " + strData);
                    console.error(err);
                }

            })


    });