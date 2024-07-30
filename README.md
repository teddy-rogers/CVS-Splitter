# TechOps Fullstack Technical Test 2024

## Objective

The purpose of this test is to evaluate skills in React interface development and Node.js API, as well as the ability to efficiently handle a CSV file. The candidate must create a user interface for uploading a CSV file, send it to a Node.js API that processes the file, and then return the zipped result to the client.

## Back-End Section (Node.js)

- For the need of the test no environment variable is required
  (please note that is a very bad practice for real projects).
- Please run `npm i`
- To start the client app go to **./server** and run `npm run start`.

## Front-End Section (React)

- For the need of the test no environment variable is required
  (please note that is a very bad practice for real projects).
- Please run `npm i`
- To start the client app go to **./client** and run `npm run start` (please make sure the server app is running)
- To test the feature, pass a CSV file to the input et press `upload`. A progress bar should be displayed. The process may take time depending on the file size.
- To Test an error, shut down the server app and upload a CSV file again.

## Dependancies

### Front-end

- [React](https://create-react-app.dev)
- [Typescript](https://www.typescriptlang.org)
- no additional dependencies have been needed

### Back-end

- [ExpressJs](https://expressjs.com) | eval: <https://socket.dev/npm/package/express>
- [Typescript](https://www.typescriptlang.org)
- [Multer](https://github.com/expressjs/multer/blob/master/README.md) | eval: <https://socket.dev/search?e=&q=multer>
- [Cors](https://github.com/expressjs/cors#readme) | eval: <https://socket.dev/npm/package/cors>
- [CSV](https://csv.js.org) | eval: <https://socket.dev/npm/package/csv>
- [Compressing](https://github.com/node-modules/compressing/blob/master/README.md) | eval: <https://socket.dev/npm/package/compressing>

##

**Thanks!**
