/*global exports, require*/
'use strict';
var dataAccess = require('../data_access');
var cloudHandler = require('../cloudHandler');
var e = require('../errors');

var logger = require('./../logger').logger;

// Logger
var log = logger.getLogger('ParticipantsResource');

exports.getList = function (req, res, next) {
    log.debug('Representing participants for room ', req.params.room, 'and service', req.authData.service._id);
    cloudHandler.getParticipantsInRoom (req.params.room, function (participants) {
        if (participants === 'error') {
            return next(new e.CloudError('Operation failed'));
        }
        res.send(participants);
    });
};

exports.get = function (req, res, next) {
    var participant = req.params.participant;
    cloudHandler.getParticipantsInRoom(req.params.room, function (participants) {
        if (participants === 'error') {
            return next(new e.CloudError('Operation failed'));
        }
        for (var index in participants) {
            if (participants[index].id === participant) {
                log.debug('Found participant', participant);
                res.send(participants[index]);
                return;
            }
        }
        log.error('Participant', req.params.participant, 'does not exist');
        next(new e.NotFoundError('Participant not found'));
    });
};

exports.patch = function (req, res, next) {
    var participant = req.params.participant;
    var updates = req.body;
    cloudHandler.updateParticipant(req.params.room, participant, updates, function (result) {
        if (result === 'error') {
            return next(new e.CloudError('Operation failed'));
        }
        res.send(result);
    });
};

exports.delete = function (req, res, next) {
    var participant = req.params.participant;
    cloudHandler.deleteParticipant(req.params.room, participant, function (result) {
        log.debug('result', result);
        if (result === 'error') {
            next(new e.CloudError('Operation failed'));
        } else {
            res.send();
        }
    });
};