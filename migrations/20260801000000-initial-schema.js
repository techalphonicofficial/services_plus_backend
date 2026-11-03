'use strict';

// Initial schema for a brand-new database: creates every table from the current models
// (sequelize.sync without alter). The core tables (users, roles, permissions, services, pages,
// blogs, media, menus, ...) were never created by a migration, so `db:migrate` alone could not
// build a new database. Runs first; the later migrations skip tables / columns that already exist.
// On an existing database (a `users` table is there) it does nothing.
module.exports = {
  up: async (queryInterface) => {
    const tables = (await queryInterface.showAllTables()).map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());
    if (tables.includes('users')) return;

    const db = require('../models');
    await db.sequelize.sync();
    await db.sequelize.close();
  },

  down: async () => {
    // Dropping every table is never done by a migration.
  },
};
