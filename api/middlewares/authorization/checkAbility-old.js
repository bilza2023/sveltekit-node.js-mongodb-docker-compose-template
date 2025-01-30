
const defineAbility = require('./defineAbility');
const getQuestionType = require('../checkQuestionType.js');
const isvalidCustomer = require('./isvalidCustomer.js');

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const checkAbility = (action, resource) => async (req, res, next) => {
  // Fetch questionType if resource is Tcode
  let questionType = null;
  let isValidCustomerResult = null;

  ////////////Find Question Type
  if (resource === 'Tcode' && req.params.id) {
    questionType = await getQuestionType(req.params.id);
    if (!questionType) {
      return res.status(404).json({ message: 'Resource not found' });
    }
  }
  ////////////////////////// Allow free resources for everyone
    if (questionType === 'free') {
      return next();
    }

//--find valid customer only if questionType is paid
  if (questionType === 'paid'){
    isValidCustomerResult = isvalidCustomer(req.user);
  }
  // Handle unauthenticated users or users without roles
  if ((!req.user || !req.user.role) && questionType !== 'free') {
    return res.status(403).json({ message: 'Access denied: no user or role defined' });
  }

  // Finally
  //////////////////////////////////////////////////////////////////////////////////
  const ability = defineAbility(req.user?.role, questionType, isValidCustomerResult);

  // Check CASL abilities for the requested action and resource
  if (ability.can(action, resource)) {
    return next();
  }

  // Deny access if none of the above conditions are met
  return res.status(403).json({ message: 'Access denied' });
};

module.exports = checkAbility;
