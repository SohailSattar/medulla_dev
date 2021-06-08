#MGTalent - Api 


##Prerequisite

MYSql
```mysql
CREATE USER root WITH PASSWORD 'password';
CREATE DATABASE mgtalent;
GRANT ALL PRIVILEGES ON DATABASE mgtalent to root;
```

## Commands

npm install

##To sync DB with new model changes :

npm run DBSync

## To insert seed data

npm run seed

** The above command will drop existing tables and then recreate all the tables with new schema changes

##To start the application
npm start

** application can be access at http://localhost:3000/

##use the below url to access the swagger docs

http://localhost:3000/api-docs

alter user 'root'@'localhost' identified with mysql_native_password by 'password'

