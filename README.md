# elemento-gui-v2
Elemento GUI



# API endpoints

Authenticator client    ```/api/v1/authenticate```

---

- [x]   POST /login
- [x]   POST /logout
- [x]   POST /license/list
- [x]   POST /license/arm
- [x]   POST /license/delete
- [x]   POST /account/register

Matcher client           ```/api/v1.0/client/vm```

---

- [x]   POST /canallocate
- [x]   POST /register
- [x]   POST /unregister
- [x]   POST /status
- [x]   POST /templates

Storage client          ```/api/v1.0/client/volume```

---

- [x]   GET  /accessibile
- [ ]   POST /info
- [x]   POST /cancreate
- [x]   POST /create
- [x]   POST /destroy

Network client          ```/api/v1.0/client/network```

---

- [ ]   POST /create
- [ ]   POST /delete
- [ ]   POST /info
- [x]   POST /list


# Screens

- [ ]   Login
- [ ]   Register
- [ ]   Home page
- [ ]   Intro and tutorial
- [ ]   User data with logout
- [ ]   Create storage
- [ ]   Create VM Basic
- [ ]   Create VM Advanced
- [ ]   Create network
- [ ]   Manage storage
- [ ]   Manage VM
- [ ]   Manage Network
- [ ]   Sysadmin stack
- [ ]   Sysadmin templates
- [ ]   Mechanic engines
- [ ]   Mechanic vaults

### Note

- it will be safer to authenticate the user through the login process sending the password encrypted with a simple hash function to prevent man-in-the-middle attach;
this is very important if we plan to put this web app on a remote web server and let users access it through internet

- file:///<...>/build/html/eac.html#licensing cambiare da POST a GET
doc refers to POST but it's actually a GET request

- creatorID does not respect underscore notation same as other properties

- Access to XMLHttpRequest at 'http://172.31.24.227:37777/api/v1.0/client/network/' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.

GET http://172.31.24.227:37777/api/v1.0/client/network/ net::ERR_FAILED

- POST http://172.31.24.227:37777/api/v1.0/client/network/list 500 (INTERNAL SERVER ERROR)

- what are the default size amount for storage allocation?

- missing parameters from documentation about this endpoint: /api/v1.0/client/volume/create
there are some missing params: name, private, sharable, etc as per the "old" Elemento web app

________________________

- /api/v1.0/client/vm/status GET not POST
- missing info: {
    vm_name: name
  },
  from register new vm doc
- missing netdevs from register new vm payload


# Errors
