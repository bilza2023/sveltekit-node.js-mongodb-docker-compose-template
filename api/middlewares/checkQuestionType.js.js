const TCode = require('../schemas/TCode'); // Adjust path as necessary

async function getQuestionType(tcodeId) {
  try {
    const tcode = await TCode.findById(tcodeId, 'questionType'); // Fetch only questionType
    if (!tcode) {
    //   console.error('TCode not found');
      return null;
    }
    return tcode.questionType;
  } catch (error) {
    // console.error('Error checking questionType:', error.message);
    return null; // Return null instead of throwing an error
  }
}

module.exports = getQuestionType;