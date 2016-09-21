# ActiveCollab.js
Just a Node.js module that makes communication with [Active Collab API](https://developers.activecollab.com/api-documentation/) easy.

**NOTE** This module is still in development and the structure can be changed anytime. I do not recommend using this module in production.

## Installation

### Node
Run `npm install activecollab.js --save` to install and save the module.

### Browser
ActiveCollab.js doesn't support browsers yet. This will be added in the feature

## Example
```javascript
const ActiveCollab = require('activecollab.js');
const client = new ActiveCollab.Client('<NAME>', '<VENDOR>');

client.login('email', 'password')
    .then(() => {
        if (client.accounts.empty()) {
            throw 'There are no accounts in bounded to this user.';
        }

        return client.accounts.first().issueToken();
    })
    .then((account) => account.getProjects())
    .then((projects) => console.log(`I am in ${projects.size()} project(s)! The names are: ${projects.map((project) => project.name).join(', ')}`))
    .catch((e) => console.log('Failed to load the example: ', e));
```

## Links
- [npm](https://www.npmjs.com/package/activecollab.js) - ActiveCollab.js on npm.
- [GitHub](https://github.com/gerardsmit/activecollab.js) - ActiveCollab.js on GitHub.
- [activecollab/activecollab-feather-sdk](https://github.com/activecollab/activecollab-feather-sdk) - Offical PHP library of ActiveCollab.