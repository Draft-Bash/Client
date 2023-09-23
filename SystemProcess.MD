# System Process & Configuration of Product Organization, Hosting, & Deployment

### Development System process, & Feature Lifecycle
- Draftbash utilizes two separate repositores: Server (back-end) and Client (front-end)
- All features should programmed in a feature branch.
- Once the feature is completed and tested in the developer's local environment, a pull request will be made to the test branch where other developers can review the changes. 
- The rest of the team can now review the code and discuss the results of the tests on the localhost, and decide whether or not these changes should be merged with the test branch
- If the pull request is merged into the test branch, the changes will automatically be deployed to the testing environment where test users and developers can see the feature. If the test branch is for the server, the updated test branch will automatically be deployed to the test server (https://draftbash-test.azurewebsites.net). If the test branch is from the frontend's repository, it will be deployed to https://draftbash-testing.web.app.

### Hosting & Deployment
- The Draft Bash production front-end application is hosted on Firebase, and can be accessed through the draftbashfantasy.com URL.
- The Draft Bash production server and testing server are hosted on Azure.
- Accepted merge requests to the test and main branches will automatically be pushed to the respective applications through Github actions, which is used to utilize Draft Bash's CI/CD pipeline for automatic and fast deployment to the environments
