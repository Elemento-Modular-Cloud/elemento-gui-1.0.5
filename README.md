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

- [x]   POST /create
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

________________________

- missing netdevs from register new vm payload
- allow SMT for advanced mode


# Errors
