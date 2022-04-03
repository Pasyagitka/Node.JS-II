const fs = require('fs');
const jwt = require('jsonwebtoken');
const trusted = require('../models').users;
const banToken = require('../model-redis').banToken;
let { getCredential, verificatePassword } = require('../verify.js');

require('dotenv').config();

function returnLoginForm(req, res) {
	fs.ReadStream('./views/login.html').pipe(res);
}

function returnRegisterForm(req, res) {
	fs.ReadStream('./views/register.html').pipe(res);
}

async function login(req, res) {
	let credential = await getCredential(trusted, req.body.login);
	if (!credential) return res.redirect('/login');
	if (!verificatePassword(credential.password, req.body.password))
		return res.redirect('/login');

	let accessToken = generateAccessToken({ username: req.body.login });
	let refreshToken = generateRefreshToken({ username: req.body.login });
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		sameSite: 'strict',
	}).cookie('refreshToken', refreshToken, {
		path: '/', 
	}).redirect('/resource');
}

async function register(req, res) {
	if (!req.body.login) {
		return res.status(400).send({ message: 'Content can not be empty!' });
	}
	const user = {
		login: req.body.login,
		password: req.body.password,
	};
	await trusted.create(user);
	res.redirect('/login');
}

function logout(req, res) {
	res.clearCookie('accessToken').clearCookie('refreshToken').redirect('/login');
}

function resource(req, res) {
	res.send('resource');
}

function generateRefreshToken(username) {
	return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '24h',
	});
}

function generateAccessToken(username) {
	return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '10m',
	});
}

function authenticateToken(req, res, next) {
	let token = req.cookies?.accessToken;
	if (!token) {
		return res.redirect(401, '/login');
	}
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
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
			let newAccessToken = generateAccessToken(user.username);
			let newRefreshToken = generateRefreshToken(user.username);
			await banToken(refreshToken);
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
exports.resource = resource;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.authenticateToken = authenticateToken;
exports.refreshToken = refreshToken;
