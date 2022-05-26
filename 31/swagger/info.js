module.exports.findAllInfo = findAllInfo = {
	summary: "Получить полный список из справочника телефонов в json-формате",
	tags: ["Phonebook"],
	responses: {
		200: {
			description: "Phonebook",
			content: {
				"application/json": {
					schema: { type: "object" },
					example: {
						name: "Petrov",
						number: "12345",
					},
				},
			},
		},
		default: {
			description: "Error message",
		},
	},
};

module.exports.createInfo = createInfo = {
	summary: "Добавить новый телефон в справочник",
	tags: ["Phonebook"],
	requestBody: {
		content: {
			"application/json": {
				name: "Record",
				schema: { type: "object" },
				required: true,
				description: "Dictionary record",
				example: {
					record: "Petrov, 5678",
				},
			},
		},
	},
	responses: {
		200: {
			description: "Done",
		},
		default: {
			description: "Error message",
		},
	},
};

module.exports.updateInfo = updateInfo = {
	summary: "Скорректировать строку справочника",
	tags: ["Phonebook"],
	requestBody: {
		content: {
			"application/json": {
				name: "Record",
				schema: { type: "object" },
				required: true,
				description: "Dictionary record",
				example: {
					oldName: "Petrov",
					record: "Petrova, 5678",
				},
			},
		},
	},
	responses: {
		200: {
			description: "Done",
		},
		default: {
			description: "Error message",
		},
	},
};

module.exports.deleteInfo = deleteInfo = {
	summary: "Удалить строку справочника",
	tags: ["Phonebook"],
	parameters: [
		{
			name: "name",
			in: "query",
			schema: {
				type: "string",
				minLength: 1,
				maxLength: 15,
			},
			required: true,
			description: "name in dictionary for delete",
		},
	],
	responses: {
		200: {
			description: "Done",
		},
		default: {
			description: "Error message",
		},
	},
};
