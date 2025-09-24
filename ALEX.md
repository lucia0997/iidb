All the pending tasks are marked with a to do

# backend

## authentication

- authentication backend:
  Replaces the DRF authentication method to a custom function that uses the ldap_service
- ldap service:
  Custom functions for the ldap user creation and authentication for the AIRBUS directory
- endpoints:
  - login: custom login endpoint that extends the ldap login
  - me: custom user info endpoint
  - refresh: DRF jwt tokens endpoint
- user create serializer
  Custom serializer for the user creation (user app) that adds the ldap user validaton and group permissions management

## authorization

- groups definition:
  Unified group-permissions trazability definition page. The available permissions are the CRUD permissions and the custom model-defined permissions.
- permissions model
  Custom model that extends the DRF permission model and enables any model to define view access permissions in a standarized way (see user view).
  - CRUD permisions enabler
  - custom has_permissions method
- group endpoints (user app):
  Group view.
- create_rbac command:
  Custom command to set into the app the groups defined in the groups file and the permissions trazability.

## users

- custom user model
- custom user filter
- user endpoint:
  Contains different Serializers for each CRUD action.

## core

- exception handler:
  Custom handler that redirects all DRF and custom errors to a standarized and formatted protocol.
- exceptions:
  Custom exception class.
- exception catalog:
  Custom exception portfolio definition.
- exception contract:
  Custom api middleware that encapsulates all the errors.
- exception utils
- Action config mixin:
  A custom view mixin that allows to define a serializer for each CRUD action in a view (see user view)
- Añadir pagination, tools, etc.

## configuration

- diferent enviroment configurations (local, dev and production)
- custom configurations (to be tested)

# frontend

- app
  Calls all the providers and launches the App routes
- config (to do)
  Define the enviroment variables

## router

- app routes
  Defines all global app pages
- route config
  Defines in a standarized way all the app pages and tabs tree:
  - Page: tab and linkable page
  - Route: linkable page
  - Route group: link tree constructor
  - Tab group: tab tree constructor

## pages (to do)

- login page:
  - Constructs the ui login page
  - Defines the login form
  - navigates to the next page
- admin page (to do)
- user page (to do)

## components

- app layout:
  Constructs the app layout calling the library header
- to do (user form, user tables, admin panel, ...)

# frontend library

- project setup that enables to generate library tarballs and a library version system.

## ux

### pages

- home screen
- loading screen
- 404
- 403

### forms

### tables

### ...

## utils

### authentication

- auth provider:
  - enables the auth context for all the app
  - excecutes the token refresh
  - sets a timer for refreshing the tokens before it gets a 401
  - performs the bootstrap (fetches the user data and provides it to all the app)
  - defines the login, logout and hasPermission methods for all the app
- auth context
- use auth:
  Hook for enabling the auth context
- auth service:
  Manages the authorization communication with the backend via the api client provider
- token service:
  Manages the auth token storage and accesability
- jwt:
  Tools that enables extract information for the tokens

### authorization

- protected route:
  Component that encapsulates a react page that is rendered depending on the page permissions.
- protected content:
  Component that encapsulates a react block that is rendered depending on the page permissions.

### api

- api client provider:
  Enables the api client context for all the app
- api client context
- use api client:
  Hook for enabling the api client context
- axios http client:
  - Custom http client class that extends the axios client
  - provides CRUD actions
  - enables methods to attach http interceptors
- interceptors:
  - attach auth interceptors:
    - request interceptor that adds the access token to the header of the request.
    - response interceptor that redirects a 401 to the token refresh method.
  - attach error interceptors (to do):
    - response interceptor that extracts the error and redirects them to the error provider.

### routes

- app router:
  - creates a react router dom route for all the user defined routes
  - enables to access the pages depending on the permissions
- app header:
  - creates a airbus react components styled header
  - app information
  - tab renderization with links to the pages for all the user defined tabs
  - enables to render the tabs depending on the permissions
  - provides a user avatar with a user page link
  - provides a user notification badge with a custom action
  - provides a custom text add-on with a custom action
- router tools:
  Utils for the router and header functioning
- header components:
  SubComponents used int the app header rendering.

### errors

(to do, started in the template/frontend/src/temp, move to the library when finished and functional)

- error provider
  - Enables the error context
  - Renders the error popups, notification popups, modals...
  - Routes the callback actions of the corresponding provider components
  - Renders standard errors
- error context
- use error:
  Hook for enabling the error context
- ...

### core (to do)

- pagination
- ...

## usage

- bitbucket:
  link to repo
- install a package:
  All the instalation is currently suported via tarballs compiled directly in the repo.
  This files are located in the builds folder. Here there are all the historical versions of the packages, with a log file with information of all of this versions.
- new package version:
  - Test the code in a project, and its integration with the library.
  - Clone the library repo, and npm run clean.
  - Define a new library version X.Y.Z (packages/&lib/package.json):
    - X: version id, changes that impact all functionalities or huge changes
    - Y: new functionalities, component packages, ...
    - Z: minor changes, bug fixes
  - Add the code, mantaining the library format (see format)
  - Pack the library: npm run complete-pack:
    - sanity clean: ensure older changes are removed
    - build: compile the library in three formats (typing, cjs and esm)
    - pack: store a compressed library in a tarball
  - Upload it to the public branch

## format

- folder structure: root library path = packages/&lib/src

Inside a project, all the functionalities are divided into groups.
In the utils library there is another subdivision react - core inside the group folder, that divides the global ts codes to the react depending ones. Inside them there must be two files:

- types.ts, which contains all the common type definitions (everithing excepts the component interfaces)
- index.ts, with exports all the elements, classes, components and types in the group.

All the React components must be located in a folder with the same component name. All the type definitions (interface) must be defined in another folder with the component name .types.ts. Finally the index.ts files with all the exports.

# pending

- assert all original template funcitonalities are present and preserved
- test the full setup with the ldap credentials
- test the user permissions (groups) system
- test the backend configuration and enviroment variables
- develop and test the frontend errors management:
  - develop the forntend errors functionalities
  - move them to the library
  - test the implementation
  - implement the error handling in the login page
- add ui components to the library:
  - tables: ui table library with a AIRBUS style
  - ...
- finish the template ui functionality:
  - user page:
    - user props view
    - logout
  - admin page:
    - users panel
    - new user
  - home page?
  - example page?
- add testing tools in the backend (and frontend?)
- upload the documentation into confluence and readme's
- deploy a project based on the template and extract all the usefull configurations to the template
- when everithing works and it is functional, launch the 1.0.0 ux and utils libraries
