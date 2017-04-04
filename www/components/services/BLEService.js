/**
 * Created by bakeneko on 12/31/16.
 */

angular.module('StepMonitor').factory('$BLEService', function ($rootScope, $q) {


    // ASCII only
    function bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    // ASCII only
    function stringToBytes(string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    // this is Nordic's UART service
    var bluefruit = {
        serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
        rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
    };

    var bleService = {

        ON_DATA_EVENT: 'on_data_event',
        ON_DATA_TO_STORE: 'on_data_store',

        getDeviceList: function () {

            return $q(function (resolve, reject) {
                var onDevice = function (device) {
                    if (device) {
                        resolve(device);
                    }
                };

                var onError = function (err) {
                    reject(err);
                };

                if (ons.platform.isAndroid()) { // Android filtering is broken
                    ble.scan([], 5, onDevice, onError);
                } else {
                    ble.scan([bluefruit.serviceUUID], 5, onDevice, onError);
                }
            });
        },


        connect: function (deviceId, onError) {
            onConnect = function (peripheral) {
                bleService.determineWriteType(peripheral);
                // subscribe for incoming data

                var buffer = '';

                function decode_before_on_data(dataArray){

                    var strData = bytesToString(dataArray);
                    if (strData.indexOf(';') < 0){
                        //console.log("Buffer:" + buffer);
                       buffer += strData;
                    } else{
                        strData = buffer + strData;
                        buffer = '';
                        //console.log(strData);
                        $rootScope.$broadcast(bleService.ON_DATA_EVENT, strData.slice(0, -1));
                    }


                }

                ble.startNotification(deviceId,
                    bluefruit.serviceUUID,
                    bluefruit.rxCharacteristic,
                    decode_before_on_data, onError);
            };

            ble.connect(deviceId, onConnect, onError);
        },




        determineWriteType: function (peripheral) {
            // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
            // Newer Bluefruit devices use Write Request for the TX characteristic

            var characteristic = peripheral.characteristics.filter(function (element) {
                if (element.characteristic.toLowerCase() === bluefruit.txCharacteristic) {
                    return element;
                }
            })[0];

            if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
                bleService.writeWithoutResponse = true;
            } else {
                bleService.writeWithoutResponse = false;
            }

        },


        sendData: function (deviceId, message) { // send data to Arduino

            var success = function () {
                //console.log("success");
                //resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
                //resultDiv.scrollTop = resultDiv.scrollHeight;
            };

            var failure = function () {
                alert("Failed writing data to the bluefruit le");
            };

            var data = stringToBytes(message);


            if (bleService.writeWithoutResponse) {
                ble.writeWithoutResponse(
                    deviceId,
                    bluefruit.serviceUUID,
                    bluefruit.txCharacteristic,
                    data, success, failure
                );
            } else {
                ble.write(
                    deviceId,
                    bluefruit.serviceUUID,
                    bluefruit.txCharacteristic,
                    data, success, failure
                );
            }

        },
        disconnect: function (deviceId, onDisconect, onError) {
            ble.disconnect(deviceId, onDisconect, onError);
        },


        onError: function (reason) {
            console.log("ERROR: " + reason); // real apps should use notification.alert
        }
    };

    return bleService;
})