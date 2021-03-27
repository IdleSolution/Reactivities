
# Reactivities


## Table of contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
A website I made for learning purposes. I followed a course to finish this project. On the backend, it uses ASP.NET Core with Entity Framework and the code is written in Mediator pattern. On the frontend it uses React with Typescript. Users of this app can register/login (I used JWT authentication for it), add/attend activities, comment activities in real-time (SignalR) and follow other users. They can also add and crop their own photos.

## Screenshots
<img src="https://i.postimg.cc/Y2QkTMJq/1.png"/>
<img src="https://i.postimg.cc/tg1Gkj3b/3.png"/>
<img src="https://i.postimg.cc/VLRwL4fx/2.png"/>

## Technologies
* React with Typescript
* MobX
* ASP.NET Core
* Entity Framework
* SQL Server

## Setup

After installing all necessary packages from frontend and backend, the website can be run in 2 ways:
* Run server only
The backend is setup in a way that allows to only run server and then the server will serve all React components as static files. First, you will need to:<br/>

        cd client && npm run build
This will create neccessary files in the API folder. Then you can just:<br/>
     dotnet run
And the app will work!
* Run both server and client
This is the standard way that doesn't require building the app:

        cd client && npm run start && cd API && dotnet run
     
     
     
