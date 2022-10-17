
![Directus Mailer](/assets/banner.png)

# Directus Mailer 💬
An endpoint for sending emails with the Directus Nodemailer service. 

## Installation
- Download or fork the repository
- Install the requirements\
  `npm install`
- Build the extension\
  `npm run build`
- Create a folder in your directus endpoints folder named `Mailer` or an alternate route name.
- Move the `index.js` build file to your new folder  `directus/extensions/endpoints/Mailer/index.js`
- Configure your email client in your .env file  [@email config](https://docs.directus.io/configuration/config-options/#email).
- Start your Directus instance `npx directus start`

## Authentication
Requests made by unauthenticated users will be rejected. Requests must be made with a cookie or bearer token unless guest sending is active.


## Sending Notifications
An example `POST` request made to `https://directusAppDomain/Mailer{or custom path}/`
In this example we are sending a test message to two recipients. 
```JSON
{
  "subject": "How cool is Directus?",
  "to": ["email@gmail.com", "email@hotmail.com"],
  "template": {
    "name": "default-template",
  }
}
```
### Liquid Templating 💧
You can build custom email templates with Liquid.js and add them to your `extensions/templates` folder to reference them as templates in your `POST` request. [@email templating](https://docs.directus.io/extensions/email-templates/#_1-create-a-template-file)

If you're unfamiliar with Liquid, data can be referenced in a template with this interpolation`{{title}}` [@data variables](https://liquidjs.com/tutorials/intro-to-liquid.html)
```JSON
{
  "from": "hello@ryntab.com",
  "to": "*********@gmail.com",
  "subject": "This email was made with Handlebars",
	"template" : {
              "name": "alert",
	      "data" : {
		      "title": "Im a title!",
		      "subtitle": "Im a subtitle!",
		      "body": "Im the body!"
	      }
        }
}
```
### Attachments 📦
To add attachments in your email notification, include an array of attachment objects. [@attachments](https://nodemailer.com/message/attachments/)
```JSON
{
  "subject": "How cool is Directus?",
  "to": "email@gmail.com",
  "template": {
    "name": "default-template",
    "attachments": [
        {
            "name": "image.png",
            "path": "./public/images/image.png"
        },
         {
            "name": "image_2.png",
            "path": "./public/images/image_2.png"
        }
    ]
  }
}
```

### Directus File Attachments
You can also include Directus files as attachments with an array of reference IDs. If the current user has permissions to view the file, then it will be attached to the email notification.
> Note: Reference IDs that do not exist or do not meet the access requirements will be ignored.

```JSON
{
  "subject": "How cool is Directus?",
  "to": "email@gmail.com",
  "template": {
    "name": "default-template",
    "files":  [
	    "c17d967b-b257-414d-ab92-41ae6d0784ed",
		"b507c26f-1333-4a8a-b8df-9731be74542e"
	]
  }
}
```
You can include both attachments and Directus files in your email notification.
```JSON
{
  "subject": "How cool is Directus?",
  "to": "email@gmail.com",
  "template": {
    "name": "default-template",
    "files":  [
	"c17d967b-b257-414d-ab92-41ae6d0784ed",
	"b507c26f-1333-4a8a-b8df-9731be74542e"
     ],
    "attachments": [
       {
        "filename": "text1.txt",
        "content": "hello world!"
       }
    ]
  }
}
```

## Environment Variables
```
EMAIL_ALLOW_GUEST_SEND=false
```

> Guest sending is intended for more convenient debugging with API clients, you should always set this to false when not debugging. 🚨
