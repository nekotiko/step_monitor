/**
 * Created by bakeneko on 12/30/16.
 */



stepMonitorApp
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
                 if (data.f) {
                     for (var i in data.f.slice(0,4) ) {
                         //100:255:VALUE:X
                         var value = parseInt((data.f[i] * 255) / 100);
                         $scope.RIGHT_FEET[$scope.FEET_PART_INDEX[i]] = value;
                     }

                     for (var i in data.f.slice(4, 8) ) {
                         //100:255:VALUE:X
                         var value = parseInt((data.f[i] * 255) / 100);
                         $scope.LEFT_FEET[$scope.FEET_PART_INDEX[i]] = value;
                     }

                 }
             }catch (err){
                 console.error("MSg: "+ strData);
                 console.error(err);
             }

        })


    });