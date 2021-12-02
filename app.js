const express = require('express');
const mongoose = require('mongoose');
const UsersModel = require('./Users');
const dbConn = require('./db.connect');

dbConn.connect();

const {
  encryptionForPagination,
  decryptionForPagination,
  successResponse,
  errorResponse,
  paginate,
} = require('./helpers');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/cursor-based', async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const queryObj = {};

    let lastPage = false;

    const { limit } = param;
    let { continuationToken } = param;

    const totalRecords = await UsersModel.countDocuments(queryObj);

    const apiLimit = Number(limit) || 1000;
    if (apiLimit > 5000 && apiLimit < 1) {
      throw new Error('Invalid limit');
    }

    if (continuationToken) {
      try {
        const nextId = decryptionForPagination(continuationToken);
        queryObj._id = { $lt: nextId };
        mongoose.Types.ObjectId(nextId);
      } catch (error) {
        throw new Error('Invalid token');
      }
    }

    const data = await UsersModel.find(queryObj).sort({ _id: -1 }).limit(apiLimit + 1).lean();
    if (data.length === apiLimit + 1) {
      continuationToken = encryptionForPagination(data[apiLimit - 1]._id.toString());
    } else {
      lastPage = true;
    }

    return successResponse(req, res, {
      totalRecords,
      continuationToken,
      lastPage,
      data,
    }, 'Data fetched', 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
});

app.get('/offset-based', async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const data = await paginate(UsersModel, param.limit, param.page);
    return successResponse(req, res, data, 'Data fetched', 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
});

app.get('/seed', async (req, res) => {
  try {
    req.setTimeout(0);
    for (let i = 0; i < 5000000; i += 1) {
      await UsersModel({
        name: `frank${i}`,
        age: i,
      }).save();
      console.log('🚀 -> ', i);
    }
    return successResponse(req, res, {}, 'Data saved', 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
});

app.listen(80, () => {
  console.log('Server started...');
});
