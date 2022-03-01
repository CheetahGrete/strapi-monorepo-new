"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called after an entry is created
    async afterCreate(result) {
      await strapi.plugins["email"].services.email.send({
        to: "isabell@beammeup.today",
        subject: "New entry in the lead-form-submissions in Beammeup",
        text: "New entry in the lead-form-submissions in Beammeup",
        html: `<h1>New entry in the lead-form-submissions in Beammeup</h1>       <p>${result}</p>`,
      });
    },
  },
};
