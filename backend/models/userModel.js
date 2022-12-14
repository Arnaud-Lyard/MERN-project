const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
})

// static signup method
userSchema.statics.signup = async function(email, password) {

  // validation
  if (!email || !password) {
    throw Error('Tous les champs doivent être remplis')
  }
  if (!validator.isEmail(email)) {
    throw Error('Adresse email non valide')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Mot de passe plus complexe')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Adresse email déjà utilisée')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash })

  return user
}

module.exports = mongoose.model('User', userSchema)