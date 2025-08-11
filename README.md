# AI Maze Solver & Map/Terrain/Vehicle Navigation

This project is a browser-based application that can generate mazes and simulated maps, then solve them using a variety of search algorithms and Q-Learning. The goal was to compare algorithm performance in different environments and see how terrain and vehicle constraints affect pathfinding.

## Features

- **Maze Generation** – Create mazes of various sizes (5×5, 9×9, 15×15, 25×25) using Prim’s algorithm.
- **Map Generation** – Build terrain maps with randomized tile clustering for snow, water, grass, sand, forest, and air.
- **Multiple Search Algorithms**  
  - Breadth-First Search (BFS)  
  - Depth-First Search (DFS)  
  - Uniform Cost Search (UCS)  
  - Greedy Search (Manhattan & Euclidean)  
  - Q-Learning with customizable rewards  
- **Vehicle Simulation** – Choose from cars, boats, airplanes, off-road trucks, snowmobiles, and dune buggies, each optimized for different terrain.
- **Step-by-Step Visualization** – See both visited cells and the final optimal path.
- **Reset and Replay** – Quickly reset and try different algorithms or configurations.

## How It Works

- **Maze & Map Creation**:  
  Mazes are generated with walls and open paths; maps are created with terrain tiles grouped in clusters for more realistic layouts.

- **Search Algorithms**:  
  BFS, DFS, UCS, and Greedy Search are implemented with queues, stacks, or priority queues depending on the algorithm.  
  Q-Learning trains over 15,000 epochs with adjustable learning rate, discount factor, and exploration rate to find optimal policies.

- **Vehicle/Terrain Logic**:  
  Vehicle type affects Q-Learning rewards-boats prefer water, snowmobiles prefer snow, etc.

## Tech Stack

- **HTML / CSS / JavaScript** for the front-end
- DOM manipulation for visualization

## Directions

1. Clone or download this repository.
2. Open `ai-maze-solver.html` in your web browser.
3. Use the controls to generate a maze or map, choose your algorithm/vehicle, and start the solver.
