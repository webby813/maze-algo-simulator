"use strict";

let memoryWorker;

function cleanupMemoryMonitoring() {
    if (memoryWorker) {
        memoryWorker.postMessage('stop');
        memoryWorker.terminate();
    }
}

function distance(point_1, point_2) {
    return Math.sqrt(Math.pow(point_2[0] - point_1[0], 2) + Math.pow(point_2[1] - point_1[1], 2));
}

function maze_solvers_interval() {

    return new Promise((resolve) => {
        my_interval = window.setInterval(function () {
            if (!path) {
                place_to_cell(node_list[node_list_index][0], node_list[node_list_index][1]).classList.add("cell_algo");
                node_list_index++;

                if (node_list_index === node_list.length) {
                    if (!found) {
                        clearInterval(my_interval);
                        resolve();
                    } else {
                        path = true;
                        place_to_cell(start_pos[0], start_pos[1]).classList.add("cell_path");
                    }
                }
            } else {
                if (path_list_index === path_list.length) {
                    place_to_cell(target_pos[0], target_pos[1]).classList.add("cell_path");
                    clearInterval(my_interval);
                    resolve();
                    return;
                }
                place_to_cell(path_list[path_list_index][0], path_list[path_list_index][1]).classList.remove("cell_algo");
                place_to_cell(path_list[path_list_index][0], path_list[path_list_index][1]).classList.add("cell_path");
                path_list_index++;
            }
        }, 10);
    });
}

async function dijkstra() {
    const start_Time = performance.now();
    let finish_Time = 0;

    node_list = [];
    node_list_index = 0;
    path_list = [];
    path_list_index = 0;
    found = false;
    path = false;
    let frontier = [start_pos];
    grid[start_pos[0]][start_pos[1]] = 1;

    do {
        let list = get_neighbours(frontier[0], 1);
        frontier.splice(0, 1);
        for (let i = 0; i < list.length; i++) {
            if (get_node(list[i][0], list[i][1]) === 0) {
                frontier.push(list[i]);
                grid[list[i][0]][list[i][1]] = i + 1;
                if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) {
                    found = true;
                    break;
                }
                node_list.push(list[i]);
            }
        }
    } while (frontier.length > 0 && !found);

    if (found) {
        let current_node = target_pos;
        while (current_node[0] !== start_pos[0] || current_node[1] !== start_pos[1]) {
            switch (grid[current_node[0]][current_node[1]]) {
                case 1: current_node = [current_node[0], current_node[1] + 1]; break;
                case 2: current_node = [current_node[0] - 1, current_node[1]]; break;
                case 3: current_node = [current_node[0], current_node[1] - 1]; break;
                case 4: current_node = [current_node[0] + 1, current_node[1]]; break;
                default: break;
            }
            path_list.push(current_node);
        }
        path_list.pop();
        path_list.reverse();
    }
    await maze_solvers_interval();
    finish_Time = performance.now();
    FinishLog(start_Time, finish_Time);

    clearInterval(my_interval);
    set_PathVisited(node_list.length);
    cleanupMemoryMonitoring();
}

async function bidirectional_breadth_first(){
    const start_Time = performance.now();
    let finish_Time = 0;

	node_list = [];
	node_list_index = 0;
	path_list = [];
	path_list_index = 0;
	found = false;
	path = false;
	let current_cell;
	let start_end;
	let target_end;
	let frontier = [start_pos, target_pos];
	grid[target_pos[0]][target_pos[1]] = 1;
	grid[start_pos[0]][start_pos[1]] = 11;

	do
	{
		current_cell = frontier[0];
		let list = get_neighbours(current_cell, 1);
		frontier.splice(0, 1);

		for (let i = 0; i < list.length; i++)
		{
			if (get_node(list[i][0], list[i][1]) == 0)
			{
				frontier.push(list[i]);

				if (grid[current_cell[0]][current_cell[1]] < 10)
					grid[list[i][0]][list[i][1]] = i + 1;
				else
					grid[list[i][0]][list[i][1]] = 11 + i;

				node_list.push(list[i]);
			}

			else if (get_node(list[i][0], list[i][1]) > 0)
			{
				if (grid[current_cell[0]][current_cell[1]] < 10 && get_node(list[i][0], list[i][1]) > 10)
				{
					start_end = current_cell;
					target_end = list[i];
					found = true;
					break;
				}

				else if (grid[current_cell[0]][current_cell[1]] > 10 && get_node(list[i][0], list[i][1]) < 10)
				{
					start_end = list[i];
					target_end = current_cell;
					found = true;
					break;
				}
			}
		}
	}
	while (frontier.length > 0 && !found)

	if (found)
	{
		let targets = [target_pos, start_pos];
		let starts = [start_end, target_end];

		for (let i = 0; i < starts.length; i++)
		{
			let current_node = starts[i];

			while (current_node[0] != targets[i][0] || current_node[1] != targets[i][1])
			{
				path_list.push(current_node);

				switch (grid[current_node[0]][current_node[1]] - (i * 10))
				{
					case 1: current_node = [current_node[0], current_node[1] + 1]; break;
					case 2: current_node = [current_node[0] - 1, current_node[1]]; break;
					case 3: current_node = [current_node[0], current_node[1] - 1]; break;
					case 4: current_node = [current_node[0] + 1, current_node[1]]; break;
					default: break;
				}
			}

			if (i == 0)
				path_list.reverse();
		}

		path_list.reverse();
	}
	await maze_solvers_interval();
    finish_Time = performance.now();
    FinishLog(start_Time, finish_Time);

    clearInterval(my_interval);
    set_PathVisited(node_list.length);
    cleanupMemoryMonitoring();
}

async function a_star() {
    const start_Time = performance.now();
    let finish_Time = 0;

    node_list = [];
    node_list_index = 0;
    path_list = [];
    path_list_index = 0;
    found = false;
    path = false;

    let frontier = [start_pos];

    //Only A* uses a cost grid
    let cost_grid = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));
    grid[start_pos[0]][start_pos[1]] = 1;

    do {
        frontier.sort(function (a, b) {
            let a_value = cost_grid[a[0]][a[1]] + distance(a, target_pos) * Math.sqrt(2);
            let b_value = cost_grid[b[0]][b[1]] + distance(b, target_pos) * Math.sqrt(2);
            return a_value - b_value;
        });

        let current_cell = frontier[0];
        let list = get_neighbours(current_cell, 1);
        frontier.splice(0, 1);

        for (let i = 0; i < list.length; i++) {
            if (get_node(list[i][0], list[i][1]) === 0) {
                frontier.push(list[i]);
                grid[list[i][0]][list[i][1]] = i + 1;
                cost_grid[list[i][0]][list[i][1]] = cost_grid[current_cell[0]][current_cell[1]] + 1;

                if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) {
                    found = true;
                    break;
                }
                node_list.push(list[i]);
            }
        }
    } while (frontier.length > 0 && !found);

    if (found) {
        let current_node = target_pos;

        while (current_node[0] !== start_pos[0] || current_node[1] !== start_pos[1]) {
            switch (grid[current_node[0]][current_node[1]]) {
                case 1: current_node = [current_node[0], current_node[1] + 1]; break;
                case 2: current_node = [current_node[0] - 1, current_node[1]]; break;
                case 3: current_node = [current_node[0], current_node[1] - 1]; break;
                case 4: current_node = [current_node[0] + 1, current_node[1]]; break;
                default: break;
            }
            path_list.push(current_node);
        }
        path_list.pop();
        path_list.reverse();
    }

    await maze_solvers_interval();
    finish_Time = performance.now();
    FinishLog(start_Time, finish_Time);

    clearInterval(my_interval);
    set_PathVisited(node_list.length);
    cleanupMemoryMonitoring();
}

async function enhanced_dijkstra() {
    const start_Time = performance.now();
    let finish_Time = 0;

    node_list = [];
    node_list_index = 0;
    path_list = [];
    path_list_index = 0;
    found = false;
    path = false;

    let current_cell_start;
    let current_cell_target;
    let start_end;
    let target_end;
    let intersection_point;

    // Initialize two frontiers
    let frontier_start = [start_pos];
    let frontier_target = [target_pos];

    // Initialize two cost grids
    let cost_grid_start = Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));
    let cost_grid_target = Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));

    cost_grid_start[start_pos[0]][start_pos[1]] = 0;
    cost_grid_target[target_pos[0]][target_pos[1]] = 0;

    // Mark initial positions
    grid[start_pos[0]][start_pos[1]] = 1;  // START_EXPANSION
    grid[target_pos[0]][target_pos[1]] = 2;  // TARGET_EXPANSION

    // Helper function to check if a position is within grid bounds
    function isValidPosition(pos) {
        const [row, col] = pos;
        return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
    }

    // Helper function to check if a position has been visited by the other frontier
    function checkIntersection(pos, fromStart) {
        if (!isValidPosition(pos)) return false;
        const [row, col] = pos;
        const valueToCheck = fromStart ? 2 : 1; // If fromStart, check for TARGET_EXPANSION, else check for START_EXPANSION
        return grid[row][col] === valueToCheck;
    }

    while (frontier_start.length > 0 && frontier_target.length > 0 && !found) {
        // Expand from start
        frontier_start.sort(function (a, b) {
            let a_value = cost_grid_start[a[0]][a[1]] + distance(a, target_pos);
            let b_value = cost_grid_start[b[0]][b[1]] + distance(b, target_pos);
            return a_value - b_value;
        });

        current_cell_start = frontier_start.shift();
        let neighbors_start = get_neighbours(current_cell_start, 1);
        
        for (let i = 0; i < neighbors_start.length; i++) {
            let [row, col] = neighbors_start[i];
            
            if (!isValidPosition(neighbors_start[i])) continue;

            // Check for intersection with target frontier
            if (checkIntersection(neighbors_start[i], true)) {
                found = true;
                intersection_point = neighbors_start[i];
                start_end = current_cell_start;
                target_end = neighbors_start[i];
                break;
            }

            if (get_node(row, col) === 0) {
                frontier_start.push(neighbors_start[i]);
                cost_grid_start[row][col] = cost_grid_start[current_cell_start[0]][current_cell_start[1]] + 1;
                grid[row][col] = 1;  // Mark as visited by start frontier
                node_list.push(neighbors_start[i]);
            }
        }

        if (found) break;

        // Expand from target
        frontier_target.sort(function (a, b) {
            let a_value = cost_grid_target[a[0]][a[1]] + distance(a, start_pos);
            let b_value = cost_grid_target[b[0]][b[1]] + distance(b, start_pos);
            return a_value - b_value;
        });

        current_cell_target = frontier_target.shift();
        let neighbors_target = get_neighbours(current_cell_target, 1);
        
        for (let i = 0; i < neighbors_target.length; i++) {
            let [row, col] = neighbors_target[i];
            
            if (!isValidPosition(neighbors_target[i])) continue;

            // Check for intersection with start frontier
            if (checkIntersection(neighbors_target[i], false)) {
                found = true;
                intersection_point = neighbors_target[i];
                start_end = neighbors_target[i];
                target_end = current_cell_target;
                break;
            }

            if (get_node(row, col) === 0) {
                frontier_target.push(neighbors_target[i]);
                cost_grid_target[row][col] = cost_grid_target[current_cell_target[0]][current_cell_target[1]] + 1;
                grid[row][col] = 2;  // Mark as visited by target frontier
                node_list.push(neighbors_target[i]);
            }
        }
    }

    if (found) {
        // Reconstruct path from both directions
        let path_from_start = [];
        let path_from_target = [];
        
        // Reconstruct path from start to intersection
        let current = start_end;
        while (!(current[0] === start_pos[0] && current[1] === start_pos[1])) {
            path_from_start.push(current);
            let neighbors = get_neighbours(current, 1);
            let min_cost = Infinity;
            let next_cell = null;
            
            for (let neighbor of neighbors) {
                if (!isValidPosition(neighbor)) continue;
                let [row, col] = neighbor;
                if (grid[row][col] === 1 && cost_grid_start[row][col] < min_cost) {
                    min_cost = cost_grid_start[row][col];
                    next_cell = neighbor;
                }
            }
            
            if (!next_cell) break; // Safety check
            current = next_cell;
        }
        
        // Reconstruct path from intersection to target
        current = target_end;
        while (!(current[0] === target_pos[0] && current[1] === target_pos[1])) {
            path_from_target.push(current);
            let neighbors = get_neighbours(current, 1);
            let min_cost = Infinity;
            let next_cell = null;
            
            for (let neighbor of neighbors) {
                if (!isValidPosition(neighbor)) continue;
                let [row, col] = neighbor;
                if (grid[row][col] === 2 && cost_grid_target[row][col] < min_cost) {
                    min_cost = cost_grid_target[row][col];
                    next_cell = neighbor;
                }
            }
            
            if (!next_cell) break; // Safety check
            current = next_cell;
        }

        // Combine paths
        path_list = [...path_from_start.reverse(), intersection_point, ...path_from_target];
    }

    await maze_solvers_interval();
    finish_Time = performance.now();
    FinishLog(start_Time, finish_Time);

    clearInterval(my_interval);
    set_PathVisited(node_list.length);
    cleanupMemoryMonitoring();
}

function maze_solvers() {
    clear_grid();
    ResetDashboard();
    grid_clean = false;

    if ((Math.abs(start_pos[0] - target_pos[0]) === 0 && Math.abs(start_pos[1] - target_pos[1]) === 1) ||
        (Math.abs(start_pos[0] - target_pos[0]) === 1 && Math.abs(start_pos[1] - target_pos[1]) === 0)) {
        place_to_cell(start_pos[0], start_pos[1]).classList.add("cell_path");
        place_to_cell(target_pos[0], target_pos[1]).classList.add("cell_path");
    } else if (document.querySelector("#slct_1").value === "1") {
        dijkstra();
    } else if (document.querySelector("#slct_1").value === "2") {
        bidirectional_breadth_first();
    } else if (document.querySelector("#slct_1").value === "3") {
        a_star();
    } else if (document.querySelector("#slct_1").value === "4") {
        enhanced_dijkstra();
    }
}