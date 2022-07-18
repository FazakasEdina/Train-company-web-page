import express from 'express';
import * as db from '../db/db.js';
import { checkJWTToken } from '../middleware/auth.js';

const router = express.Router();

// -------------------------------
// list details
// -------------------------------
router.get('/listDetails/:id', async (req, res) => {
  try {
    const respond = await db.byIdGetMoreDetail(req.params.id);
    res.json(respond[0]);
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// -------------------------------
// delete train line
// -------------------------------
router.delete('/delete/:id', checkJWTToken, async (req, res) => {
  try {
    if (res.locals.payload.userlevel !== 'admin') {
      res.status(403).json({ message: 'Only the admins can delete train line.' });
    } else {
      const message = await db.deleteTrainLine(req.params.id);

      if (message.message !== '') {
        res.status(400).json({ message: message.message });
      }
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// -------------------------------
// delete booking
// -------------------------------
router.delete('/deleteBooking/:id', checkJWTToken, async (req, res) => {
  try {
    const usernameInDB = (await db.findUserByBooking(req.params.id))[0].UserName;
    if (usernameInDB !== res.locals.payload.username) {
      res.status(400).json({ message: 'The username is invalid' });
    } else {
      const message = await db.deleteBooking(req.params.id);
      if (message.message !== '') {
        res.status(400).json({ message: message.message });
      }
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

export default router;
