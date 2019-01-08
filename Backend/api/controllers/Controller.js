var mongoose = require('mongoose');
var Parent_Task = mongoose.model('Parent_Task');
var Task = mongoose.model('Task');

exports.add_parent_task = function (req, res) {
    var parentObj = new Parent_Task({
        parentTask: req.body.parentTask
    });
    parentObj.save(function (err, parent) {
        if (err) res.status(500).send(err);
        res.status(200).json(parent);
    });
}

exports.get_parents = function (req, res) {
    Parent_Task.find(function (err, parents) {
        if (err) res.status(500).send(err);
        res.status(200).json(parents);
    });
}

exports.add_sub_task = function (req, res) {
    var taskObj = new Task({
        parentTaskId: req.body.parentTaskId,
        task: req.body.task,
        priority: req.body.priority,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: 'started'
    });
    taskObj.save(function (err, task) {
        if (err) res.status(500).send(err);
        res.status(200).json(task);
    });
}

exports.search_task = function (req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    Task.find({ _id: new ObjectId(req.params.id) }, function (err, tasks) {
        if (err) res.status(500).send(err);
        res.status(200).json(tasks);
    }).populate('parentTaskId', 'parentTask');
}

exports.get_tasks = function (req, res) {
    Task.find(function (err, tasks) {
        if (err) res.status(500).send(err);
        res.status(200).json(tasks);
    }).populate('parentTaskId', 'parentTask');
}

exports.complete_task = function (req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    Task.findOne({ _id: new ObjectId(req.params.id) }, function (err, task) {
        if (err) res.json(err);
        task.status = "completed";
        task.save(function (err, up_task) {
            if (err) res.status(500).send(err);
            res.status(200).json(up_task);
        });
    });
}

exports.update_task = function (req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    Task.findOne({ _id: new ObjectId(req.params.id) }, function (err, task) {
        if (err) res.json(err);
        task.parentTaskId = req.body.parentTaskId;
        task.task = req.body.task;
        task.startDate = req.body.startDate;
        task.endDate = req.body.endDate;
        task.priority = req.body.priority;
        task.save(function (err, up_task) {
            if (err) res.status(500).send(err);
            res.status(200).json(up_task);
        });
    });
}