# DLA FAIR Chronobiology

A React app for authoring JSON documents that conform to the [Chronobiology Data Standards](https://github.com/cdsig/CDSIG-Schema). We're using the [React JSON Schema Forms library](https://github.com/rjsf-team/react-jsonschema-form) to dynamically generate forms based on the schema files. The app was bootstrapped with [Create React App](https://create-react-app.dev/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/fceaa58e-7e67-43cc-9414-51b611c12820/deploy-status)](https://app.netlify.com/sites/vigorous-mccarthy-c8a76a/deploys)

## Development

We're using [asdf](https://asdf-vm.com) to manage project dependencies.

1. Install [asdf](https://asdf-vm.com/guide/getting-started.html)

2. Install the [asdf-nodejs plugin](https://github.com/asdf-vm/asdf-nodejs/).

3. Install node with `asdf install`.

4. Install dependencies with `npm install`.

5. Start the server with `npm start`.

### Tests

Run the tests with `npm test`.

### Making changes to schema files

The schema files live in the [CDSIG-Schema repo](https://github.com/cdsig/CDSIG-Schema). Use the following workflow to test changes to those schema files in this web authoring tool:

1. Create a branch in the CDSIG-Schema repository, make your changes and push them to GitHub. Note that you might need to update any external `$ref` URLs so that they point to the schema files in your new branch.

2. Create a branch in this repository.

3. Run the `./scripts/update-schema` script and pass your CDSIG-Schema branch name as an argument (e.g. `./scripts/update-schema my-schema-branch-name`).

4. Check the schema changes work as expected in the development server at http://localhost:3000.

5. Once you're happy that everything is working as expected you can merge the changes in both repositories into main.

### Project structure

- .github/ - Configuration for running tests on GitHub and deploying to Netlify.
- public/ - Static files made available to the web application.
- scripts/ - Shell scripts for working with schema files. See comments in each file for their purpose.
- src/schema/original/ - Copies of schema files from [CDSIG-Schema repo](https://github.com/cdsig/CDSIG-Schema). These should only be changed by running the `update-schema` script.
- src/schema/ - The schema files we use in our React app. They are dereferenced and prettified versions of the schema files in src/schema/original. These should only be changed by running the `update-schema` script.
- src/ - Source of the React web app.

## CI and deployment

We're using GitHub Actions to run the tests and deploy to Netlify if they all pass. This is configured in `.github/workflows/main.yml`.
