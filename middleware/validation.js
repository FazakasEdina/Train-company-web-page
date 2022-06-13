import express from 'express';
import Joi from 'joi';
import { checkIDExisting, findUserByName } from '../db/db.js';

const router = express.Router();

// -------------------------------
// add new train line
// -------------------------------
router.post('/add', async (req, res, next) => {
  const reg = new RegExp('^[A-Z][a-z]+(( |-)[A-Z][a-z]+)*$');

  const JoiShema = Joi.object({
    from: Joi.string().regex(reg).required(),
    to: Joi.string().regex(reg).required(),
    price: Joi.number().min(0).required(),
    day: Joi.string().valid('Monday')
      .valid('Tuesday')
      .valid('Wednesday')
      .valid('Thursday')
      .valid('Friday')
      .valid('Saturday')
      .valid('Sunday')
      .required(),
    dclock: Joi.string().required(),
    aclock: Joi.string().required(),
    type: Joi.string().valid('Regional').valid('Fast').required(),
  });

  const result = JoiShema.validate(req.body);
  if (result.error) {
    return res.status(400).render('error', { message: `Error: ${result.error}` });
  }

  return next();
});

// ------------------------------------
// filter trains
// ------------------------------------
function minmaxValidate(mi, ma) {
  const min = Number.parseInt(mi, 10);
  const max = Number.parseInt(ma, 10);
  if (Number.isNaN(min) && Number.isNaN(max)) {
    return true;
  }

  if (min > max) {
    return false;
  }

  return true;
}

router.get('/filter', (req, res, next) => {
  const reg = new RegExp('^[A-Z][a-z]+(( |-)[A-Z][a-z]+)*$');

  const JoiShema = Joi.object({
    from: Joi.string().regex(reg).optional().allow(null, ''),
    to: Joi.string().regex(reg).optional().allow(null, ''),
    minprice: Joi.number().min(0).optional()
      .empty('')
      .allow(null),
    maxprice: Joi.number().optional()
      .empty('')
      .allow(null),
    day: Joi.string().valid('Monday')
      .valid('Tuesday')
      .valid('Wednesday')
      .valid('Thursday')
      .valid('Friday')
      .valid('Saturday')
      .valid('Sunday')
      .optional()
      .allow(null, ''),
    dclock: Joi.string().optional().allow(null, ''),
    aclock: Joi.string().optional().allow(null, ''),
    type: Joi.string().valid('Regional').valid('Fast').optional()
      .allow(null, ''),
  });

  const result = JoiShema.validate(req.query);
  if (result.error) {
    return res.status(400).render('error', { message: `Error: ${result.error}` });
  }

  if (!minmaxValidate(req.query.minprice, req.query.maxprice)) {
    return res.status(400).render('error', { message: 'Error: the minprice must be bigger than maxprice' });
  }
  return next();
});

// -------------------------------
// buy ticket
// -------------------------------
router.post('/buy', async (req, res, next) => {
  try {
    const value = await checkIDExisting(req.body.id);
    if (value.length <= 0) {
      return res.status(400).render('error', { message: 'Error: The train id is not valid' });
    }
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
  return next();
});

router.post('/buyTicketWithId', async (req, res, next) => {
  try {
    const value = await checkIDExisting(req.body.id);
    if (value.length <= 0) {
      return res.status(400).render('error', { message: 'Error: The train id is not valid' });
    }
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
  return next();
});

// -------------------------------
// booked tickets
// -------------------------------
router.post('/booked', async (req, res, next) => {
  try {
    const value = await checkIDExisting(req.body.id);
    if (value.length <= 0) {
      return res.status(400).render('error', { message: 'Error: The train id is not valid' });
    }
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
  return next();
});

// -------------------------------
// validate registration
// -------------------------------
router.post('/auth/registration', async (req, res, next) => {
  const JoiShema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    pwd: Joi.string().required(),
  });

  const result = JoiShema.validate(req.body);

  if (result.error) {
    return res.status(400).send(`Error: ${result.error}`);
  }
  const userid = await findUserByName(req.body.username);

  if (userid.length > 0) {
    return  res.status(400).send('Error: this username already exists');
  }
  return next();
});

// -------------------------------
// validate admin registration
// -------------------------------
router.post('/auth/addAdmin', async (req, res, next) => {
  const JoiShema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    pwd: Joi.string().required(),
  });

  const result = JoiShema.validate(req.body);

  if (result.error) {
    return res.status(400).send(`Error: ${result.error}`);
  }
  const userid = await findUserByName(req.body.username);

  if (userid.length > 0) {
    return  res.status(400).send('Error: this username already exists');
  }
  return next();
});

export default router;
