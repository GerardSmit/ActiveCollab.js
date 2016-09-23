'use strict';

/*
 * In this example we remove the 'WIP: ' from the name of all the projects.
 */

const ActiveCollab = require('../index');
const client = new ActiveCollab.Client('ActiveCollab.js', 'Gerard');

client.login(process.env.email, process.env.password)
    .then(() => {
        // Check if the user has any accounts.
        if (client.accounts.empty()) {
            throw 'There are no accounts in bounded to this user.';
        }

        // Get the first account and get the token.
        return client.accounts.first().issueToken();
    })
    .then((account) => {
        // Get all the projects.
        return account.projects();
    })
    .then((projects) => {
        // Remove all the 'WIP: ' in the names of the projects.
        return projects
            .filter((project) => project.name.startsWith('WIP: '))          // First get all the projects starting with 'WIP: '
            .forEach((project) => project.name = project.name.substr(5))    // Then set the name without 'WIP: '
            .promise((project) => project.save());                          // Save all the projects.
    })
    .then(() => console.log('Renamed all the projects'))
    .catch((e) => console.log('Failed to rename the projects: ', e));