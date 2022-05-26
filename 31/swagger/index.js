const { findAllInfo, createInfo, updateInfo, deleteInfo } = require("./info");

const swTSRoute = {
	"/TS": {
		"get": {
			...findAllInfo,
		},
		"post": {
			...createInfo,
		},
		"put": {
			...updateInfo,
		},
		"delete": {
			...deleteInfo,
		},
	},
};

module.exports = swDocument = {
	openapi: "3.0.0",
	info: {
		title: "Express API for Dictionary",
		version: "1.0.0",
		description: "The REST API for Dictionary service",
	},
	servers: [
		{
			url: `http://localhost:${process.env.PORT || 5000}`,
			description: "Development server",
		},
	],
	paths: {
		...swTSRoute,
	},
};
