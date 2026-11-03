/**
 * Seeds the Services Plus website header and footer as CMS menus (Menus & Navigation).
 *
 *   node scripts/seed-servicesplus-menus.js              # write (menus stay inactive)
 *   node scripts/seed-servicesplus-menus.js --activate   # write and set these two menus active
 *   node scripts/seed-servicesplus-menus.js --dry-run    # only print what would happen
 *
 * Data: scripts/data/servicesplus-navigation.js (links copied from ../services_plus_fr).
 * Creates "Services Plus Header" (location header) and "Services Plus Footer" (location footer).
 * The public GET /menus only lists active menus, so the Services Plus website needs --activate.
 * Other menus are never changed: the Tax Alphonic website uses the oldest active menu of each
 * location, the Services Plus website picks its menu by name (SITE_HEADER_MENU / SITE_FOOTER_MENU).
 * Safe to run again: the menus are found by name and their items rebuilt.
 */
const db = require('../models');
const MenuService = require('../services/MenuService');
const { HEADER, FOOTER } = require('./data/servicesplus-navigation');

const DRY = process.argv.includes('--dry-run');
const ACTIVATE = process.argv.includes('--activate');
const MENUS = [
  { name: 'Services Plus Header', location: 'header', items: HEADER },
  { name: 'Services Plus Footer', location: 'footer', items: FOOTER },
];

const countItems = (items) => items.reduce((n, item) => n + 1 + countItems(item.children || []), 0);

async function main() {
  const { Menu } = db;
  for (const { name, location, items } of MENUS) {
    console.log(`${name} (${location}): ${items.length} top items, ${countItems(items)} items in all`);
  }
  if (DRY) {
    console.log('Dry run: nothing written.');
    return;
  }

  const status = ACTIVATE ? 'active' : 'inactive';
  for (const { name, location, items } of MENUS) {
    let menu = await Menu.findOne({ where: { name, location } });
    if (!menu) menu = await Menu.create({ name, location, status });
    await MenuService.updateMenuWithItems(menu.id, { status, items });

    console.log(`"${name}" saved (${ACTIVATE ? 'active' : 'inactive: run with --activate for the website'}).`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.sequelize.close());
