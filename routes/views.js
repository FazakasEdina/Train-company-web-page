import express from 'express';
import * as db from '../db/db.js';
import { checkJWTToken } from '../middleware/auth.js';

const router = express.Router();

// -------------------------------
// list of all
// -------------------------------
router.get('/', async (req, res) => {
  try {
    const request = await db.findAllTrainLine();
    res.render('list', { request });
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});

// ------------------------------------
// filter trains
// ------------------------------------
router.get('/filter', async (req, res) => {
  const minprice = Number.parseInt(req.query.minprice, 10);
  const maxprice = Number.parseInt(req.query.maxprice, 10);

  const data = {
    from: req.query.from,
    to: req.query.to,
    minprice,
    maxprice,
    type: req.query.type,
    day: req.query.day,
    dclock: req.query.dclock,
    aclock: req.query.aclock,
  };
  let request = [];
  try {
    request = await db.filterTrainLines(data);
    if (data.from !== '' && data.to !== '') {
      const interchanges = await db.findOneInterchange(data);
      res.render('filter', { request, interchanges });
    } else {
      res.render('filter', { request, interchanges: [] });
    }
  } catch (err) {
    res.status(500).render('error', { message: `Error: in filtering ${err.message}` });
  }
});

// -------------------------------
// buy ticket
// -------------------------------
router.get('/buyTicket', checkJWTToken, async (req, res) => {
  let request;
  try {
    request = await db.getAllTrainLineID();
    res.render('buyTicket', { req: request, message: '' });
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});

router.get('/buyTicketWithId', checkJWTToken, (req, res) => {
  res.render('buyTicketWithId', { id: req.query.id, message: '' });
});

// -------------------------------
// booked tickets
// -------------------------------
router.get('/booked', checkJWTToken, async (req, res) => {
  try {
    const request = await db.findAllBookedTicket(req.query.id);
    res.render('bookingsList', { request });
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});

// -----------------------------
//  render add train
// -----------------------------
router.get('/addTrain', checkJWTToken, (req, res) => {
  if (res.locals.payload.userlevel !== 'admin') {
    res.status(403).render('error', { message: 'Error: you do not have permission' });
  } else {
    res.render('addTrain');
  }
});
// -----------------------------
//  render add admin
// -----------------------------
router.get('/addAdmin', checkJWTToken, (req, res) => {
  if (res.locals.payload.userlevel !== 'admin') {
    res.status(403).render('error', { message: 'Error: you do not have permission' });
  } else {
    res.render('addAdmin');
  }
});
// -----------------------------
//  render login page
// -----------------------------
router.get('/loginPage', (req, res) => {
  res.render('loginPage');
});
// -----------------------------
//  render registration page
// -----------------------------
router.get('/registration', (req, res) => {
  res.render('registration');
});
// -----------------------------
//  render filter page
// -----------------------------
router.get('/filterPage', (req, res) => {
  res.render('filterPage');
});
// -----------------------------
//  list users bookings
// -----------------------------
router.get('/listMyBookings', checkJWTToken, async (req, res) => {
  try {
    const request = await db.findUsersAllBookedTicket(res.locals.payload.username);
    res.render('bookingsList', { request });
  } catch (err) {
    res.status(500).render('error', { message: `Error: ${err.message}` });
  }
});
export default router;
