'use strict';
const { v4: uuidv4 } = require('uuid'); 
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);

    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@example.com'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminUser && adminUser.length > 0) {
      await queryInterface.bulkInsert('Profiles', [
        {
          id: uuidv4(),
          userId: adminUser[0].id,
          firstName: 'Super',
          lastName: 'Admin',
          bio: 'This is the initial admin user profile..',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
    }

  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};
