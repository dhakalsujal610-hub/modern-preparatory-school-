const bcrypt = require('bcrypt')
const { sequelize, User } = require('./db')

async function changePassword(newPassword) {
  await sequelize.authenticate()
  const user = await User.findOne({ where: { username: 'admin' } })
  if (!user) {
    console.error('Admin user not found.');
    process.exit(1)
  }
  const hash = await bcrypt.hash(newPassword, 10)
  await user.update({ password_hash: hash })
  console.log('Admin password updated successfully.')
  process.exit(0)
}

const newPass = process.argv[2]
if (!newPass) {
  console.error('Usage: node change_admin_password.js <newPassword>')
  process.exit(1)
}

changePassword(newPass).catch(err => {
  console.error('Failed to change password:', err)
  process.exit(1)
})
