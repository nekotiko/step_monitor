/**
 * Created by bakeneko on 3/31/17.
 */


stepMonitorApp.factory('$DBService', function ($rootScope, $q) {


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
            console.error('DB Init Err: ' + err.message);
        },


        initialize_db: function () {
                dbService.db_instance.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS workout (id unique, name NVARCHAR(100), ' +
                        'start DATE, end DATE );');

                    tx.executeSql('CREATE TABLE IF NOT EXISTS details (workout_id , instant INT, ' +
                        'r_h INT, r_s INT, r_i INT, r_t INT, ' +
                        'l_h INT, l_s INT, l_i INT, l_t INT); ');
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
                    tx.executeSql('INSERT INTO details VALUES("' + workout_id + '","' +
                        instant + '", "' + reading_array.join(',') + '", null);');
                },dbService.db_error);
        },

        load_workouts: function (result_callback) {
            dbService.db_instance.transaction(function (tx) {
                tx.executeSql('SELECT id, name FROM workout;', [], result_callback, dbService.db_error)
            },dbService.db_error);
        }

    };


    return dbService;
})
