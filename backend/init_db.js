const bcrypt = require('bcrypt');
const { sequelize, User } = require('./db');

async function init() {
  await sequelize.sync({ force: true });
  console.log('Database synced');

  const password = 'gracelight9810';
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username: 'admin', password_hash: hash });
  console.log('Default admin user created with username "admin" and password "gracelight9810"');

  // add a couple of demo applications
  const { Application } = require('./db');
  await Application.bulkCreate([
    {
      student_name: 'Alice Johnson',
      date_of_birth: '2015-06-12',
      grade_applying: '5',
      parent_name: 'Mark Johnson',
      phone: '555-0001',
      email: 'alice.parent@example.com',
      address: '101 Maple St',
      previous_school: 'Elm Elementary',
      documents_info: 'Birth certificate',
      status: 'Pending'
    },
    {
      student_name: 'Bob Lee',
      date_of_birth: '2017-03-25',
      grade_applying: '3',
      parent_name: 'Linda Lee',
      phone: '555-0002',
      email: 'linda.lee@example.com',
      address: '202 Oak Ave',
      previous_school: 'Oak Hills',
      documents_info: 'Report card, Immunization record',
      status: 'Approved',
      submitted_at: new Date(Date.now() - 86400000) // yesterday
    }
  ]);
  console.log('Added sample applications');
  process.exit(0);
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});