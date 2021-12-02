const crypto = require('crypto');

const initVector = Buffer.from('ABCDEFGHJKLIOPPS');

exports.encryptionForPagination = (string) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', '123456789012345678ABCDEFGHJKLIOP', initVector);
  let encryptedData = cipher.update(string, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

exports.decryptionForPagination = (encryptedString) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', '123456789012345678ABCDEFGHJKLIOP', initVector);
  let decryptedData = decipher.update(encryptedString, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

exports.successResponse = (req, res, data, message = 'Operation successfully completed.', code = 200) => {
  res.status(code);
  res.send({
    code,
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (req, res, errorMessage = 'Something went wrong!', code = 500, error) => {
  res.status(code);
  res.send({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });
};

exports.paginate = async (MODEL, LIMIT, PAGE) => {
  const limit = Number(LIMIT) || 10;
  // const skip = PAGE && Number(PAGE) !== 0 ? ((Number(PAGE) - 1) * limit) : 0;  // next page logic
  const skip = PAGE && Number(PAGE) !== 0 ? Number(PAGE) : 0;
  const TotalEntries = await MODEL.find({}).countDocuments();
  // const data = await MODEL.find({}).limit(limit).skip(skip).sort({ createdAt: -1 }); // createdAt
  const data = await MODEL.find({}).limit(limit).skip(skip).sort({ _id: -1 }); // _id
  return { data, TotalEntries };
};
