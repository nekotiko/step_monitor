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


        initialize_db: function () {
            try {
                dbService.db_instance.executeSql('CREATE TABLE IF NOT EXISTS workout (id unique, name NVARCHAR(100), ' +
                    'start DATE, end DATE )');

                dbService.db_instance.executeSql('CREATE TABLE IF NOT EXISTS details (workout_id , instant INT' +
                    'R_H SMALLINT, R_S SMALLINT, R_I SMALLINT, R_T SMALLINT ' +
                    'L_H SMALLINT, L_S SMALLINT, L_I SMALLINT, L_T SMALLINT ');
            } catch (err) {
                console.error('DB Init Err: ' + err);
            }
        },


        create_workout: function (name) {
            var id = generateUUID();
            var start_date = (new Date()).toISOString();
            try {
                dbService.db_instance.executeSql('INSERT INTO workout VALUES("' + id + '","' +
                    name + '", "' + start_date + '", null)');

            } catch (err) {
                console.error('Create workout Err: ' + err);
                id = null;
            }
            return id;
        },


        insert_event: function (workout_id, instant, reading_array) {
            try {
                dbService.db_instance.executeSql('INSERT INTO details VALUES("' + workout_id + '","' +
                    instant + '", "' + reading_array.join(',') + '", null)');

            } catch (err) {
                console.error('Create workout Err: ' + err);
                return err;
            }
        }


    };


    return dbService;
})
