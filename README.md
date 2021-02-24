# tennis_visual

<p> This is a tennis stats web application which uses Django, SQLite (local), Bootstrap, and Chart.js. The app presents ATP tournament wins for all male grand slam winners
since Roger Federer, and uses charts to show the wins by calendar year, the player's age, and the court surface. There are tables which present player profile data and tournament details. 

There is currently no public API for ATP data. Instead, the SQLite database was populated using a web scraper written in Beautiful Soup (python package). Sometime subsequent to the database
first being populated <a href="https://www.atptour.com/">ATP Tour</a> was changed and the requests are now blocked.</p>

<p>This app is hosted on PythonAnywhere: <a href="http://andrewb.pythonanywhere.com/">Tennis Stats</a></p>
