const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilityFor(user) {
  if (user) {
    return new Ability(defineRulesFor(user));
  }
  else return new Ability(defineRulesFor({}));
}

function defineRulesFor(user) {
  const builder = new AbilityBuilder(Ability);
  switch (user.role) {
    case 'admin':
      defineAdminRules(builder, user);
      break;
    case 'user':
      defineUserRules(builder, user);
      break;
    default:
      defineGuestRules(builder, user);
      break;
  }
  return builder.rules;
}

function defineAdminRules({ can }) {
  can(['read', 'update', 'delete'], ['repos', 'commits']);
  can('read', 'users');
}

function defineUserRules({ can }, user) {
  can('read', ['repos', 'commits']);
  can(['create', 'update'], ['repos', 'commits'], {authorId: user.id});
  can('read', 'users', {id: user.id});
}

function defineGuestRules({ can }) {
  can('read', ['repos', 'commits']);
}

module.exports = {
  defineRulesFor,
  defineAbilityFor,
};