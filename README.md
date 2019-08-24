# Backend node.js insurance assessment
This is the Node.js API for an insurance application that has users and policies with unique permissions.

Users will be asked to login as a specific user using the email address saved in the first API endpoint. If the user is not found, he'll be able to try again until the user is logged in. Once logged, an access JWT token will be provided to have access to all the other endpoints depending on that specific user's restrictions. For instance, an "users" type of role won't be able to get the user linked to a policy number. 

# Goal
Create a Web API that exposes the following services with their inherent restrictions:
• Get user data filtered by user id -> Can be accessed by users with role "users" and "admin"
• Get user data filtered by user name -> Can be accessed by users with role "users" and "admin"
• Get the list of policies linked to a user name -> Can be accessed by users with role "admin"
• Get the user linked to a policy number -> Can be accessed by users with role "admin"
