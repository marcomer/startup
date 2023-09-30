# startup
BYU CS 260 Fall 2023 Startup Project for Marcus Omer

## Specification
#### Pitch
The website will be a command line/terminal themed sudoku site that will let users generate, solve, and revisit sudoku puzzles. The command line/terminal theme is inspired from the "sudo" part of "sudoku", which is reference to the `sudo` terminal command. The website will have a default dark theme and the sudoku board will be made with ASCII characters/art. 

#### Key Features:
Users can generate and revisit sudoku boards by logging in with an account. To make solving s udoku puzzles more convienient, the sudoku board will highlight boxes of the board in red if the number in the box violates any sudoku rules applied to the current state of the board. The boxes that are violated by the box highlighted in red are highlighted in pink. All generated sudoku boards will have only one unique solution. Generated sudoku boards can be generated with a given difficulty. The greater the difficulty, the smaller number of given numbers on the board are given.
+ **Authentication**: The user will login with an email and password. The registered user's account is used to associate data, statistics, and finished and unfinished sudoku boards.
+ **Database data**: The user will have data stored in a database. This data will include how many sudoku boards the user has solved, how many sudoku boards the user has generated, which sudoku boards the user has solved, and which sudoku boards the user has started but has not solved.
+ **Websocket data**: The server will keep and send realtime data to the user. This data will include the total number of sudoku boards generated by all users and a scoreboard with the users with the most solved sudoku boards.



