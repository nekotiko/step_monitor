/**
 * Created by bakeneko on 3/31/17.
 */


angular.module('StepMonitor').factory('$DBService', function ($rootScope, $q) {


    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    var dbService = {

        db_instance: window.openDatabase("workout_db", "1.0", "workout_db", 1000000),


        db_error: function(err){
            console.error('DB Err: ' + err.message);
        },


        initialize_db: function () {
                dbService.db_instance.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS workout (id unique, name NVARCHAR(100), ' +
                        'start DATE, end DATE );');

                    tx.executeSql('CREATE TABLE IF NOT EXISTS details (workout_id , instant INT, ' +
                        'l_h INT, l_s INT, ' +
                        'r_h INT, r_s INT); ');
                    console.log('DB successfully initialized');
                }, dbService.db_error);

        },


        create_workout: function (name) {
                var id = generateUUID();
            dbService.db_instance.transaction(function (tx) {

                    var start_date = (new Date()).toISOString();

                    tx.executeSql('INSERT INTO workout VALUES("' + id + '","' +
                        name + '", "' + start_date + '", null);');
                }, dbService.db_error);

            return id;
        },


        insert_event: function (workout_id, instant, reading_array) {
                dbService.db_instance.transaction(function (tx) {
                    var query = 'INSERT INTO details VALUES("' + workout_id + '",' +
                                    instant + ', ' + reading_array.join(',') + ');';
                    tx.executeSql(query);
                },dbService.db_error);
        },


        get_workout: function(workout_id, callback){
            dbService.db_instance.transaction(function (tx) {
                var query = 'SELECT * FROM workout WHERE id = "' + workout_id + '";';
                tx.executeSql(query, [], callback, dbService.db_error);
            });
        },

        get_details: function (workout_id, callback) {
            dbService.db_instance.transaction(function (tx) {
                var query = 'SELECT * FROM details WHERE workout_id = "' + workout_id + '";';
                tx.executeSql(query, [], callback, dbService.db_error);
            });
        },

        delete_workout: function (workout_id, success_callback) {
           dbService.db_instance.transaction(function (tx) {
               var del = 'DELETE FROM details WHERE workout_id = "' + workout_id + '";';
               tx.executeSql(del);

               del = 'DELETE FROM workout WHERE id = "' + workout_id + '";';
               tx.executeSql(del);

           }, dbService.db_error, success_callback)
        },

        load_workouts: function (result_callback) {
            dbService.db_instance.transaction(function (tx) {
                tx.executeSql('SELECT id, name FROM workout;', [], result_callback, dbService.db_error)
            },dbService.db_error);
            $rootScope.selectElem = null;
        }

    };


    return dbService;
})
