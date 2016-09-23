'use strict';

/*
 * In this example we remove all the projects with the name 'Example',
 * then we create a new project with the name 'Example' and create a new task in it.
 */

const ActiveCollab = require('../index');
const client = new ActiveCollab.Client('ActiveCollab.js', 'Gerard');

let account;

client.login(process.env.email, process.env.password)
    .then(() => {
        // Check if the user has any accounts.
        if (client.accounts.empty()) {
            throw 'There are no accounts in bounded to this user.';
        }

        // Get the first account and get the token.
        account = client.accounts.first();
        return account.issueToken();
    })
    .then(() => {
        // Get all the projects.
        return account.projects();
    })
    .then((projects) => {
        // Remove all the old Example projects.
        return projects
            .filter((project) => project.name === 'Example')
            .promise((project) => project.remove());
    })
    .then(() => {
        // Create a new Example project.
        return account.projects.create({
            name: 'Example'
        })
    })
    .then((project) => {
        // Add a new task in the project.
        return project.tasks.create({
            name: 'Example task'
        });
    })
    .then((task) => {
        // Add a subtask in teh task
        return task.subTasks.create({
            body: 'Example subtask'
        });
    })
    .then(() => console.log('Created project with task'))
    .catch((e) => console.log('Failed to create the project: ', e));