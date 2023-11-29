
# YelpCamp

A Node.js web application project from the Udemy course - The Web Developer Bootcamp by Colt Steele. It is a web application designed to add, rate and review different campgrounds, different users(read campers) can put in their comments and concerns, so that it is a well informed and well prepared camping trip for other users.
## Features

* Authentication:
  - User login with username and password

* Authorization
  - One cannot manage posts and view user profile without being authenticated
  - One cannot edit or delete posts and comments created by other users

* Manage campground posts with basic functionalities:

  - Create, edit and delete posts and comments

  - Upload campground photos

  - Display campground location on MapBox

  - Search existing campgrounds

* Manage user account with basic functionalities

  - Flash messages responding to users' interaction with the app

  - Responsive web design

  - Update campground photos when editing campgrounds


## API Reference

#### list all campgrounds

```bash
  GET /campgrounds
```
#### Create a campground

```bash
  POST /campgrounds/new
```
#### Edit a campground

```bash
  get /campgrounds/:id/edit
```
 | Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of campground to edit |

 **must** be logged in and author to edit 

 #### Delete a campground
 ```bash
  Delete /campgrounds/:id
```
 | Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of campground to delete |

 **must** be logged in and author to delete 

 #### Add a review to specific campground
 ```bash
  POST /campgrounds/:id/reviews
```
 | Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of campground |

**must** be logged in to review

 #### Delete a review from specific campground
 ```bash
  Delete /campgrounds/:id/reviews/:reviewId
```
 | Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of campground |
| `reviewId`      | `string` | **Required**. Id of review to delete |
**must** be logged in & review owner to delete it
