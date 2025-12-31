import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Enable public API access for Project and Resume
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const permissions = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({ where: { role: publicRole.id } });

      const existingActions = permissions.map((p: any) => p.action);

      const requiredPermissions = [
        'api::project.project.find',
        'api::project.project.findOne',
        'api::resume.resume.find',
      ];

      for (const action of requiredPermissions) {
        if (!existingActions.includes(action)) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            },
          });
          strapi.log.info(`Enabled public permission: ${action}`);
        }
      }
    }
  },
};
