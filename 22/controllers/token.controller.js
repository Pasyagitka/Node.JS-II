const fs = require("fs");
let { getCredential, verificatePassword } = require("../verify.js");
const trusted = require("../models").users;
const banToken = require("../model-redis").banToken;
require("dotenv").config();

const jwt = require("jsonwebtoken");

//Вернуть форму для ввода имени пользователя и пароля
exports.returnLoginForm = (req, res) => {
	fs.ReadStream("./views/login.html").pipe(res);
};

exports.returnRegisterForm = (req, res) => {
	fs.ReadStream("./views/register.html").pipe(res);
};

//Производить аутентификацию. В случае успешной аутентификации переадресовывать на /resource, иначе – на /login
exports.login = async (req, res) => {
	let credential = await getCredential(trusted, req.body.login);
	if (!credential) return res.redirect("/login");
	if (!verificatePassword(credential.password, req.body.password))
		return res.redirect("/login");

	let accessToken = generateAccessToken({ username: req.body.login });
	let refreshToken = generateRefreshToken({ username: req.body.login });
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		sameSite: "strict",
	})
	.cookie("refreshToken", refreshToken, {
		path: "/", //set path
	})
	.redirect("/resource");
};

exports.register = async (req, res) => {
	if (!req.body.login) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}
	const user = {
		login: req.body.login,
		password: req.body.password
	};
	console.log(user);
	await trusted.create(user);
	res.redirect("/login");
}

//Отключить аутентифицированный доступ к ресурсу
exports.logout = (req, res) => {
	res.clearCookie("accessToken")
		.clearCookie("refreshToken")
		.redirect("/login");
};

//Если пользователь аутентифицирован, то отправить сообщение RESOURCE и информацию об аутентифицированном пользователе
exports.resource = (req, res) => {
	res.send("resource");
};

function generateRefreshToken(username) {
	return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "24h",
	});
}

function generateAccessToken(username) {
	return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "10m",
	});
}

function authenticateToken(req, res, next) {
	let token = req.cookies?.accessToken;
	if (!token) {
		return res.redirect(401, "/login");
	}
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		console.log("err", err);
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

exports.refreshToken = (req, res, next) => {
	let refreshToken = req.cookies?.refreshToken;
	if (!refreshToken) {
		return res.redirect(401, "/login");
	}
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, user) => {
			console.log("err", err, user);
			if (err) return res.sendStatus(403);
			req.user = user;
			let newAccessToken = generateAccessToken(user.username);
			let newRefreshToken = generateRefreshToken(user.username);
			await banToken(refreshToken);
			res.cookie("accessToken", newAccessToken, {
				httpOnly: true,
				sameSite: "strict",
			}).cookie("refreshToken", newRefreshToken, {
				path: "/",
			});
			next();
		}
	);
};

exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.authenticateToken = authenticateToken;
