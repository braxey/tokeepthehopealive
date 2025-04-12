# To Keep The Hope Alive
This project is for my sister to share the testimonies of others. TKTHA began with Laravel's React Starter Kit.

## Overview
This project allows users to view and interact with testimonies:
* Read access to posts and comments is unrestricted.
* Authenticated users may vote on posts and comments.
* Authenticated users with verified emails may comment.
* Users with permission may post (db driven).

## Dependencies
* PHP 8.4
* Composer
* Node.js
* Laravel 12
* SQLite

## Local Setup
1. Clone the repo: `git clone <repo-url>`
2. Copy `.env.example` to `.env`
3. Configure a mailer in `.env`
4. Create symlink: `php artisan storage:link`
5. Install: `composer install && npm install`
6. Build JS: `npm run build`
7. Generate app key and migrate DB: `composer post-create-project-cmd`
8. Run: `composer dev`
9. Visit `localhost:8000`

Notes:
* This app requires users to verify their email to access some functionalities, so a mailer will need to be setup in `.env`

## Environment Differences
* **Database:** Locally, `sqlite` is used while `MySQL` is used when the app is deployed.
* **Storage:** Locally, the `public` disk is used (the reason for setup step 3) while `s3` is used when the app is deployed.
  * Only the CloudFlare proxies can read the bucket images.
  * CF aggressively caches images since all uploaded images have a unique UUIDV4 -- reducing requests to s3.

## Project Status
This is a view-source project, not open source. The code is available for viewing, but usage, modification, or distribution is restricted.
