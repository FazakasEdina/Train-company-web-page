// import { query } from 'express';
import mysql from 'mysql';
import util from 'util';
import bcrypt from 'bcrypt';

const connectionPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'feim1911',
  database: 'web',
  connectionLimit: 3,
});

// fuggveny ami promisokat kuld vissza, a promist betudjuk varni
const executeQuery = util.promisify(connectionPool.query).bind(connectionPool);

// ------------------------------------------------ felhasznaloval kapcsolatos db muveletek:

// -------
// felhasznalo nev lekerese foglalas ID alapjan
// -------
export function findUserByBooking(id) {
  const query = 'SELECT web.users.UserName FROM web.booking JOIN web.users ON web.booking.clientID = web.users.UserID WHERE web.booking.bookingID = ?';
  return executeQuery(query, [id]);
}

// -------
// felhasznalo ID megtalalasa nev szerint
// -------
export function findUserByName(name) {
  const query = 'SELECT UserID FROM web.users WHERE UserName LIKE ?';
  return executeQuery(query, [name]);
}

// -------
// felhasznalo nev megtalalasa ID szerint -> bejelentekezeshez
// -------
export function getUser(id) {
  const query = 'SELECT UserName, UserLevel, Password FROM web.users WHERE UserID = ?';
  return executeQuery(query, [id]);
}

// ------------------------------------------------ foglalassal kapcsolatos db muveletek:

// -------
// letezik-e a foglalas
// -------
export function checkBookingIdExisting(id) {
  const query = 'SELECT 1 FROM web.booking WHERE bookingID = ?';
  return executeQuery(query, [id]);
}

// -------
// foglalas torles
// -------
export function deleteBooking(id) {
  const query = 'DELETE FROM web.booking WHERE bookingID = ?';
  return executeQuery(query, [id]);
}

// -------
// foglalas
// -------
export function insertBooking(data) {
  // data = { userid, lineid}
  const query = 'INSERT INTO web.booking VALUES (default, ?, ?)';
  return executeQuery(query, [data.lineid, data.userid]);
}

// -------
// osszes foglalas kilistazasa
// -------
export function findAllBookedTicket(id) {
  const query = `SELECT web.booking.bookingID AS bookingID, web.users.UserName AS UserName, web.booking.clientID AS clientID, web.booking.trainlineID AS trainlineID
    FROM web.booking
   JOIN web.users ON web.users.UserID = web.booking.clientID
   WHERE web.booking.trainlineID = ?`;
  return executeQuery(query, [id]);
}
export function findUsersAllBookedTicket(name) {
  const query = `SELECT web.booking.bookingID AS bookingID, web.users.UserName AS UserName, web.booking.clientID AS clientID, web.booking.trainlineID AS trainlineID
  FROM web.booking
 JOIN web.users ON web.users.UserID = web.booking.clientID
 WHERE web.users.UserName LIKE ?`;

  return executeQuery(query, [name]);
}

// ------------------------------------------------ vonattal kapcsolatos db muveletek:

// -------
// vonat hozzaadas
// -------
export function insertTrainLine(data) {
  const query = 'INSERT INTO web.trainline VALUES (default, ?, ?, ?, ?, ?, ?, ?)';
  const params = [data.from, data.to, data.price, data.dclock, data.aclock, data.day, data.type];
  return executeQuery(query, params);
}

// -------
// letezik-e a vonat
// -------
export function checkIDExisting(id) {
  const query = 'SELECT 1 FROM web.trainline WHERE LineID = ?';
  return executeQuery(query, [id]);
}

// -------
// vonat vonal torles
// -------
export function deleteTrainLine(id) {
  const query = 'DELETE FROM web.trainline WHERE LineID = ?';
  return executeQuery(query, [id]);
}

// -------
// minden vonat listazasa
// -------
export function findAllTrainLine() {
  const query = 'SELECT * FROM web.trainline';
  return executeQuery(query);
}

// -------
// vonat megtalalsa id szerint
// -------
export function findTrainLineById(id) {
  const query = 'SELECT * FROM web.trainline WHERE LineID = ?';
  return executeQuery(query, [id]);
}

// -------
// vonat aranak es tipusanak lekerese
// -------
export function byIdGetMoreDetail(id) {
  const query = 'SELECT Price, Type FROM web.trainline WHERE LineID = ?';
  return executeQuery(query, [id]);
}

// -------
// osszes vonat jarat ID-ja
// -------
export function getAllTrainLineID() {
  const query = 'SELECT LineID FROM web.trainline';
  return executeQuery(query);
}

// -------------------------------------------------------
// szures a vonatokra reszenkent a fuggceny hosszusag miatt
// -------

function checkAllData(data) {
  return data.from !== '' || data.to !== '' || !Number.isNaN(data.maxprice) || !Number.isNaN(data.minprice) || data.day !== '' || data.type !== '' || data.dclock !== '' || data.aclock !== '';
}

function createFilterQueryBase(data) {
  let q = 'SELECT * FROM web.trainline';
  if (checkAllData(data)) {
    q += ' WHERE ';
  }
  return q;
}
function createFilterQueryStringPart(query, data) {
  let q = query;
  if (data.from !== '') {
    q += ` DepartureStation = ${connectionPool.escape(data.from)} `;
  }
  if (data.to !== '') {
    if (data.from !== '') {
      q += 'AND';
    }
    q += ` ArrivalStation = ${connectionPool.escape(data.to)} `;
  }
  return q;
}

function createFilterQueryNumberPart(query, data) {
  let q = query;
  if (!Number.isNaN(data.maxprice)) {
    if (data.from !== '' || data.to !== '') {
      // eslint-disable-next-line no-param-reassign
      q += 'AND';
    }
    q += ` Price <= ${connectionPool.escape(data.maxprice)} `;
  }
  if (!Number.isNaN(data.minprice)) {
    if (data.from !== '' || data.to !== '' || !Number.isNaN(data.maxprice)) {
      q += 'AND';
    }
    q += ` Price >= ${connectionPool.escape(data.minprice)} `;
  }
  return q;
}

function createFilterQueryTypePart(query, data) {
  let q = query;
  if (data.type !== '') {
    if (data.from !== '' || data.to !== '' || !Number.isNaN(data.maxprice) || !Number.isNaN(data.minprice)) {
      q += 'AND';
    }
    q += ` Type LIKE ${connectionPool.escape(data.type)} `;
  }
  return q;
}

function createFilterQueryDayPart(query, data) {
  let q = query;
  if (data.day !== '') {
    if (data.from !== '' || data.to !== '' || !Number.isNaN(data.maxprice) || !Number.isNaN(data.minprice) || data.type !== '') {
      q += 'AND';
    }
    q += ` Day LIKE ${connectionPool.escape(data.day)} `;
  }
  return q;
}

function createFilterQueryDClockPart(query, data) {
  let q = query;
  if (data.dclock !== '') {
    if (data.from !== '' || data.to !== '' || !Number.isNaN(data.maxprice) || !Number.isNaN(data.minprice) || data.type !== '' || data.day !== '') {
      q += 'AND';
    }
    q += ` DepartureTime >= ${connectionPool.escape(data.dclock)} `;
  }
  return q;
}

function createFilterQueryAClockPart(query, data) {
  let q = query;
  if (data.aclock !== '') {
    if (checkAllData(data)) {
      q += 'AND';
    }
    q += ` ArrivalTime <= ${connectionPool.escape(data.aclock)} `;
  }
  return q;
}
export function filterTrainLines(data) {
  // {data.from, data.to, data.minprice, data.maxprice, data.type, data.day, data.dclock}
  let query = createFilterQueryBase(data);
  query = createFilterQueryStringPart(query, data);
  query = createFilterQueryNumberPart(query, data);
  query = createFilterQueryTypePart(query, data);
  query = createFilterQueryDayPart(query, data);
  query = createFilterQueryDClockPart(query, data);
  query = createFilterQueryAClockPart(query, data);

  return executeQuery(query);
}

// -------
// atszallasok megtalalasa egy atszallassal
// -------
export function findOneInterchange(data) {
  // t1.DepartureStation as FirstDepartureStation, t1.ArrivalStation as FisrtArrivalStation,
  // t1.DepartureTime as FirstDepartureTime, t1.ArrivalTime as FirstArrivalTime, t1.Day as day,

  let query = 'select t1.LineID as FirstLineID, t1.DepartureStation as FirstDepartureStation, t1.ArrivalStation as IntermediateStation, t1.DepartureTime as FirstDepartureTime, t1.ArrivalTime as FirstArrivalTime, t1.Day as Day, t1.Price + t2.Price as Sum, TIMEDIFF(t2.ArrivalTime, t1.DepartureTime) as Time, t2.LineID as SecondLineID, t2.ArrivalStation as EndStation, t2.DepartureTime as SecondDepartureTime, t2.ArrivalTime as SecondArrivalTime '
  + 'from web.trainline as t1 join web.trainline as t2 '
  + 'on t1.ArrivalStation = t2.DepartureStation '
  + 'where t1.DepartureStation = ?'
  + ' AND t2.ArrivalStation = ?'
  + ' AND t1.ArrivalTime < t2.DepartureTime'
  + ' AND t1.Day = t2.Day';
  const params = [data.from, data.to];
  if (data.day !== '') {
    query += ' AND t1.Day = ?';
    params.push(data.day);
  }
  if (data.type !== '') {
    query += ' AND t1.Type = ? AND t2.Type = ?';
    params.push(data.type);
    params.push(data.type);
  }
  if (data.dclock !== '') {
    query += ' AND t1.DepartureTime >= ?';
    params.push(data.dclock);
  }
  if (data.aclock !== '') {
    query += ' AND t2.ArrivalTime <= ?';
    params.push(data.aclock);
  }
  // egyetlen a price-ra nem teszek szuresi feltetelt
  return executeQuery(query, params);
}
// -------------------------------------------------------------------
// -------
// uj felhszanlo regisztralasa
// -------
export function registrate(data) {
  // data.username, data.password, data.email
  return executeQuery('INSERT INTO web.users VALUES (default, ?, ?, \'user\', ?);', [data.username, data.email, data.password]);
}
// -------
// uj admin regisztralasa
// -------
export function addAdmin(data) {
  // data.username, data.password, data.email
  return executeQuery('INSERT INTO web.users VALUES (default, ?, ?, \'admin\', ?);', [data.username, data.email, data.password]);
}

// -------
// beszur par felhasznalot
// -------
function insertDefaultUsers() {
  const pwd1 = bcrypt.hashSync('kativagyok', 10);
  const pwd2 = bcrypt.hashSync('szilvi1234', 10);
  const pwd3 = bcrypt.hashSync('janiboss', 10);

  return executeQuery(`INSERT IGNORE INTO web.users VALUES (default, 'Kati', 'katika@gmail.com', 'admin', ?), 
   (default, 'Szilvi', 'szilvi@gmail.com', 'user', ?),
   (default, 'Janos', 'jani@gmail.com', 'user', ?);`, [pwd1, pwd2, pwd3]);
}

// ------------
// minden inditasnal letre hozza a felhasznalokat, ha ezelott nem lettek volna
// ------------
(async () => {
  try {
    await insertDefaultUsers();
  } catch (err) {
    console.error(err);
  }
})();
