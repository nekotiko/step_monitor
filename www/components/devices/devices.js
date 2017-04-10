/**
 * Created by bakeneko on 12/30/16.
 */

var DEVICE_FOUND = 'new_device';

angular.module('StepMonitor')
    .controller('DevicesController', function ($scope, $rootScope, $BLEService, $timeout, $GlobalState) {


        $scope.availableDevices = [],
        $scope.requestDataTimer = null,

        $scope.loadDevices = function () {
           var device_promise = $BLEService.getDeviceList();
           device_promise.then(
               function (device) {
                   $scope.$emit(DEVICE_FOUND, device);
               },
               function (error) {
                  console.error(error)
               }
           )
        },

        $scope.connectDevice = function (device) {
            $GlobalState.setCurrentDevice(device);

          $BLEService.connect(device.id,
              $scope.onBLEError);
        },

            $rootScope.startMonitoring = function () {
            if ($GlobalState.getCurrentDevice()) {
                var requestData = function () {
                    $BLEService.sendData($$GlobalState.getCurrentDevice().id, 'FOOT_DATA');
                }
                $scope.requestDataTimer = $timeout(requestData, 300);
            }
        },

        $scope.disconnect = function () {
            if ($GlobalState.getCurrentDevice()){
                console.debug('About to Disconnect from ' + $GlobalState.getCurrentDevice().id);
                $timeout.cancel($scope.requestDataTimer);

                $BLEService.disconnect($GlobalState.getCurrentDevice().id,
                    $scope.onData, $scope.onBLEError);

                $GlobalState.setCurrentDevice(null);

            }
        },

        $rootScope.$on($BLEService.ON_DATA_EVENT, function (event, data) {

            $rootScope.startMonitoring();
        }),

        $scope.onBLEError = function(err){
          console.error('Error: ' + JSON.stringify(err));
        },

        $rootScope.$on(DEVICE_FOUND, function(event_name, device){
            console.debug('new device found' + device);
            if (device) {
                $scope.availableDevices.push(device);
            }
        })


        document.addEventListener("deviceready", function () {
            console.debug('device ready');
            $scope.loadDevices();
        }, false)



    });