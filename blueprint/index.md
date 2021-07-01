---
title: Develop an Angular App which uses the Genesys Cloud Platform SDK
author: prince.merluza
indextype: blueprint
icon: blueprint
image: images/cover.png
category: 6
summary: |
  This Genesys Cloud Developer Blueprint demonstrates how to setup your Angular project to include the Genesys Cloud Javascript Platform SDK. It will show the steps needed for configuring the SDK with Webpack, and also demonstrate an app that provides some supervisor functionalities like searching and setting the status of users.
---

This Genesys Cloud Developer Blueprint demonstrates how to setup your Angular project to include the Genesys Cloud Javascript SDK. It will show the steps needed for configuring the SDK with Webpack, and also demonstrate an app that provides some supervisor functionalities like searching and setting the status of users.

:::primary
**Note**: If you have an existing Angular project and only want to know how to configure Genesys Cloud SDK in your app, click [here](#configuring-the-angular-project-to-use-genesys-cloud-sdk) to jump to the section.
:::

## Solution components

* **Genesys Cloud** - The Genesys cloud-based contact center platform. The Angular App will be authorizing with a Genesys Cloud user.
* **Angular 12 CLI** - The sample app was created using Angular 12 and the Angular CLI.

### Software Development Kit (SDK)

* **Genesys Cloud Platfrom API SDK** - The SDK is used for authorizing the user, and performing the API calls required in the execution of the app's features.

## Requirements

### Specialized knowledge

Implementing this solution requires experience in several areas or a willingness to learn:

* Administrator-level knowledge of Genesys Cloud and the Genesys AppFoundry
* Genesys Cloud Platform API knowledge
* Angular 12 knowledge

### Genesys Cloud account requirements

This solution requires a Genesys Cloud license. For more information on licensing, see [Genesys Cloud Pricing](https://www.genesys.com/pricing "Opens the pricing article").

A recommended Genesys Cloud role for the solutions engineer is Master Admin. For more information on Genesys Cloud roles and permissions, see the [Roles and permissions overview](https://help.mypurecloud.com/?p=24360 "Opens the Roles and permissions overview article").

TODO: Deployment Steps Maybe a GH Page

## Configuring the Angular Project to use Genesys Cloud SDK

One of the most asked questions regarding Angular is how to include the Genesys Cloud SDK in the build process. In this section, we'll look at the step-by-step process of configuring an Angular project and other helpful advice in working with the Genesys Cloud environment.

If you've jumped to this section, we're going to assume you already have all the prerequisites set-up including the Angular CLI installation, and a Genesys Cloud credentials for authorization.

### Creating an Angular Project

If you haven't done so already, create a new project with the CLI command:

```bash
ng new name-of-your-app
```

You can use an already existing project, though if you're using an earlier version of Angular than 12, there's no guarantee that the succeeding steps would work the same.

### Installing NPM Packages

1. Install the Genesys Cloud Platform Client:

    ```bash
    npm install purecloud-platform-client-v2
    ```

2. Install the custom-webpack library to allows customization of the build configuration:

    ```bash
    npm i @angular-builders/custom-webpack --save-dev
    ```

### Configuration of Files for Platform Client Usage

1. In the root of your project, create a file named `extra-webpack.config.js` (It can be named anything). Enter the following content in the file:

    ```javascript
    module.exports = {
      externals: {
        'purecloud-platform-client-v2': "require('platformClient')",
      },
    }
    ```

2. After creating the custom webpack file, we need to configure it for the different builder targets. Open the `angular.json` file found in the root of the project.
  We're going to modify the builder targets under the `architect` property:

    1. `build` property

        1. Change the builder property to: `@angular-builders/custom-webpack:browser`

        2. Under the options property, add a new `customWebpackConfig` object. Refer to the code block below for complete values.

        3. In the `scripts` property add `node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js`

        The modified `build` property should look something like this:

         ```json
          "build": {
            "builder": "@angular-builders/custom-webpack:browser",
            "options": {
              ...,
              "customWebpackConfig": {
                "path": "./extra-webpack.config.js",
                "mergeRules": { "externals": "prepend" }
              },
              "scripts": [..., "node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js"]
            }
          }
            
        ```

    2. The `serve` target will use the `options` configuration from `build` so we'll ony have to update the `builder` property:

        ```json
        "serve": {
          "builder": "@angular-builders/custom-webpack:dev-server",
          ...
        }
        ```

    3. `test` property

        1. Change the builder property to: `@angular-builders/custom-webpack:karma` (If you're using Karma for Angular testing)

        2. Under the options property, add a new `customWebpackConfig` object. Refer to the code block below for complete values.

        3. In the `scripts` property add `node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js`

        The modified `build` property should look something like this:

         ```json
          "build": {
            "builder": "@angular-builders/custom-webpack:karma",
            "options": {
              ...,
              "customWebpackConfig": {
                "path": "./extra-webpack.config.js",
                "mergeRules": { "externals": "prepend" }
              },
              "scripts": [..., "node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js"]
            }
          }
            
        ```

3. Finally, in your `tsconfig.json`, we need to disable `noImplicitAny` in the `compilerOptions`:

    ```json
    {
      ...
      "compilerOptions": {
        ...
        "noImplicitAny": false,
      },
    }
    ```

    If we don't add this property, some files in the Platform SDK package will cause the Angular build to fail.

### Import the platform-client-sdk to your Project

After following the step-by-step instructions, you should now be able to import and use the Platform Client in your code.

Example: 

```javascript
import { Component, OnInit } from '@angular/core';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sample-app';
  ngOnInit() {
    console.log(platformClient);
  }
}
```

## Overview of the Sample App's Features


### Genesys Cloud Service

The `genesys-cloud` service contains all Genesys Cloud related functionality. All of the API methods returns a Promise, but if we want to work with Observables instead, we can easily convert them using the `from` operator.

Example:

```typescript
  getUserDetails(id: string): Observable<platformClient.Models.User> {
    return from(this.usersApi.getUser(id, { 
        expand: ['routingStatus', 'presence'],
      }));
  }
```

### User Details

The home page display information about the sample app and details about the current user. There's also a presence-picker component which allows the user to change their presence or routing status.

### User Search

The User Sarch page is where you can search for users within your org. You can change their presence or go to their User Page which simple contains some basic information about the user including .

### Queues List

The Queues List is a searh page where you can see Observation Query details of each queue. You can also log out all of the agents on a particular queue. This is helpful if some agents are not able to log out of their stations after their shift is supposed to be done.

## Additional Resources

