/**
 * Created by bakeneko on 12/30/16.
 */

var DEVICE_FOUND = 'new_device';

angular.module('StepMonitor')
    .controller('DevicesController', function ($scope, $rootScope, $BLEService, $timeout) {


        $scope.availableDevices = [],
        $rootScope.selectedDevice = null,
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
            $rootScope.selectedDevice = device;

          $BLEService.connect(device.id,
              $scope.onBLEError);
        },

            $rootScope.startMonitoring = function () {
            if ($rootScope.selectedDevice) {
                var requestData = function () {
                    $BLEService.sendData($rootScope.selectedDevice.id, 'FOOT_DATA');
                }
                $scope.requestDataTimer = $timeout(requestData, 300);
            }
        },

        $scope.disconnect = function () {
            if ($rootScope.selectedDevice){
                console.debug('About to Disconnect from ' + $rootScope.selectedDevice.id);
                $timeout.cancel($scope.requestDataTimer);

                $BLEService.disconnect($rootScope.selectedDevice.id,
                    $scope.onData, $scope.onBLEError);

                $rootScope.selectedDevice = null;

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