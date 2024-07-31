const { User } = require('../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth } = require('../../config/index');
const { pgClient } = require('../../db/index')
const { v4: uuidv4 } = require('uuid');
const saltRounds = auth.saltRounds;
const jwtSecret = auth.jwtSecret;
const jwtExpiration = auth.jwtExpiration;
const refreshJwtSecret = auth.refreshJwtSecret;
const refreshJwtExpiration = auth.refreshJwtExpiration
const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    // const newUser = new User({
    //   ...userData,
    //   password: hashedPassword,
    // });
    // await newUser.save();
    // return newUser;
    return getCreatePgUsers({ ...userData, password: hashedPassword });
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find({});
    // return users;//mongodb
    return getALlPgUsers();
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

const getUserById = async (id) => {
  try {
    // const user = await User.findById(id);
    const user = getByIdPgUsers(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

const updateUser = async (id, updateData) => {
  try {
    // const user = await User.updateOne({ _id: id }, updateData);

    // if (!user) throw new Error('User not found');
    // return user;
    return getUpdatePgUsers(id, updateData)
  } catch (error) {
    console.error('Error updating user:', error.message); // Log the error
    throw new Error('Error updating user: ' + error.message);
  }
};


const deleteUser = async (id) => {
  try {
    // const user = await User.deleteOne({ _id: id });
    const user = deleteByIdPgUsers(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiration });
  const refreshToken = jwt.sign({ id: user._id }, refreshJwtSecret, { expiresIn: refreshJwtExpiration });

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email
  };

  return { user: userResponse, token, refreshToken };
};
const refreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, refreshJwtSecret);
    const token = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: jwtExpiration });
    return token;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

const getALlPgUsers = async () => {
  try {
    const result = await pgClient.query('SELECT * FROM "user"');
    console.log({ getALlPgUsers: result.rows });
    return result.rows
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getByIdPgUsers = async (id) => {
  try {
    const result = await pgClient.query('SELECT * FROM "user" WHERE "id" = $1', [id]);
    console.log({ getByIdPgUsers: result.rows[0] });
    if (result.rows.length > 0) {
      return result.rows[0]
    }
    return null
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const deleteByIdPgUsers = async (id) => {
  try {
    const result = await pgClient.query('DELETE FROM "user" WHERE "id" = $1', [id]);
    console.log({ deleteByIdPgUsers: result });
    return result
    return null
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getUpdatePgUsers = async (id, updateData) => {
  try {
    const result = await pgClient.query('UPDATE "user" SET "name" = $1 WHERE "id" = $2 RETURNING *', [updateData.name, id]);
    console.log({ getUpdatePgUsers: result.rows[0] });
    return result.rows[0]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getCreatePgUsers = async (userData) => {
  const uuid = uuidv4()
  console.log({ userData });
  try {
    const result = await pgClient.query('INSERT INTO "user" ("id", "name", "email", "password") VALUES ($1, $2, $3, $4) RETURNING *', [uuid, userData.name, userData.email, userData.password]);

    console.log({ getCreatePgUsers: result.rows[0] });
    return result.rows[0]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  authenticateUser,
  refreshToken,
};
