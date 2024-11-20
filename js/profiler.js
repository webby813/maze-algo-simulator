"use strict";

function ResetDashboard() {
    const memory_consumed = document.getElementById("memory_consumed");
	const finish_ID = document.getElementById("finish_time");
	const path_visited_ID = document.getElementById("path_visited");
	finish_ID.textContent = `0:000`;
    memory_consumed.textContent = `0.000`;
	path_visited_ID.textContent = `0`;

    // const arrival_ID = document.getElementById("arrival_time");
	// arrival_ID.textContent = "0:0";
}

function set_PathVisited(path_visited) {
	const path_visited_ID = document.getElementById("path_visited");
	path_visited_ID.textContent = path_visited;
}

function FinishLog(start_Time, finish_Time) {
	const finish_ID = document.getElementById("finish_time");

	const finish_time = finish_Time - start_Time;
	const f_seconds = Math.floor(finish_time / 1000);
	const f_milliseconds = Math.floor(finish_time % 1000);

	finish_ID.textContent = `${f_seconds}:${f_milliseconds}`;
	console.log(finish_ID.textContent);
}

function monitorMemoryUsage() {
	const memory_consumed = document.getElementById("memory_consumed");
    if (performance.memory) {
        const { usedJSHeapSize} = performance.memory;
		memory_consumed.textContent = `${(usedJSHeapSize / 1048576).toFixed(2)} MB`
    } else {
        console.warn("Memory API is not supported in this browser.");
    }
}

function monitorMemoryPeriodically(interval = 1000) {
    return setInterval(() => monitorMemoryUsage("Periodic memory usage"), interval);
}