'use strict';

module.exports = function (app) {
    var services = require('../controllers/Controller');

    app.route('/add-parent-task')
        .post(services.add_parent_task);

    app.route('/add-sub-task')
        .post(services.add_sub_task);

    app.route('/get-parent-tasks')
        .get(services.get_parents);

    app.route('/search-task/:id')
        .get(services.search_task);

    app.route('/get-tasks')
        .get(services.get_tasks);

    app.route('/complete-task/:id')
        .put(services.complete_task);

    app.route('/edit-task/:id')
        .put(services.update_task);
}