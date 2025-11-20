# MXAdmin

## Vision

1. First page presented is a "login" form giving you 3 inputs.
    - URL to the Directadmin interface/API
    - Username to login with
    - Password to use to login
2. Once the user has entered all of the information and clicked `Submit`, we do
   a query to the Directadmin API and check for a success response code.
   - If a success response code is returned, the page transitions to the main
     page where all of the main functions of the app are.
   - If an error response code is returned, notify the user and have them try
     again.
3. Main page consists of a carousel, with a page for each domain returned from
   the API, containing information about the domain (mainly already made
   aliased) gathered from the Directadmin API with a quick shortcut to add a new
   alias to the currently selected domain.
4. Removing domains should also be added in case a user makes a mistake. I
   wouldn't want to have to go to the site to undo it so they shouldn't have
   to either.


## Development Information

### Resources

- [Directadmin Legacy API Docs](https://docs.directadmin.com/developer/api/legacy-api.html#user-apis)
- Uses
[`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/) to
store Directadmin API keys
