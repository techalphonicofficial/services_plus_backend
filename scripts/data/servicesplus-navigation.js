// Header and footer links of the Services Plus website (../services_plus_fr):
// categories = src/content/navigation.js (NAV_CATEGORIES), the rest = src/components/layout/TopNav.jsx
// and Footer.jsx. Used by scripts/seed-servicesplus-menus.js. Keep in sync when the website changes.
const service = (title, slug) => ({ title, url: `/service/${slug}` });

const CATEGORIES = [
  {
    title: 'Startup',
    url: '/service-by-categories/startup',
    services: [
      service('Private Limited Company', 'private-limited-company'),
      service('Limited Liability Partnership', 'limited-liability-partnership'),
      service('One Person Company', 'one-person-company'),
      service('Startup India Registration', 'startup-india-registration'),
      service('UDYAM / MSME Registration', 'udyam-registration'),
      service('Proprietorship Registration', 'proprietorship-registration'),
      service('Partnership Registration', 'partnership'),
      service('Indian Subsidiary', 'indian-subsidiary'),
      service('Section 8 NGO Company', 'section-8-company'),
      service('USA Company Registration', 'usa-company-registration'),
    ],
  },
  {
    title: 'Trademark',
    url: '/service-by-categories/trademark',
    services: [
      service('Trademark Registration', 'trademark-registration'),
      service('Trademark Objection Reply', 'trademark-objection'),
      service('Trademark Opposition', 'trademark-opposition'),
      service('Trademark Renewal', 'trademark-renewal'),
      service('Copyright Registration', 'copyright-registration'),
      service('USA Trademark Filing', 'usa-trademark'),
      service('UAE Trademark Registration', 'uae-trademark'),
    ],
  },
  {
    title: 'Taxes',
    url: '/service-by-categories/taxes',
    services: [
      service('GST Registration', 'gst-registration'),
      service('GST Return Filing', 'gst-return-filing'),
      service('Business Tax Return Filing', 'business-tax-return-filing'),
      service('TDS Return Filing', 'tds-return-filing'),
      service('ITR-3 Return Filing', 'itr-3-return-filing'),
      service('ITR-4 Sugam Filing', 'itr-4-return-filing'),
      service('ITR-5 Return Filing', 'itr-5-return-filing'),
      service('Income Tax Notice Response', 'income-tax-notice-response'),
      service('GST LUT Export Forms', 'gst-lut-forms'),
      service('GST Registration Cancellation', 'gst-registration-cancellation'),
    ],
  },
  {
    title: 'Compliance',
    url: '/service-by-categories/compliance',
    services: [
      service('Private Limited Compliance', 'private-limited-company-compliance'),
      service('LLP Annual Compliance', 'llp-compliance'),
      service('Proprietorship Compliance', 'proprietorship-compliance'),
      service('Partnership Compliance', 'partnership-compliance'),
      service('HR and Payroll Services', 'hr-and-payroll-service'),
      service('EPF Registration', 'epf-registration'),
      service('Share Transfer Filing', 'share-transfer'),
      service('Director Removal / Resignation', 'removal-resignation-of-directors'),
      service('Registered Office Change', 'registered-office-change'),
      service('Winding Up of Company', 'winding-up-the-company'),
    ],
  },
  {
    title: 'Certification & Licensing',
    url: '/service-by-categories/certification-licensing',
    services: [
      service('FSSAI Food License', 'fssai-registration'),
      service('Import Export Code (IEC)', 'import-export-code'),
      service('PSARA Security Agency License', 'psara-license'),
      service('Gem Portal Registration', 'gem-registration'),
      service('Trade License', 'trade-license'),
      service('AYUSH License', 'ayush-license'),
      service('FDA Cosmetic/Drug License', 'fda-license'),
      service('CE Marking Certificate', 'ce-certificate'),
      service('Liquor License', 'liquor-license'),
      service('Music License', 'music-license'),
    ],
  },
];

// TopNav.jsx: category mega menus, Blogs, Contact, the Login account menu and the Get Started button.
const HEADER = [
  ...CATEGORIES.map((c) => ({ title: c.title, url: c.url, children: c.services })),
  { title: 'Blogs', url: '/blog' },
  { title: 'Contact', url: '/contact' },
  {
    title: 'Login',
    url: '/user-login',
    children: [
      { title: 'Client Login', url: '/user-login' },
      { title: 'Notifications', url: '/notification' },
      { title: 'Online Payment', url: '/payment' },
    ],
  },
  { title: 'Get Started', url: '/user-register' },
];

// Footer.jsx, as the CMS footer's three levels (main heading → column → links): one column per
// category (first 7 services + "All …"), then the bottom-bar links and the social profiles.
const FOOTER = [
  {
    title: 'Services',
    url: '#',
    children: CATEGORIES.map((c) => ({
      title: c.title,
      url: c.url,
      children: [...c.services.slice(0, 7), { title: `All ${c.title}`, url: c.url }],
    })),
  },
  {
    title: 'Company',
    url: '#',
    children: [
      {
        title: 'Quick Links',
        url: '#',
        children: [
          { title: 'Privacy Policy', url: '/policy/privacy-policy' },
          { title: 'Terms & Conditions', url: '/policy/terms-and-condition' },
          { title: 'About Us', url: '/about' },
          { title: 'Contact', url: '/contact' },
          { title: 'Payment', url: '/payment' },
          { title: 'Notifications', url: '/notification' },
        ],
      },
      {
        title: 'Follow Us',
        url: '#',
        children: [
          { title: 'LinkedIn', url: 'https://www.linkedin.com/company/78746155/admin/dashboard/', target: '_blank' },
          { title: 'X (Twitter)', url: 'https://x.com/servicesplusin', target: '_blank' },
          { title: 'Facebook', url: 'https://www.facebook.com/Inservicesplus', target: '_blank' },
          { title: 'Instagram', url: 'https://www.instagram.com/servicesplusin/', target: '_blank' },
          { title: 'YouTube', url: 'https://www.youtube.com/@servicesplus7003', target: '_blank' },
        ],
      },
    ],
  },
];

module.exports = { HEADER, FOOTER };
