import express from 'express';
import * as db from '../db/db.js';
import { checkJWTToken } from '../middleware/auth.js';

const router = express.Router();

// -------------------------------
// add new train line
// -------------------------------
router.post('/add', checkJWTToken, async (req, res) => {
  if (res.locals.payload.userlevel !== 'admin') {
    res.status(403).render('error', { message: 'Error: you do not have permission' });
  }

  // data.from, data.to, data.price, data.clock, data.day, data.type
  const data = {
    from: req.body.from,
    to: req.body.to,
    day: req.body.day,
    dclock: req.body.dclock,
    aclock: req.body.aclock,
    type: req.body.type,
    price: req.body.price,
  };

  try {
    await db.insertTrainLine(data);
    res.redirect('/');
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});

// -------------------------------
// buy ticket
// -------------------------------
router.post('/buy', checkJWTToken, async (req, res) => {
  let request;
  let mess = '';
  let userID;
  try {
    userID = await db.findUserByName(req.body.username);
    if (userID.length > 0) {
      // succes

      await db.insertBooking({ lineid: req.body.id, userid: userID[0].UserID });
      mess = 'The booking was successful';
      request = await db.getAllTrainLineID();
      res.render('buyTicket', { req: request, message: mess });
    } else {
      // username doesn't exists

      mess = 'Error: the username does not exists';
      request = await db.getAllTrainLineID();
      res.render('buyTicket', { req: request, message: mess });
    }
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});

router.post('/buyWithGivenId', checkJWTToken, async (req, res) => {
  let mess = '';
  let userID;
  try {
    userID = await db.findUserByName(req.body.username);
    if (userID.length > 0) {
      // succes

      await db.insertBooking({ lineid: req.body.id, userid: userID[0].UserID });
      mess = 'The booking was successful';
      res.render('buyTicketWithId', { id: req.body.id, message: mess });
    } else {
      // username doesn't exists

      mess = 'Error: the username does not exists';
      res.render('buyTicketWithId', { id: req.body.id, message: mess });
    }
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});

export default router;
