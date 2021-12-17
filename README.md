# DLA FAIR Chronobiology

A React app for authoring JSON documents that conform to the [Chronobiology Data Standards](https://github.com/cdsig/CDSIG-Schema). We're using the [React JSON Schema Forms library](https://github.com/rjsf-team/react-jsonschema-form) to dynamically generate forms based on the schema files.

[![Netlify Status](https://api.netlify.com/api/v1/badges/fceaa58e-7e67-43cc-9414-51b611c12820/deploy-status)](https://app.netlify.com/sites/vigorous-mccarthy-c8a76a/deploys)

## Development

We're using [asdf](https://asdf-vm.com) to manage project dependencies.

1. Install [asdf](https://asdf-vm.com/guide/getting-started.html)

2. Install the [asdf-nodejs plugin](https://github.com/asdf-vm/asdf-nodejs/).

3. Install node with `asdf install`.

4. Install dependencies with `npm install`.

5. Start the server with `npm start`.

## Tests

Run the tests with `npm test`.

## Update schema from [CDSIG-Schema repo](https://github.com/cdsig/CDSIG-Schema)

Run `./script/update-schema` and commit the changes.

## CI and deployment

We're using GitHub Actions to run the tests and deploy to Netlify if they all pass. This is configured in `.github/workflows/main.yml`.
