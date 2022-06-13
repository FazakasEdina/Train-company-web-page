import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as db from '../db/db.js';

const secret = 'Fm3ytJxQGDFqXG9';
const router = express.Router();

router.post('/registration', async (req, res) => {
  try {
    const pwd = bcrypt.hashSync(req.body.pwd, 10);
    await db.registrate({ username: req.body.username, password: pwd, email: req.body.email });

    // ha helyesen beregisztralt, akkor atiranyitas bejelentkezesre
    res.redirect('/loginPage');
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

router.post('/addAdmin', async (req, res) => {
  try {
    const pwd = bcrypt.hashSync(req.body.pwd, 10);
    await db.addAdmin({ username: req.body.username, password: pwd, email: req.body.email });

    // atiranyitas fooldalra
    res.redirect('/');
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userid = (await db.findUserByName(req.body.username))[0].UserID;
    if (userid.length <= 0) {
      res.status(400).send('Error: this username does not exists');
    }

    const queryRespond = await db.getUser(userid);
    const pwd = queryRespond[0].Password;
    const username = queryRespond[0].UserName;
    const userlevel = queryRespond[0].UserLevel;

    if (await bcrypt.compare(req.body.pwd, pwd)) {
      // helyes password, beleirom a user level-t is a jwt-be
      const token = jwt.sign({ username, userlevel }, secret);

      // cookie keszites
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
      });

      // ha helyes volt a bejelentkezes atiranyitom
      res.redirect('/');
    } else {
      res.status(401).send('Incorrect login');
    }
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.locals.payload = {};
  res.redirect('/loginPage');
});

export default router;
