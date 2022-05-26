const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('../models');

function returnLoginForm(req, res) {
	fs.ReadStream('./views/login.html').pipe(res);
}

function returnRegisterForm(req, res) {
	fs.ReadStream('./views/register.html').pipe(res);
}

async function login(req, res) {
    let users = await db.users.findAll({raw : true});
    let credential = users.find(u =>  u.username.toLowerCase() == req.body.username.toLowerCase());
	if (!credential) return res.redirect('/login');
	if (credential.password !== req.body.password)
		return res.redirect('/login');

	let accessToken = generateAccessToken({id: credential.id, username: credential.username, role: credential.role});
	let refreshToken = generateRefreshToken({id: credential.id, username:credential.username, role: credential.role});
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		sameSite: 'strict',
	}).cookie('refreshToken', refreshToken, {
		path: '/', 
	}).redirect('/api/ability');
}

async function register(req, res) {
    console.log(req.body);

	if (!req.body.username) {
		return res.status(400).send({ message: 'Content can not be empty!' });
	}
    const exists = await db.users.findOne({ where: { username: req.body.username } });
    if (exists) res.redirect('/register');

    else  {
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        };
        await db.users.create(user);
        res.redirect('/login');
    }
}

function logout(req, res) {
	res.clearCookie('accessToken').clearCookie('refreshToken').redirect('/login');
}

function resource(req, res) {   //
	res.send('resource');
}

function generateRefreshToken(properties) {
	return jwt.sign(properties, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '24h',
	});
}

function generateAccessToken(properties) {
	return jwt.sign(properties, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '10m',
	});
}

function authenticateToken(req, res, next) {
	let token = req.cookies?.accessToken;
	if (!token) {
		console.log('guest: ');
		next();
		return;
		//return res.redirect(401, '/login');
	}
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		console.log('auth: ', req.user);
		next();
	});
}

function refreshToken(req, res, next) {
	let refreshToken = req.cookies?.refreshToken;
	if (!refreshToken) {
		return res.redirect(401, '/login');
	}
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			let newAccessToken = generateAccessToken(user.username, user.role);
			let newRefreshToken = generateRefreshToken(user.username, user.role);
			res.cookie('accessToken', newAccessToken, {
				httpOnly: true,
				sameSite: 'strict',
			}).cookie('refreshToken', newRefreshToken, {
				path: '/',
			});
			next();
		}
	);
}

exports.returnLoginForm = returnLoginForm;
exports.returnRegisterForm = returnRegisterForm;
exports.login = login;
exports.register = register;
exports.logout = logout;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.authenticateToken = authenticateToken;
exports.refreshToken = refreshToken;
