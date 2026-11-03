'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/*
 * Startup data a new database needs before the first login:
 * 1. Every permission the code checks (same catalogue as migration 20261023000002; add new modules to both).
 * 2. The "Admin" role (auth.js passes every check for this name) linked to all of them.
 * 3. One active admin user: .env ADMIN_EMAIL / ADMIN_PASSWORD, else the defaults below.
 * Idempotent: re-running adds only what is missing; an existing user's password is never changed.
 *
 * Run after the migrations: npx sequelize-cli db:seed:all
 */

const CATALOGUE = {
  AboutPage: ['create', 'delete', 'read', 'update'],
  AuditLogs: ['create', 'delete', 'read', 'update'],
  Banners: ['create', 'delete', 'read', 'update'],
  BlogAuthors: ['create', 'delete', 'read', 'update'],
  BlogCategories: ['create', 'delete', 'read', 'update'],
  BlogTags: ['create', 'delete', 'read', 'update'],
  Blogs: ['create', 'delete', 'read', 'update'],
  Branches: ['create', 'delete', 'read', 'update'],
  CMS: ['create', 'delete', 'read', 'update'],
  CRM: ['create', 'delete', 'read', 'update'],
  Countries: ['create', 'delete', 'read', 'update'],
  Dashboard: ['read'],
  FAQs: ['create', 'delete', 'read', 'update'],
  Forms: ['create', 'delete', 'read', 'update'],
  Industries: ['create', 'delete', 'read', 'update'],
  Inquiries: ['create', 'delete', 'read', 'update'],
  LandingPages: ['archive', 'create', 'preview', 'publish', 'read', 'unpublish', 'update'],
  Locations: ['create', 'delete', 'read', 'update'],
  Media: ['create', 'delete', 'read', 'update'],
  Menus: ['create', 'delete', 'read', 'update'],
  Packages: ['create', 'delete', 'read', 'update'],
  PageCategories: ['create', 'delete', 'read', 'update'],
  Pages: ['create', 'delete', 'read', 'update'],
  Partners: ['create', 'delete', 'read', 'update'],
  Permissions: ['create', 'delete', 'read', 'update'],
  Portfolio: ['create', 'delete', 'read', 'update'],
  PortfolioCategories: ['create', 'delete', 'read', 'update'],
  PortfolioItems: ['create', 'delete', 'read', 'update'],
  Problems: ['create', 'delete', 'read', 'update'],
  Roles: ['create', 'delete', 'read', 'update'],
  SEO: ['create', 'delete', 'read', 'update'],
  SEOConfigs: ['create', 'delete', 'read', 'update'],
  SEOPages: ['create', 'delete', 'read', 'update'],
  ServiceCategories: ['create', 'delete', 'read', 'update'],
  Services: ['create', 'delete', 'read', 'update'],
  Settings: ['create', 'delete', 'read', 'update'],
  States: ['create', 'delete', 'read', 'update'],
  SystemLogs: ['delete', 'read'],
  TeamMembers: ['create', 'delete', 'read', 'update'],
  Technologies: ['create', 'delete', 'read', 'update'],
  Testimonials: ['create', 'delete', 'read', 'update'],
  Users: ['create', 'delete', 'read', 'update'],
};

const ADMIN_ROLE = 'Admin';
const ADMIN_ROLE_DESCRIPTION = 'Super admin: full access to every module.';
const DEFAULT_EMAIL = 'admin@taxalphonic.com';
const DEFAULT_PASSWORD = 'Admin@12345';

const VERB = { create: 'Create', read: 'View', update: 'Edit', delete: 'Delete', archive: 'Archive', preview: 'Preview', publish: 'Publish', unpublish: 'Unpublish' };

module.exports = {
  up: async (queryInterface) => {
    const q = (sql, replacements = []) => queryInterface.sequelize.query(sql, { replacements }).then(([rows]) => rows);
    const now = new Date();

    // 1. Permissions (missing ones only)
    const existing = await q('SELECT id, module, action FROM permissions');
    const key = (m, a) => `${m}|${a}`;
    const ids = new Map(existing.map((p) => [key(p.module, p.action), p.id]));
    const newPerms = [];
    Object.entries(CATALOGUE).forEach(([module, actions]) => actions.forEach((action) => {
      if (ids.has(key(module, action))) return;
      const id = uuidv4();
      ids.set(key(module, action), id);
      newPerms.push({ id, module, action, description: `${VERB[action] || action} ${module}`, createdAt: now, updatedAt: now });
    }));
    if (newPerms.length) await queryInterface.bulkInsert('permissions', newPerms);

    // 2. Admin role (a soft-deleted or inactive one is brought back), linked to every permission in the table
    let [admin] = await q('SELECT id, deletedAt, isActive FROM roles WHERE name = ? LIMIT 1', [ADMIN_ROLE]);
    if (!admin) {
      admin = { id: uuidv4() };
      await queryInterface.bulkInsert('roles', [{ id: admin.id, name: ADMIN_ROLE, description: ADMIN_ROLE_DESCRIPTION, isActive: true, createdAt: now, updatedAt: now }]);
    } else if (admin.deletedAt || !admin.isActive) {
      await q('UPDATE roles SET deletedAt = NULL, isActive = 1, updatedAt = ? WHERE id = ?', [now, admin.id]);
    }

    const allIds = (await q('SELECT id FROM permissions')).map((p) => p.id);
    const have = new Set((await q('SELECT permissionId FROM rolepermissions WHERE roleId = ?', [admin.id])).map((r) => r.permissionId));
    // The join table may or may not have timestamps (sync vs. older schema)
    const linkColumns = await queryInterface.describeTable('rolepermissions');
    const stamps = linkColumns.createdAt ? { createdAt: now, updatedAt: now } : {};
    const links = allIds.filter((id) => !have.has(id)).map((permissionId) => ({ roleId: admin.id, permissionId, ...stamps }));
    if (links.length) await queryInterface.bulkInsert('rolepermissions', links);

    // 3. Admin user (bulkInsert skips model hooks, so the password is hashed here)
    const email = (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
    const [user] = await q('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (user) {
      // Keeps the password; makes sure the account can log in with full access
      await q('UPDATE users SET roleId = ?, isActive = 1, deletedAt = NULL, updatedAt = ? WHERE id = ?', [admin.id, now, user.id]);
      console.log(`Admin user ${email} already exists: role set to ${ADMIN_ROLE}, password unchanged.`);
    } else {
      await queryInterface.bulkInsert('users', [{
        id: uuidv4(),
        firstName: 'Super',
        lastName: 'Admin',
        email,
        password: await bcrypt.hash(password, 10),
        isActive: true,
        emailVerified: true,
        roleId: admin.id,
        createdAt: now,
        updatedAt: now,
      }]);
      console.log(`Admin user created: ${email} (password from ADMIN_PASSWORD or the default). Change it after the first login.`);
    }
    console.log(`Permissions added: ${newPerms.length}, linked to ${ADMIN_ROLE}: ${links.length}.`);
  },

  down: async () => {
    // Nothing is removed: deleting the admin user / role / permissions could lock everyone out.
  },
};
