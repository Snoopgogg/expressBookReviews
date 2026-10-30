# IBM Express Book Reviews – Final Project

**Fork:** https://github.com/Snoopgogg/expressBookReviews  
**Original:** https://github.com/ibm-developer-skills-network/expressBookReviews

## Run
```bash
cd final_project
npm install
npm start
```
The API runs at http://localhost:5000.

## API endpoints
| Task | Method | Endpoint |
|---|---|---|
| All books | GET | `/` |
| ISBN lookup | GET | `/isbn/:isbn` |
| Author lookup | GET | `/author/:author` |
| Title lookup | GET | `/title/:title` |
| Reviews | GET | `/review/:isbn` |
| Register | POST | `/register` |
| Login | POST | `/customer/login` |
| Add/update review | PUT | `/customer/auth/review/:isbn` |
| Delete own review | DELETE | `/customer/auth/review/:isbn` |

Review mutation routes require `Authorization: Bearer <JWT>`.

## cURL evidence
Start the server, open a second terminal in `final_project/`, and run:
```bash
./capture_evidence.sh
```
This produces the assignment evidence files: `githubrepo`, `getallbooks`, `getbooksbyISBN`, `getbooksbyauthor`, `getbooksbytitle`, `getbookreview`, `register`, `login`, `reviewadded`, and `deletereview`. The script captures real command output from the running server; it does not fabricate API responses.

## Q11: Axios client
`final_project/general.js` exports `getAllBooks` (callback), `getBookByISBN` (Promise), `getBooksByAuthor` (async/await), and `getBooksByTitle` (async/await). Run `npm run client` while the server is active.

The sample stores users and reviews in memory for the learning exercise. Use password hashing, persistent storage, and a managed secret in production.
