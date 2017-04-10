/**
 * Created by bakeneko on 12/31/16.
 */

angular.module('StepMonitor').factory('$GlobalState', function ($rootScope, $q) {


    var current_device = '';
    //Recording
    var recording = false;
    var recording_zero_instant = 0;
    var last_state = 0;
    var current_recording = null;


    var globalState = {

            getCurrentDevice: function() {
                return current_device;
            },

            setCurrentDevice: function (current_device) {
                currentDevice = current_device;
            },

            startRecording: function () {
                recording = true;
            },

            stopRecording: function () {
                recording = false;
            },

            recordingState: function () {
                return recording;
            },

            setZeroInstant: function (zero_i) {
                recording_zero_instant = zero_i;
            },

            getZeroInstant: function () {
                return recording_zero_instant;
            },

            setCurrentRecordingId: function (id) {
                current_recording = id;
            },

            getCurrentRecoringId: function () {
                return current_recording;

            }





    };

    return globalState;
})