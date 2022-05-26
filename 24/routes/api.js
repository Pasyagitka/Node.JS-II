let router = require('express').Router();
const controller = require('../controllers/api');
const authenticateToken = require('../controllers/auth').authenticateToken;

module.exports = app => {
    router.get('/ability', controller.getAbility);
    router.get('/user', controller.getUser);
    router.get('/user/:id', controller.getUserById);

    router.get('/repos', controller.getRepos);
    router.get('/repos/:id', controller.getReposById);
    router.post('/repos', controller.createRepos);
    router.put('/repos/:id', controller.updateRepos);
    router.delete('/repos/:id', controller.deleteRepos);

    router.get('/repos/:id/commits', controller.getCommits);
    router.get('/repos/:id/commits/:commitId', controller.getCommitById);
    router.post('/repos/:id/commits', controller.createCommit);
    router.put('/repos/:id/commits/:commitId', controller.updateCommit);
    router.delete('/repos/:id/commits/:commitId', controller.deleteCommit);

    app.use('/api', router);
};