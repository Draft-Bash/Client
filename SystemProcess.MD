# System Process & Configuration of Product Organization, Hosting, & Deployment

### Development System process, & Feature Lifecycle
- Draftbash utilizes two separate repositores: Server (back-end) and Client (front-end)
- All code should be written in the developer's individual branch for either repository. Ex: dev "Brian" will write his code in the "brian" branch, where he will also test it locally.
- Once code is thoroughly tested and believed to function as expected through the "brian" branch and testing on the localhost, dev Brian will create a pull request to the test branch
- The rest of the team can now review dev Brian's code and discuss the results of his tests on the localhost, and decide whether or not these changes should be merged with the test branch
- If code is determined to be good, the pull request will be accepted and the changes are now implemented in the test branch, which is then automatically pushed to the test application for both developer and customer testing. More can be found on testing in the [UserProcess](UserProcess.md) file.

### Hosting & Deployment
- The Draft Bash production front-end application is hosted on Firebase, and can be accessed through the draftbashfantasy.com URL.
- The Draft Bash production server, testing server, and testing front-end are all hosted utilizing Azure.
- Accepted merge requests to the test and main branches will automatically be pushed to the respective applications through Github actions, which is used to utilize Draft Bash's CI/CD pipeline for automatic and fast deployment to the environments
