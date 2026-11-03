'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Already created by 20260801000000-initial-schema.js on a new database
    const existing = (await queryInterface.showAllTables()).map((t) => (typeof t === 'string' ? t : t.tableName));
    if (existing.includes('seopages')) return;
    await queryInterface.createTable('seopages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      slug: {
        type: Sequelize.STRING
      },
      pageType: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      metaTitle: {
        type: Sequelize.STRING
      },
      metaDescription: {
        type: Sequelize.TEXT
      },
      canonicalUrl: {
        type: Sequelize.STRING
      },
      serviceId: {
        type: Sequelize.UUID
      },
      locationId: {
        type: Sequelize.UUID
      },
      industryId: {
        type: Sequelize.UUID
      },
      technologyId: {
        type: Sequelize.UUID
      },
      problemId: {
        type: Sequelize.UUID
      },
      status: {
        type: Sequelize.STRING
      },
      indexable: {
        type: Sequelize.BOOLEAN
      },
      priority: {
        type: Sequelize.INTEGER
      },
      publishedAt: {
        type: Sequelize.DATE
      },
      contentSource: {
        type: Sequelize.STRING
      },
      aiGenerationStatus: {
        type: Sequelize.STRING
      },
      qualityScore: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seopages');
  }
};