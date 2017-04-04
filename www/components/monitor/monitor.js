/**
 * Created by bakeneko on 12/30/16.
 */



angular.module('StepMonitor')
    .controller('MonitorController', function($scope, $rootScope, $BLEService) {

        //What the device send should match this order
        $scope.FEET_PART_INDEX = ['H','I','S','T'],

        $scope.RIGHT_FEET = {
            'H' : 255,
            'S' : 255,
            'I' : 255,
            'T' : 255

        },

            $scope.LEFT_FEET = {
                'H' : 255,
                'S' : 255,
                'I' : 255,
                'T' : 255

            },

        $rootScope.$on($BLEService.ON_DATA_EVENT, function (event, strData) {
             try {
                 var data = JSON.parse(strData);
                 console.log('About to load data ' + strData);
                 if (data.f) {
                     var feet = data.f.slice(0,4);
                     for (var i in feet ) {
                         //100:255:VALUE:X
                         var value = parseInt((feet[i] * 255) / 100);
                         $scope.LEFT_FEET[$scope.FEET_PART_INDEX[i]] = value;
                     }

                     feet = data.f.slice(4, 8);
                     for (var i in feet ) {
                         //100:255:VALUE:X
                         var value = parseInt((feet[i] * 255) / 100);
                         $scope.RIGHT_FEET[$scope.FEET_PART_INDEX[i]] = value;
                     }
                     $rootScope.$broadcast($BLEService.ON_DATA_TO_STORE, strData);
                 }
             }catch (err){
                 console.error("MSg: "+ strData);
                 console.error(err);
             }

        })


    });