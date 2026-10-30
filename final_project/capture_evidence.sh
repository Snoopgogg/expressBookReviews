#!/usr/bin/env bash
# Run from final_project/ after starting the API with npm start.
# Each output file contains the cURL command and the actual HTTP response.
set -euo pipefail
BASE_URL="${BOOKS_API_URL:-http://localhost:5000}"
OUT_DIR="${EVIDENCE_DIR:-.}"
mkdir -p "$OUT_DIR"
capture() {
  local file="$1"; shift
  {
    printf '$'; printf ' %q' "$@"; printf '\n\n'
    "$@"
    printf '\n'
  } > "$OUT_DIR/$file"
}

# Q1: Verify that this repository is forked from the IBM starter.
{
  echo '$ curl -s https://api.github.com/repos/Snoopgogg/expressBookReviews'
  echo
  curl -s https://api.github.com/repos/Snoopgogg/expressBookReviews
  echo
} > "$OUT_DIR/githubrepo"

capture getallbooks curl -sS -i "$BASE_URL/"
capture getbooksbyISBN curl -sS -i "$BASE_URL/isbn/1"
capture getbooksbyauthor curl -sS -i "$BASE_URL/author/Chinua%20Achebe"
capture getbooksbytitle curl -sS -i "$BASE_URL/title/Things%20Fall%20Apart"
capture getbookreview curl -sS -i "$BASE_URL/review/1"

USERNAME="reader_$(date +%s)"
PASSWORD="Pass1234"
REGISTER_BODY="{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}"
{
  echo '$ curl -sS -i -X POST -H "Content-Type: application/json" -d \'{"username":"<USERNAME>","password":"Pass1234"}\' '"$BASE_URL"'/register'
  echo
  curl -sS -i -X POST "$BASE_URL/register" -H 'Content-Type: application/json' -d "$REGISTER_BODY"
  echo
} > "$OUT_DIR/register"

LOGIN_RESPONSE=$(curl -sS -X POST "$BASE_URL/customer/login" -H 'Content-Type: application/json' -d "$REGISTER_BODY")
TOKEN=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).token||"")}catch(e){process.exit(1)}})' <<< "$LOGIN_RESPONSE")
if [[ -z "$TOKEN" ]]; then echo "Login failed: $LOGIN_RESPONSE" >&2; exit 1; fi
{
  echo '$ curl -sS -i -X POST -H "Content-Type: application/json" -d \'{"username":"<USERNAME>","password":"Pass1234"}\' '"$BASE_URL"'/customer/login'
  echo
  curl -sS -i -X POST "$BASE_URL/customer/login" -H 'Content-Type: application/json' -d "$REGISTER_BODY"
  echo
} > "$OUT_DIR/login"

{
  echo '$ curl -sS -i -X PUT -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d \'{"review":"Excellent book."}\' '"$BASE_URL"'/customer/auth/review/1'
  echo
  curl -sS -i -X PUT "$BASE_URL/customer/auth/review/1" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"review":"Excellent book."}'
  echo
} > "$OUT_DIR/reviewadded"

{
  echo '$ curl -sS -i -X DELETE -H "Authorization: Bearer <TOKEN>" '"$BASE_URL"'/customer/auth/review/1'
  echo
  curl -sS -i -X DELETE "$BASE_URL/customer/auth/review/1" -H "Authorization: Bearer $TOKEN"
  echo
} > "$OUT_DIR/deletereview"

echo "Created: githubrepo getallbooks getbooksbyISBN getbooksbyauthor getbooksbytitle getbookreview register login reviewadded deletereview"
