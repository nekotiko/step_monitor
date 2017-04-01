/**
 * Created by bakeneko on 12/30/16.
 */

var DEVICE_FOUND = 'new_device';

angular.module('StepMonitor')
    .controller('DevicesController', function ($scope, $rootScope, $BLEService, $timeout) {


        $scope.availableDevices = [],
        $scope.selectedDevice = null,
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
            $scope.selectedDevice = device;

          $BLEService.connect(device.id,
              $scope.onBLEError);
        },

        $scope.startMonitoring = function () {
            if ($scope.selectedDevice) {
                var requestData = function () {
                    $BLEService.sendData($scope.selectedDevice.id, 'FOOT_DATA');
                }
                $scope.requestDataTimer = $timeout(requestData, 300);
            }
        },

        $scope.disconnect = function () {
            if ($scope.selectedDevice){
                console.debug('About to Disconnect from ' + $scope.selectedDevice.id);
                $timeout.cancel($scope.requestDataTimer);

                $BLEService.disconnect($scope.selectedDevice.id,
                    $scope.onData, $scope.onBLEError);

                $scope.selectedDevice = null;

            }
        },

        $scope.$on($BLEService.ON_DATA_EVENT, function (event, data) {
            console.log('On Recived Data: ' + data);
            $scope.startMonitoring();
        }),

        $scope.onBLEError = function(err){
          console.error('Error: ' + JSON.stringify(err));
        },

        $rootScope.$on(DEVICE_FOUND, function(event_name, device){
            console.debug('new device found' + device);
            if (device) {
                console.debug(device.id);
                console.debug(device.name);
                $scope.availableDevices.push(device);
            }
        })


        document.addEventListener("deviceready", function () {
            console.debug('device ready');
            $scope.loadDevices();
        }, false)



    });