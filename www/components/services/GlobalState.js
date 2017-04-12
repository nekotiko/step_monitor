/**
 * Created by bakeneko on 12/31/16.
 */

angular.module('StepMonitor').factory('$GlobalState', function ($rootScope, $q) {





    var globalState = {

            current_device: '',
            //Recordin
            recording: false,
            recording_zero_instant: 0,
            last_state: 0,
            current_recording: null,

            getCurrentDevice: function() {
                return this.current_device;
            },

            setCurrentDevice: function (current_device) {
                this.current_device = current_device;
            },

            startRecording: function () {
                this.recording = true;
            },

            stopRecording: function () {
                this.recording = false;
            },

            recordingState: function () {
                return this.recording;
            },

            setZeroInstant: function (zero_i) {
                this.recording_zero_instant = zero_i;
            },

            getZeroInstant: function () {
                return this.recording_zero_instant;
            },

            setCurrentRecordingId: function (id) {
                this.current_recording = id;
            },

            getCurrentRecoringId: function () {
                return this.current_recording;

            }






    };

    return globalState;
})