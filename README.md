# rs-ttk

Oldschool Runescape Combat Simulator

## Use

The live website and demo example can be found at 
https://rs-ttk.herokuapp.com

## About

This project is a calculator for one of the most popular 
MMORPG games, Oldschool Runescape(http://oldschool.runescape.com/).

This game involves combat, which can be simulated with extreme accuracy.
The requirement for accurate simulation is entering combat statistics, 
such as health, offensive, and defensive capabilities. These numbers 
in conjunction with the same formulas used by the game allows this 
calculator to accurately simulate combat. A large number of iterations
of simulations allows the user to view the effectiveness of their equipment
such as weapons and armor, to decide which setup is the most effective.

## Methodology

### Database

Postgre SQL database contains the data used as inputs the to
the calculations. Since this data is not available
from the game's developers, it was scraped from a community wiki
page. Once the webpages were scraped their contents were parsed
for the necessary information and added to the database. 

### Frontend HTML

The frontend website allows users to enter and review data.
Aside from the static inputs, jQuery is used to create many
dynamic elements and almost all elements rely on jQuery to 
process or display information clientside. 

### Javascript + jQuery

The primary purpose of the frontend jQuery is to pass information
between the server and client. Clients may make search queries that 
require database access, which will be handled by the server.
Inputs have change() functions that automatically handle requests
without extra client input. 
Once the server returns the data in JSON form, it will be processed and 
displayed on the frontend. Certain key calculations are also made
by the server, which uses jQuery to read the data from the frontend.

### Server

The purpose of the server is to access the database and 
perform key mathematical calculations. The server utilizes a pool of clients in
order to perform database searches and return results to the client
in JSON form. Key calculations are performed by the server instead
of the client to lessen the load on the client. 

### Chart

The results of the simulations are displayed in bar graph form, with the
use of chart.js. 