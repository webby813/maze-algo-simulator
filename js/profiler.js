"use strict";

function ResetDashboard() {
	const finish_ID = document.getElementById("finish_time");
	const path_visited_ID = document.getElementById("path_visited");
	finish_ID.textContent = `0:000`;
	path_visited_ID.textContent = `0`;
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
