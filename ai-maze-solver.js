
// Assign HTML elements to variables
const maze = document.querySelector('.maze');
const startButton = document.getElementById('start');
const startMapButton = document.getElementById('start-map');
const resetButton = document.getElementById('reset');
const resetMapButton = document.getElementById('reset-map');
const generateMazeButton = document.getElementById('generate-maze');
const generateMapButton = document.getElementById('generate-map');
const selectAlgorithm = document.getElementById('algorithm');
const selectVehicle = document.getElementById('vehicle');
let mazeArray = [];
let wallArray = [];
let mapArray = [];


let copyOfGeneratedMaze = [];
let copyOfGeneratedMap = [];

class PriorityQueue {

    constructor() {
        this.queue = [];
    }

    // Insert Item into Queue
    enqueue(item, priority) {
        // Insert, THEN Sort to maintain Priority Order
        this.queue.push({ item, priority });
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    // Remove Item into Queue
    dequeue() {
        // Check if Queue is Empty
        if (this.isEmpty()) {
            return null;
        }

        // Remove and Return First Item
        return this.queue.shift().item;
    }

    // Check if Queue is Empty
    isEmpty() {
        return this.queue.length === 0;
    }
}

// Prims Algorithm is used to generate the maze.
function generateMaze(rows, cols) {
    // Creates 2D array for maze, initializes all of the cells       // to be walls

    mazeArray = [];

    for (let i = 0; i < rows; i++) {
        mazeArray[i] = [];
        for (let j = 0; j < cols; j++) {
            mazeArray[i][j] = '1';
        }
    }

    // Top left is the starting cell
    mazeArray[0][0] = 'S';

    // Bottom right is the goal cell
    mazeArray[rows - 2][cols - 2] = 'G';

    // Add Walls of Initial Start cell
    addWalls(0, 0);

    while (wallArray.length > 0) {
        // Randomly select a Wall from the Current List of Walls
        const wallIndex = Math.floor(Math.random() * wallArray.length);
        // Removing the randomly selected walls,
        // There is no remove method for arrays so using splice instead.
        const removedWall = wallArray.splice(wallIndex, 1)[0];
        const wallRow = removedWall[0]; // Row of walls
        const wallCol = removedWall[1]; // col of walls
        const cellRow = removedWall[2]; // adjacent cells 
        const cellCol = removedWall[3]; // adjacent cells

        // calculates the cells on the other side of the wall
        let nextWallRow = 2 * wallRow - cellRow;
        let nextWallCol = 2 * wallCol - cellCol;

        if (nextWallRow < rows && nextWallRow >= 0 && nextWallCol < cols && nextWallCol >= 0) {
            // if the cell on the other side of wall is a wall, turn it into a path
            if (mazeArray[nextWallRow][nextWallCol] === '1') {
                mazeArray[nextWallRow][nextWallCol] = '0';
                // turns the current wall into a path
                mazeArray[wallRow][wallCol] = '0';
                // add surrounding walls to the list of walls
                addWalls(nextWallRow, nextWallCol);
            }
        }
    }

    copyOfGeneratedMaze = []

    for (let i = 0; i < mazeArray.length; i++) {
        copyOfGeneratedMaze[i] = [];
        for (let j = 0; j < mazeArray[i].length; j++) {
            copyOfGeneratedMaze[i][j] = mazeArray[i][j];
        }
    }

    displayMaze();
}

function generateTerrainMap() {
    mapArray = [];
    const terrainTypes = ['water', 'grassland', 'plains', 'desert', 'forest', 'snow'];
    const size = 9;

    // Helper function to get a random terrain type
    function getRandomTerrain() {
        return terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
    }

    // Initialize the map with random terrain types
    for (let i = 0; i < size; i++) {
        mapArray.push([]);
        for (let j = 0; j < size; j++) {
            if (i === 0 && j === 0) {
                // Start with a random terrain type for the first tile
                mapArray[i].push(getRandomTerrain());
            } else {
                // Determine the terrain type based on the previous tile
                const prevTerrain = mapArray[i][j - 1];
                if (i > 0 && j > 0) {
                    const prevRowTerrain = mapArray[i - 1][j];
                    // Calculate a random number to decide if the terrain should change
                    const randomChance = Math.random();
                    // Higher probability for the terrain to be the same as the previous tile
                    if (randomChance < 0.4) {
                        mapArray[i].push(prevTerrain);
                    } else if (randomChance < 0.8) {
                        mapArray[i].push(prevRowTerrain);
                    } else {
                        mapArray[i].push(getRandomTerrain());
                    }
                } else {
                    // Calculate a random number to decide if the terrain should change
                    mapArray[i].push(getRandomTerrain());
                }
            }
        }
    }

    // Top left is the starting cell
    mapArray[0][0] = 'S';

    // Bottom right is the goal cell
    mapArray[7][7] = 'G';

    copyOfGeneratedMap = []

    for (let i = 0; i < mapArray.length; i++) {
            copyOfGeneratedMap[i] = [];
        for (let j = 0; j < mapArray[i].length; j++) {
                copyOfGeneratedMap[i][j] = mapArray[i][j];
        }
    }

    displayMap();
}

function addWalls(row, col) {
    // Check each direction and add walls

    // Ensure the cell is not on the top edge and adds wall above current cell
    if (row > 0) { 
        if (mazeArray[row - 1][col] === '1') {
            wallArray.push([row - 1, col, row, col]);
        }
    }

    // below the current cell
    if (row < mazeArray.length - 1) { 
        if (mazeArray[row + 1][col] === '1') {
            wallArray.push([row + 1, col, row, col]);
        }
    }

    // Check to the left of the current cell
    if (col > 0) {
        if (mazeArray[row][col - 1] === '1') {
            wallArray.push([row, col - 1, row, col]);
        }
    }

    // Check to the right of the current cell
    if (col < mazeArray[0].length - 1) { 
        if (mazeArray[row][col + 1] === '1') {
            wallArray.push([row, col + 1, row, col]);
        }
    }
}

function displayMap() {
    maze.innerHTML = '';
    for (let i = 0; i < mapArray.length; i++) {
        const rowDiv = document.createElement('div');
        for (let j = 0; j < mapArray[i].length; j++) {
            const cell = mapArray[i][j];
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.style.width = `${700 / mapArray[0].length}px`;
            cellDiv.style.height = `${650 / mapArray.length}px`;
            if (cell === 'water') {
                cellDiv.style.backgroundColor = 'lightblue'; 
            } else if (cell === 'grassland') {
                cellDiv.style.backgroundColor = 'green'; 
            } else if (cell === 'plains') {
                cellDiv.style.backgroundColor = 'gray'; 
            } else if (cell === 'desert') {
                cellDiv.style.backgroundColor = 'yellow'; 
            } else if (cell === 'forest') {
                cellDiv.style.backgroundColor = 'darkgreen'; 
            } else if (cell === 'S') {
                cellDiv.style.backgroundColor = 'purple'; 
            } else if (cell === 'G') {
                cellDiv.style.backgroundColor = 'red'; 
            } else if (cell === 'V') {
                cellDiv.style.backgroundColor = 'black'; 
            } else {
                cellDiv.style.backgroundColor = 'white'; 
            }
            rowDiv.appendChild(cellDiv);
        }
        maze.appendChild(rowDiv);
    }
}


function displayMaze() {
    maze.innerHTML = '';
    for (let i = 0; i < mazeArray.length; i++) {
        const rowDiv = document.createElement('div');
        for (let j = 0; j < mazeArray[i].length; j++) {
            const cell = mazeArray[i][j];
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.style.width = `${700 / mazeArray[0].length}px`;
            cellDiv.style.height = `${650 / mazeArray.length}px`;
            if (cell === 'S') {
                cellDiv.style.backgroundColor = 'green'; 
            } else if (cell === 'G') {
                cellDiv.style.backgroundColor = 'red'; 
            } else if (cell === '1') {
                cellDiv.style.backgroundColor = 'black'; 
            } else if (cell === 'P') {
                cellDiv.style.backgroundColor = 'yellow'; 
            } else if (cell === 'V') {
                cellDiv.style.backgroundColor = 'blue'; 
            } else {
                cellDiv.style.backgroundColor = 'white'; 
            }
            rowDiv.appendChild(cellDiv);
        }
        maze.appendChild(rowDiv);
    }
}

function solve() {
    const algorithm = selectAlgorithm.value;
    switch (algorithm) {
        case 'bfs':
            bfsSolve();
            break;
        case 'dfs':
            dfsSolve();
            break;
        case 'greedy search manhattan':
            greedySearchManhattan();
            break;
        case 'greedy search euclidean':
            greedySearchEuclidean();
            break;
        case 'ucs':
            ucsSolve();
            break;
        case 'q-learning':
            qLearningSolve();
            break;
    }
}

function bfsSolve() {
    // Define start and goal cells
    const startRow = 0;
    const startCol = 0;
    const goalRow = mazeArray.length - 2;
    const goalCol = mazeArray[0].length - 2;


    const visited = [];
    for (let i = 0; i < mazeArray.length; i++) {
        visited.push(new Array(mazeArray[i].length).fill(false));
    }

    const queue = [];

    queue.push([startRow, startCol, []]);

    // possible moves (left, right, up, down))
    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function exploreNextCell() {
        // if queue is empty (done) display the maze
        if (queue.length === 0) {
            displayMaze();
            return;
        }

        // Dequeue the first cell from the queue
        const [row, col, path] = queue.shift();

        // If the current cell is the goal cell, display the maze
        if (row === goalRow && col === goalCol) {
            markPath(path); 
            displayMaze();
            return; 
        }
        // The current cell is visited
        if (visited[row][col]) {
            exploreNextCell(); 
            return;
        }

        visited[row][col] = true;
        mazeArray[row][col] = 'V'; 

        displayMaze(); 

        // Explore neighbors
        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMove(newRow, newCol)) {
                const newPath = [...path, [row, col]];
                if (newRow === goalRow && newCol === goalCol) {
                    markPath(newPath); 
                    displayMaze(); 
                    return; 
                }
                queue.push([newRow, newCol, newPath]);
            }
        }

        setTimeout(exploreNextCell, 50);
    }

    exploreNextCell();
}

function dfsSolve() {
    // Define start and goal cells
    const startRow = 0;
    const startCol = 0;
    const goalRow = mazeArray.length - 2;
    const goalCol = mazeArray[0].length - 2;

    const visited = [];
    for (let i = 0; i < mazeArray.length; i++) {
        visited.push(new Array(mazeArray[i].length).fill(false));
    }

    // Uses a stack to store paths
    const stack = [];
    // initializes stack with starting cell
    stack.push([startRow, startCol, []]);

    // possible moves (left, right, up, down)))
    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function exploreNextCell() {
        if (stack.length === 0) {
            displayMaze();
            return;
        }

        const [row, col, path] = stack.pop();

        if (row === goalRow && col === goalCol) {
            markPath(path);
            displayMaze();
            return;
        }

        if (visited[row][col]) {
            exploreNextCell();
            return;
        }

        visited[row][col] = true;
        mazeArray[row][col] = 'V';

        displayMaze();
        
        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMove(newRow, newCol)) {
                const newPath = [...path, [row, col]];
                if (newRow === goalRow && newCol === goalCol) {
                    markPath(newPath);
                    displayMaze();
                    return;
                }
                stack.push([newRow, newCol, newPath]);
            }
        }

        setTimeout(exploreNextCell, 120);
    }

    exploreNextCell();
}

function greedySearchManhattan() {
    const startRow = 0;
    const startCol = 0;
    const goalRow = mazeArray.length - 2;
    const goalCol = mazeArray[0].length - 2;

    const visited = [];
    for (let i = 0; i < mazeArray.length; i++) {
        visited.push(new Array(mazeArray[i].length).fill(false));
    }

    const priorityQueue = new PriorityQueue();
    
    priorityQueue.enqueue([startRow, startCol, []], manhattanDistance(startRow, startCol, goalRow, goalCol));

    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function exploreNextCell() {
        if (priorityQueue.isEmpty()) {
            displayMaze();
            return;
        }

        const [row, col, path] = priorityQueue.dequeue();

        if (row === goalRow && col === goalCol) {
            markPath(path); 
            displayMaze(); 
            return; 
        }

        if (visited[row][col]) {
            exploreNextCell(); 
            return;
        }

        visited[row][col] = true;
        mazeArray[row][col] = 'V';

        displayMaze(); 

        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMove(newRow, newCol)) {
                const newPath = [...path, [row, col]];
                priorityQueue.enqueue([newRow, newCol, newPath], manhattanDistance(newRow, newCol, goalRow, goalCol));
            }
        }

        setTimeout(exploreNextCell, 120);
    }

    exploreNextCell();
}

// this function calculates the manhattan distance heuristic value
function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function greedySearchEuclidean() {

    const startRow = 0;
    const startCol = 0;
    const goalRow = mazeArray.length - 2;
    const goalCol = mazeArray[0].length - 2;

    const visited = [];
    for (let i = 0; i < mazeArray.length; i++) {
        visited.push(new Array(mazeArray[i].length).fill(false));
    }

    const priorityQueue = new PriorityQueue();

    priorityQueue.enqueue([startRow, startCol, []], euclideanDistance(startRow, startCol, goalRow, goalCol));


    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function exploreNextCell() {

        if (priorityQueue.isEmpty()) {
            displayMaze();
            return;
        }


        const [row, col, path] = priorityQueue.dequeue();

        if (row === goalRow && col === goalCol) {
            markPath(path); 
            displayMaze(); 
            return; 
        }

        if (visited[row][col]) {
            exploreNextCell(); 
            return;
        }

        visited[row][col] = true;
        mazeArray[row][col] = 'V';

        displayMaze(); 

        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMove(newRow, newCol)) {
                const newPath = [...path, [row, col]];
                priorityQueue.enqueue([newRow, newCol, newPath], euclideanDistance(newRow, newCol, goalRow, goalCol));
            }
        }

        setTimeout(exploreNextCell, 120);
    }

    exploreNextCell();
}

// this function calculates the euclidean distance heuristic value
function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}


function ucsSolve() {
    const startRow = 0;
    const startCol = 0;
    const goalRow = mazeArray.length - 2;
    const goalCol = mazeArray[0].length - 2;

    const visited = [];
    for (let i = 0; i < mazeArray.length; i++) {
        visited.push(new Array(mazeArray[i].length).fill(false));
    }

    const pq = new PriorityQueue(); 
    pq.enqueue([startRow, startCol, 0, []], 0);

    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]]; 
    function exploreNextCell() {


        if (pq.isEmpty()) {
            displayMaze();
            return;
        }

        const [row, col, cost, path] = pq.dequeue();

        if (row === goalRow && col === goalCol) {
            markPath(path);
            displayMaze();
            return;
        }

        if (visited[row][col]) {
            exploreNextCell();
            return;
        }

        visited[row][col] = true;
        mazeArray[row][col] = 'V';

        displayMaze();

        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMove(newRow, newCol)) {
                const newCost = cost + 1;
                const newPath = [...path, [row, col]];
                pq.enqueue([newRow, newCol, newCost, newPath], newCost);
            }
        }


        setTimeout(exploreNextCell, 120);

    }

    exploreNextCell();
}

//this function checks to see if the next cell is within maze bounds
function isValidMove(row, col) {
    return (row >= 0 && row < mazeArray.length) &&
        (col >= 0 && col < mazeArray[0].length) &&
        (mazeArray[row][col] !== '1');
}
//same as above but for the map for q-learning
function isValidMoveMap(row, col) {
    return (row >= 0 && row < mapArray.length) &&
        (col >= 0 && col < mapArray[0].length) &&
        (mapArray[row][col] !== '1');
}

//this function marks the cell as a path on the maze
function markPath(path) {

    let goalReached = false;

    for (let [row, col] of path) {

        if (mazeArray[row][col] === 'G') {
            goalReached = true;
            break; 
        }
        mazeArray[row][col] = 'P';
    }

    displayMaze(); 

    return goalReached;
}

function markPathMap(path) {
    let goalReached = false;

    for (let [row, col] of path) {
        if (mapArray[row][col] === 'G') {
            goalReached = true;
            break; 
        }
        mapArray[row][col] = 'P';
    }

    displayMaze();

    return goalReached;
}


function qLearningSolve() {
    // Initialize Q-table
    const Q = {};

    // Training parameters
    let episodes = 15000;
    const learningRate = 0.1;
    const discountFactor = 0.9;
    let epsilon = 1.0; 

    // Initializes the Q-values for each of the state-action pairs
    for (let i = 0; i < mazeArray.length; i++) {
        for (let j = 0; j < mazeArray[i].length; j++) {
            Q[`${i},${j}`] = {
                'UP': 0,
                'DOWN': 0,
                'LEFT': 0,
                'RIGHT': 0
            };
        }
    }

    // Training loop
    for (let episode = 1; episode <= episodes; episode++) {

        let state = '0,0'; 

        while (true) {
            // Chooses an action using epsilon-greedy
            let action;
            if (Math.random() < epsilon) {
                action = getRandomAction(Q[state]);
            } else {
                action = getBestAction(Q[state]);
            }

            const [nextState, reward] = takeAction(mazeArray, state, action);


            // Update Q-value of the current state-action pair
            Q[state][action] = (1 - learningRate) * Q[state][action] +
                learningRate * (reward + discountFactor * Math.max(...Object.values(Q[nextState])));

            state = nextState;

            // Checks to see if reward limit has been reached
            if (reward === 100000) {
                break;
            }
        }

        epsilon *= 0.99;
    }

    const startRow = 0;
    const startCol = 0;
    const goalRow = mazeArray.length - 2;
    const goalCol = mazeArray[0].length - 2;

    const visited = [];
    for (let i = 0; i < mazeArray.length; i++) {
        visited.push(new Array(mazeArray[i].length).fill(false));
    }


    const priorityQueue = new PriorityQueue();

    priorityQueue.enqueue([startRow, startCol, []], Math.max(...mazeArray[startRow][startCol]));


    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function exploreNextCell() {

        if (priorityQueue.isEmpty()) {
            displayMaze();
            return;
        }


        const [row, col, path] = priorityQueue.dequeue();

        if (row === goalRow && col === goalCol) {
            markPath(path); 
            displayMaze(); 
            return; 
        }


        if (visited[row][col]) {
            exploreNextCell();
            return;
        }

        visited[row][col] = true;
        mazeArray[row][col] = 'V'; 

        displayMaze(); 

        // Explores the next cell with the highest Q-value
        let maxQValue = Number.NEGATIVE_INFINITY;
        let bestMove = null;

        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMove(newRow, newCol)) {
                const nextState = `${newRow},${newCol}`;
                const qValues = Q[nextState];
                let qValue = 0;

                if (qValues) {
                  const maxQValue = Math.max(...Object.values(qValues));
                  qValue = maxQValue;
                }
                if (qValue > maxQValue) {
                    maxQValue = qValue;
                    bestMove = [newRow, newCol];
                }
            }
        }

        if (bestMove) {
            const [newRow, newCol] = bestMove;
            const newPath = [...path, [row, col]];
            priorityQueue.enqueue([newRow, newCol, newPath], 0);
        }

        setTimeout(exploreNextCell, 120);
    }

    exploreNextCell();

    return Q;
}

// this function takes an action and retrieves next reward and next state
function takeAction(mazeArray, currentState, action) {
    const [row, col] = currentState.split(',').map(Number);

    let newRow = row;
    let newCol = col;

    // Update row and column based on the action
    switch (action) {
        case 'UP':
            newCol -= 1;
            break;
        case 'DOWN':
            newCol += 1;
            break;
        case 'LEFT':
            newRow -= 1;
            break;
        case 'RIGHT':
            newRow += 1;
            break;
        default:

            break;
    }


    if (newRow < 0 || newRow >= mazeArray.length || newCol < 0 || newCol >= mazeArray[0].length) {
        // If next state is outside the grid, the function will stay in the current position and return a negative reward
        return [currentState, -1000];
    } else if (mazeArray[newRow][newCol] === '1') {
        //wall has been hit
        return [currentState, -1000];
    } else if (newRow >= 0 && newRow < mazeArray.length && newCol >= 0 && newCol < mazeArray[0].length) {
        const nextState = `${newRow},${newCol}`;
        const reward = getReward(mazeArray[newRow][newCol]); 
        return [nextState, reward];
    }
}

// this function returns the type of reward for the current cell, either good or bad.
function getReward(tile) {
    if (tile === 'G') {
        // Goal node
        return 100000;
    } else {
        // Non-goal node
        return -10;
    }
}

function qLearning_MapSolve() {

    const Q = {};

    let episodes = 110;
    const learningRate = 0.1;
    const discountFactor = 0.9;
    let epsilon = 1.0; 

    for (let i = 0; i < mapArray.length; i++) {
        for (let j = 0; j < mapArray[i].length; j++) {
            Q[`${i},${j}`] = {
                'UP': 0,
                'DOWN': 0,
                'LEFT': 0,
                'RIGHT': 0
            };
        }
    }


    for (let episode = 1; episode <= episodes; episode++) {

        let state = '0,0'; 

        while (true) {
            let action;
            if (Math.random() < epsilon) {
                action = getRandomAction(Q[state]);
            } else {
                action = getBestAction(Q[state]);
            }

            const [nextState, reward] = takeActionMap(mapArray, state, action);


            Q[state][action] = (1 - learningRate) * Q[state][action] +
                learningRate * (reward + discountFactor * Math.max(...Object.values(Q[nextState])));

            state = nextState;

            if (reward === 100000) {
                break;
            }

        }

        epsilon *= 0.99;
    }

    const startRow = 0;
    const startCol = 0;
    const goalRow = mapArray.length - 2;
    const goalCol = mapArray[0].length - 2;

    const visited = [];
    for (let i = 0; i < mapArray.length; i++) {
        visited.push(new Array(mapArray[i].length).fill(false));
    }

    const priorityQueue = new PriorityQueue();

    priorityQueue.enqueue([startRow, startCol, []], Math.max(...mapArray[startRow][startCol]));


    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function exploreNextCell() {

        if (priorityQueue.isEmpty()) {
            displayMap();
            return;
        }

        const [row, col, path] = priorityQueue.dequeue();


        if (row === goalRow && col === goalCol) {
            markPath(path);
            displayMap();
            return;
        }


        if (visited[row][col]) {
            exploreNextCell(); 
            return;
        }

        visited[row][col] = true;
        mapArray[row][col] = 'V';

        displayMap(); 


        let maxQValue = Number.NEGATIVE_INFINITY;
        let bestMove = null;

        for (let move of moves) {
            const newRow = row + move[0];
            const newCol = col + move[1];
            if (isValidMoveMap(newRow, newCol)) {
                const nextState = `${newRow},${newCol}`;

                const qValues = Q[nextState];
                let qValue = 0;

                if (qValues) {
                  const maxQValue = Math.max(...Object.values(qValues));
                  qValue = maxQValue;
                }

                if (qValue > maxQValue) {
                    maxQValue = qValue;
                    bestMove = [newRow, newCol];
                }
            }
        }

        if (bestMove) {
            const [newRow, newCol] = bestMove;
            const newPath = [...path, [row, col]];
            priorityQueue.enqueue([newRow, newCol, newPath], 0);
        }

        setTimeout(exploreNextCell, 120);
    }

    exploreNextCell();

    return Q;
}

// Function to get a random action from the available actions
function getRandomAction(actions) {
    const keys = Object.keys(actions);
    return keys[Math.floor(Math.random() * keys.length)];
}

// Function to get the best action (action with the highest Q-value) from the available actions
function getBestAction(actions) {
    let bestAction = null;
    let maxQValue = Number.NEGATIVE_INFINITY;
    for (let action in actions) {
        if (actions[action] > maxQValue) {
            maxQValue = actions[action];
            bestAction = action;
        }
    }
    return bestAction;
}

// Function to take an action in the environment and observe the next state and reward
function takeActionMap(mapArray, currentState, action) {
    const [row, col] = currentState.split(',').map(Number);

    let newRow = row;
    let newCol = col;

    // Update row and column based on the action
    switch (action) {
        case 'UP':
            newCol -= 1;
            break;
        case 'DOWN':
            newCol += 1;
            break;
        case 'LEFT':
            newRow -= 1;
            break;
        case 'RIGHT':
            newRow += 1;
            break;
        default:
            break;
    }

    if (newRow < 0 || newRow >= mapArray.length || newCol < 0 || newCol >= mapArray[0].length) {

        return [currentState, -1000];
    } else if (newRow >= 0 && newRow < mapArray.length && newCol >= 0 && newCol < mapArray[0].length) {
        const nextState = `${newRow},${newCol}`;
        const reward = getReward_map(mapArray[newRow][newCol]); // Assume the reward is based on the type of tile
        return [nextState, reward];
    }
}

// Function to get the reward based on the type of tile
function getReward_map(tile) {
    const vehicle = selectVehicle.value;
    if (vehicle === 'car') {
        if (tile === 'G') {
            return 100000;
        } else if (tile === 'water') {
            return -1000;
        } else if (tile === 'grassland') {
            return 10;
        } else if (tile === 'plains') {
            return 20;
        } else if (tile === 'snow') {
            return -100;
        } else if (tile === 'desert') {
            return -10;
        } else if (tile == 'forest') {
            return -30;
        } else {
            return -1000
        }
    } else if (vehicle === 'boat') {
        if (tile === 'G') {
            return 100000;
        } else if (tile === 'water') {
            return 1000;
        } else if (tile === 'grassland') {
            return -100;
        } else if (tile === 'plains') {
            return -100;
        } else if (tile === 'snow') {
            return -100;
        } else if (tile === 'desert') {
            return -100;
        } else if (tile == 'forest') {
            return -100;
        } else {
            return -1000
        }
    } else if (vehicle === 'airplane') {
        if (tile === 'G') {
            return 100000;
        } else if (tile === 'water') {
            return 1000;
        } else if (tile === 'grassland') {
            return 1000;
        } else if (tile === 'plains') {
            return 1000;
        } else if (tile === 'snow') {
            return 1000;
        } else if (tile === 'desert') {
            return 1000;
        } else if (tile == 'forest') {
            return 1000;
        } else {
            return -1000;
        }
    } else if (vehicle === 'offroad_truck') {
        if (tile === 'G') {
            return 100000;
        } else if (tile === 'water') {
            return -1000;
        } else if (tile === 'grassland') {
            return 200;
        } else if (tile === 'plains') {
            return 300;
        } else if (tile === 'snow') {
            return 50;
        } else if (tile === 'desert') {
            return 75;
        } else if (tile == 'forest') {
            return 200;
        } else {
            return -1000;
        }
    } else if (vehicle === 'snowmobile') {
        if (tile === 'G') {
            return 100000;
        } else if (tile === 'water') {
            return -1000;
        } else if (tile === 'grassland') {
            return -100;
        } else if (tile === 'plains') {
            return 100;
        } else if (tile === 'snow') {
            return 3000;
        } else if (tile === 'desert') {
            return 300;
        } else if (tile == 'forest') {
            return -300;
        } else {
            return -1000;
        }
    } else if (vehicle === 'dune_buggy') {
        if (tile === 'G') {
            return 100000;
        } else if (tile === 'water') {
            return -1000;
        } else if (tile === 'grassland') {
            return 50;
        } else if (tile === 'plains') {
            return 100;
        } else if (tile === 'snow') {
            return -50;
        } else if (tile === 'desert') {
            return 500;
        } else if (tile == 'forest') {
            return -200;
        } else {
            return -1000;
        }
    }
}


// Map event handling
startButton.addEventListener('click', solve);
startMapButton.addEventListener('click', qLearning_MapSolve);

// Reset Button - Maze
resetButton.addEventListener('click', function() {
    if (copyOfGeneratedMaze.length === 0) {
        return;
    }

    mazeArray = [];
    for (let i = 0; i < copyOfGeneratedMaze.length; i++) {
        mazeArray[i] = [];
        for (let j = 0; j < copyOfGeneratedMaze[i].length; j++) {
            mazeArray[i][j] = copyOfGeneratedMaze[i][j];
        }
    }

    displayMaze();
});

// Reset Button - Map
resetMapButton.addEventListener('click', function() {
    if (copyOfGeneratedMap.length === 0) {
        return;
    }

    mapArray = [];
    for (let i = 0; i < copyOfGeneratedMap.length; i++) {
        mapArray[i] = [];
        for (let j = 0; j < copyOfGeneratedMap[i].length; j++) {
            mapArray[i][j] = copyOfGeneratedMap[i][j];
        }
    }

    displayMap();
});


generateMazeButton.addEventListener('click', () => {
    const size = parseInt(document.getElementById('mazeSize').value);
    generateMaze(size, size);
});

generateMapButton.addEventListener('click', () => {
    generateTerrainMap();
});
