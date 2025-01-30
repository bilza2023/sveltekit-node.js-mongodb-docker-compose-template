const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

function defineAbility(role=null, questionType=null, isValidCustomer = false) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
 
  // Handle unauthenticated users (role === null)
  if (role == null) {
    if (questionType === 'free') {
      can('read', 'Tcode'); // Free resources are accessible to everyone
    } else {
      cannot('read', 'Tcode'); // Deny access to non-free resources
    }
    can('list', 'Tcode');
  }

  // Define rules for authenticated users
  if (role === 'student') {
    can('list', 'Tcode'); // Students can list Tcode items
    if (questionType === 'free' || questionType === 'login') {
      can('read', 'Tcode'); // Allow students to read free and login-required resources
    } else if (questionType === 'paid' && isValidCustomer) {
      can('read', 'Tcode'); // Allow access to paid resources for valid customers
    } else {
      cannot('read', 'Tcode'); // Deny access to paid resources if not a valid customer
    }
  } else if (role === 'teacher') {
    // Teachers have broader access
    can('list', 'Tcode');
    can('read', 'Tcode');
    can('update', 'Tcode');
  
  } else if (role === 'admin') {
  
    can('update', 'Tcode');
    can('manage', 'Tcode');
  
  } else {
    // Default: deny all actions on Tcode
    // cannot('manage', 'Tcode');
  }
  return build();
}

module.exports = defineAbility;
