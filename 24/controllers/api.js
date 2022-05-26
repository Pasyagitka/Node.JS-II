const db = require('../models');
const { ForbiddenError } = require('@casl/ability');

function getAbility(req, res) {
    res.status(200).send(req.ability.rules);
}

async function getUser(req, res) {
    try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', 'users');   //everyone can view
        const users = await db.users.findAll();
        res.status(200).json(users);
    }
    catch(err) {
        res.status(500).send(err.message);
    }
}

async function getUserById(req, res) {
    try {
        const user = await db.users.findOne({ where: { id: req.params.id }});
        if(!user) throw {message: 'user not exists'};
        ForbiddenError.from(req.ability).throwUnlessCan('read', user);
        res.status(200).json(user);
   } catch(err) {
       res.status(500).send(err.message);
   }
}

async function getRepos(req, res) {
    try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', 'repos');
        res.status(200).json(await db.repos.findAll());
   } catch(err) {
       res.status(500).send(err.message);
   }
}

async function getReposById(req, res) {
    try {
        const repo = await db.repos.findByPk(req.params.id);
        if (!repo) throw {message: 'repos not exists'};
        ForbiddenError.from(req.ability).throwUnlessCan('read', repo);
        res.status(200).json(repo);
    } catch(err)  {
        res.status(500).send(err.message);
    }
}

async function createRepos(req, res) {
    try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', 'repos');
        const repo = await db.repos.create({
           name: req.body.name,
           authorId: req.user.id
        });
        res.status(201).json(repo);
    } catch(err)  {
        res.status(500).send(err.message);
    }
}

async function updateRepos(req, res) {
    try  {
        const repo = await db.repos.findByPk(req.params.id);
        if(!repo) throw {message: 'repo not exists'};
        ForbiddenError.from(req.ability).throwUnlessCan('update',  await db.repos.findByPk(req.params.id));
        repo.name = req.body.name;
        repo.save();
        //await db.repos.update({ name: req.body.name }, {  where:  { id: req.params.id }});
        res.status(201).send('Success');
    }  catch(err)  {
        res.status(500).send(err.message);
    }
}

async function deleteRepos(req, res) {
    try {
        const repo = await db.repos.findByPk(req.params.id);
        if(!repo) throw {message: 'repo not exists'};
        ForbiddenError.from(req.ability).throwUnlessCan('delete',  'repos');
        repo.destroy();
        res.status(201).send('Success');
    } catch(err) {
        res.status(500).send(err.message);
    }
}

async function getCommits(req, res) {
    try {
        ForbiddenError.from(req.ability).throwUnlessCan('read',  'commits');
        const comm = await db.commits.findAll({
           include: [{
               model: db.repos,
               required: true,
               where:  {  id: req.params.id },
           }]
        });
        res.status(200).json(comm);
    }   catch(err)  {
        res.status(500).send(err.message);
    }
}

async function getCommitById(req, res) {
    try {
        ForbiddenError.from(req.ability).throwUnlessCan('read',  await db.repos.findByPk(req.params.id));
        const commit = await db.commits.findOne({
            where: { id: req.params.commitId },
            include: [{
                model: db.repos,
                required: true,
                where: {   id: req.params.id },
            }]
        });
        if (commit) res.status(200).json(commit);
        else res.status(404).send('not exists');
    } catch(err) {
        res.status(500).send(err.message);
    }
}

async function createCommit(req, res) {
    try {
        ForbiddenError.from(req.ability).throwUnlessCan('create',  await db.repos.findByPk(req.params.id));
        const commit = await db.commits.create({
           message: req.body.message,
           repoId: req.params.id,
        });
        res.status(201).send(commit);
    }  catch(err)  {
        res.status(500).send(err.message);
    }
}

async function updateCommit(req, res) {
    try {
        const comm = await db.commits.findOne({ where: {   id: req.params.commitId  },
            include: [{
                model: db.repos,
                required: true,
                where:  {   id: req.params.id  },
            }]
        });
        if(!comm) throw {message: 'comm not exists'};
        ForbiddenError.from(req.ability).throwUnlessCan('update',  await db.repos.findByPk(req.params.id));
        comm.message = req.body.message;
        comm.save();
        res.status(200).send('Success');
    } catch(err)  {
        res.status(500).send(err.message);
    }
}

async function deleteCommit(req, res) {
    try {
        const comm = await db.commits.findOne({ where: {   id: req.params.commitId  },
            include: [{
                model: db.repos,
                required: true,
                where:  {   id: req.params.id  },
            }]
        });
        if(!comm) throw {message: 'comm not exists'};
        ForbiddenError.from(req.ability).throwUnlessCan('delete',  'commits');
        comm.destroy();
        res.status(200).send('Success');
    } catch(err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getAbility,
    getUser,
    getUserById,
    getRepos,
    getReposById,
    createRepos,
    updateRepos,
    deleteRepos,
    getCommits,
    getCommitById,
    createCommit,
    updateCommit,
    deleteCommit,
}