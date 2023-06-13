import bcrypt from 'bcrypt'
import db from '../db'

import jwt from 'jsonwebtoken'
import config from '../config'

export function generateToken(username: string) {
  const payload = {
    username,
  }

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  })
  return token
}

/**
 * Hashes the provided password.
 * @param   password - The password to hash.
 * @returns  Hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = config.salt
  // Generate a salt and hash the password using bcrypt
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

/**
 * Authenticates a user and generates a session token.
 * @param  username - The username.
 * @param  password - The password.
 * @returns Session token if authentication is successful, null otherwise.
 */
export async function authenticateUser(username: string, password: string): Promise<string> {
  // Retrieve the user from the database based on the provided username
  const user = await db.getUserByUsername(username)

  // Check if the user exists and the password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate a session token
    const token = await generateToken(username)

    // Save the session token in the database for the user
    await db.saveSessionToken(user.id, token)

    return token
  }

  return null
}

/**
 * Verifies the validity of a session token.
 * @param  sessionToken - The session token to verify.
 * @returns True if the session token is valid, false otherwise.
 */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      username: string
    }
    const userId = await db.getUserIdBySessionToken(token)
    const user = await db.getUserById(userId)

    if (userId === undefined || user?.username !== decoded.username) {
      return false
    }

    return true
  } catch (error) {
    throw new Error('Invalid session token:' + error)
  }
}

/**
 * Checks if a user is an administrator.
 * @param  username - The username.
 * @returns  True if the user is an administrator, false otherwise.
 */
export async function isAdmin(username: string): Promise<boolean> {
  // Retrieve the user from the database based on the provided username
  const user = await db.getUserByUsername(username)

  // Check if the user exists and is an administrator
  return user && user.id === 0
}
