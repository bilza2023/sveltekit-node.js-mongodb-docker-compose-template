
const defineAbility = require('./defineAbility');
const getQuestionType = require('../checkQuestionType.js');
const isvalidCustomer = require('./isvalidCustomer.js');

// function getQuestionType(){
//   return "free";
// }
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const checkAbility = (action, resource) => async (req, res, next) => {
//  debugger;
  let questionType = null;
  let isValidCustomerResult = null;

////////////Find Question Type
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////  
  if (resource === 'Tcode' && action === 'read') {
    questionType = await getQuestionType(req.params.id);
    if (!questionType) {
      return res.status(404).json({ message: 'Resource not found' });
    }
  }
//////////////////////////////////////////////////////////////////
//--find valid customer only if questionType is paid
  if (questionType === 'paid'){isValidCustomerResult = isvalidCustomer(req.user);}
  // Finally/////////////////////////////////////////////////////////////
  const ability = defineAbility(req.user?.role, questionType, isValidCustomerResult);
  if (ability.can(action, resource)) {return next();}
  return res.status(403).json({ message: 'Access denied' , errorMessage : `role:${req?.user?.role},action:${action}` });
};

module.exports = checkAbility;
