import express from 'express';
import { checkIDExisting, checkBookingIdExisting } from '../db/db.js';

const router = express.Router();
// -------------------------------
// list details
// -------------------------------
router.get('/listDetails/:id', async (req, res, next) => {
  try {
    const value = await checkIDExisting(req.params.id);
    if (value.length <= 0) {
      return res.status(400).json({ message: 'Error: The train id is not valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
  return next();
});

// -------------------------------
// delete train line
// -------------------------------
router.delete('/delete/:id', async (req, res, next) => {
  try {
    const value = await checkIDExisting(req.params.id);
    if (value.length <= 0) {
      return res.status(400).json({ message: 'Error: The train id is not valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
  return next();
});

// -------------------------------
// delete booking
// -------------------------------
router.delete('/deleteBooking/:id', async (req, res, next) => {
  try {
    const value = await checkBookingIdExisting(req.params.id);
    if (value.length <= 0) {
      return res.status(400).json({ message: 'Error: The booking id is not valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
  return next();
});

export default router;
