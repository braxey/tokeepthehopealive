# To Keep The Hope Alive
[tokeepthehopealive.com](tokeepthehopealive.com) is for my sister to share the testimonies of others. TKTHA began with Laravel's React Starter Kit.

## Overview
TKTHA allows users to view and interact with testimonies:
* Read access to posts and comments is unrestricted.
* Authenticated users may vote on posts and comments.
* Authenticated users with verified emails may comment.
* Users with permission may post.
  * See `/app/Enums/Permission.php` for the correct `users.permission` value.

## Dependencies
* PHP 8.4
* Composer
* Node.js
* Laravel 12
* SQLite

## Local Setup
1. Clone the repo: `git clone <repo-url>`
2. Setup: `composer setup`
   * Copies `.env.example` to `.env`
   * Installs composer and npm dependencies
   * Builds JS
   * Creates symlink from `/public/storage` to `/storage/app/public`
   * Generates app key
   * Creates SQLite file
   * Migrates DB
3. Configure a mailer in `.env`
   * If this is not done, sent email contents will be logged to `/storage/logs/laravel.log`
4. Run: `composer dev`
5. Visit `localhost:8000`

## Environment Differences
* **Database:** Locally, `sqlite` is used while `MySQL` is used when the app is deployed.
* **Storage:** Locally, the `public` disk is used (the reason for the symlink in setup step 2) while `s3` is used when the app is deployed.
  * Only the Cloudflare proxies can read the bucket images.
  * CF aggressively caches images since all uploaded images have a unique UUID v4 -- reducing requests to s3.
