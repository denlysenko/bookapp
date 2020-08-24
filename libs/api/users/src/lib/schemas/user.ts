// tslint:disable:only-arrow-functions
import { ROLES } from '@bookapp/shared';

import { pbkdf2, pbkdf2Sync, randomBytes } from 'crypto';
import { Schema } from 'mongoose';

import { USER_VALIDATION_ERRORS } from '../constants';
import { UserModel } from '../interfaces/user';

/**
 * A Validation function for password
 */
const validatePassword = function (password) {
  return password && password.length > 6;
};

const defaultByteSize = 16;

export const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, USER_VALIDATION_ERRORS.FIRST_NAME_REQUIRED_ERR],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, USER_VALIDATION_ERRORS.LAST_NAME_REQUIRED_ERR],
  },
  displayName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR],
    match: [/.+\@.+\..+/, USER_VALIDATION_ERRORS.EMAIL_INVALID_ERR],
  },
  password: {
    type: String,
    default: '',
    validate: [validatePassword, USER_VALIDATION_ERRORS.PASSWORD_LENGTH_ERR],
  },
  salt: String,
  avatar: String,
  roles: {
    type: [{ type: String, enum: [ROLES.ADMIN, ROLES.USER] }],
    default: [ROLES.USER],
  },
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reading: {
    epubUrl: {
      type: String,
      default: '',
    },
    bookmark: {
      type: String,
      default: '',
    },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Validate email is not taken
UserSchema.path('email').validate(function (value) {
  return this.constructor
    .findOne({ email: value })
    .exec()
    .then((user) => {
      if (user) {
        return this._id.equals(user._id);
      }
      return true;
    })
    .catch((err) => {
      throw err;
    });
}, USER_VALIDATION_ERRORS.EMAIL_IN_USE_ERR);

/**
 * Pre-save hook
 */
UserSchema.pre<UserModel>('save', function (next) {
  // Handle new/update passwords
  if (!this.isModified('password')) {
    return next();
  }
  // Make salt with a callback
  this.makeSalt(defaultByteSize, (saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }

    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      return next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error(USER_VALIDATION_ERRORS.MISSING_CALLBACK_ERR);
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback(USER_VALIDATION_ERRORS.MISSING_PASSWORD_OR_SALT);
      }
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = Buffer.from(this.salt, 'base64');

    if (!callback) {
      return pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512').toString(
        'base64'
      );
    }

    return pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  },
};
