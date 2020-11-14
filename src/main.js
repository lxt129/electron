//-------------------引入electron的dialog-------------------
const {dialog} = nodeRequire('electron').remote;
const {remote} = nodeRequire('electron')
//-------------------绘图的全局变量-------------------
var canvas, ctx, cvs;
var WIDTH, HEIGHT;
var points = [];
var hidden = []; //障碍
var area_y = 800;
var area_x = area_y;
var height_Y = 40;
var width_X = 40;
var drawHidden = false;

var routes = []; //运动路线
var routesIndex = []; //每段路线的索引
var hiddenRoutes = [];




//-------------------寻找最优路径(遗传算法)的全局变量-------------------
var running;
var doPreciseMutate;
var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;
var mutationTimes; //变异次数
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var routeLenth;
var fitnessValues;
var roulette;

var titik1_pop = 0;
var titik2_pop = 70;
var titik3_pop = 150;
var titik1_sales = 0;
var titik2_sales = 5;
var titik3_sales = 10;
var titik1_mut = 0;
var titik2_mut = 0.002;
var titik3_mut = 0.01;


//-------------------用户设定的参数-------------------
var SALES_MEN = 1; //基地个数
var drones = 10; //无人机个数
var ship = 10; //无人船个数
var submarine = 10;//无人潜艇
var surveyRescue = 999;//探测资源数量
var roundUpRescue = 999;//围捕资源数量
var attackRescue = 999;//打击资源数量

var droneSpeed = 200; //无人机速度
var droneMaxTime = 10000; //无人机最大运动时间
var droneMaxLoad = 2;  //无人机最大负载
var shipSpeed = 200; //无人船速度
var shipMaxTime = 10000; //无人船最大运动时间
var shipMaxLoad = 2;  //无人船最大负载
var submarineSpeed = 200; //无人潜艇速度
var submarineMaxTiem = 10000; //无人潜艇最大运动时间
var submarineMaxLoad = 2;  //无人潜艇最大负载



var surveyRequirement = 1; 	//探测任务需要设备
var roundUpRequirement = 2;	//围捕任务需要设备
var attackRequirement = 3;	//打击任务需要设备
var surveyTime = 1000;   //探测任务所需时间
var roundUpTime = 1000;  //围捕任务所需时间
var attackTime = 1000;   //打击任务所需时间

var taskProgramme = 1;//任务方案
var taskEquipment = 1;//任务设备
var taskType = 1; //任务类型（1探测、2围捕、3打击）
// var hitRate = 50
// var surroundRate = 35



$(function() {
	
	init();
	initData();
	
	$('#addRandom_btn').click(function() {
		addRandomPoints(20);
		$('#status').text("");
		running = false;
	});

	$('#start_btn').click(function() {
		if (points.length >= 3) {
			initData();
			GAInitialize();
			running = true;
			drawHidden = false;
		} else {
			alert("add some more points to the map!");
		}
	});
	$('#clear_btn').click(function() {
		running === false;
		initData();
		points = new Array();
		hidden = new Array();
		targetPointHit = new Array();
		targetPointSurround = new Array();
	});
	$('#stop_btn').click(function() {
		if (running === false && currentGeneration !== 0) {
			// if (best.length !== points.length) {
			//   initData();
			//   GAInitialize();
			// }
			running = true;
		} else {
			running = false;
		}
	});
	$('#avoidHidden').click(function() {
		drawHidden = !drawHidden;
		drawAvoidHidden(best);
	})
	$('#move').click(function() {
		tools.messageComfirm()
	})
});

function MoveProgress(){
	let htmllet = `
	<div id="progress">
		<p>探测任务执行进度</p>
		<div class="layui-progress" lay-filter="progress">
			<div class="layui-progress-bar" lay-percent="0%" lay-showPercent="true"></div>
		</div>
	</div>
	`;
	$('#infoDiv').append(htmllet);
	
	tools.startProgress();
		target = 0;//目标数
		drone = 0; //无人机数
		$('#info').val('');
		addinfo("巡查任务开始...");
		hitRate = $('input[name="hitRate"]').val()||35; 
		surroundRate = $('input[name="surroundRate"]').val()||50;
		console.log(hitRate,surroundRate)
		for (var i = 0; i < 5; i++) {
			var rand = randomNumber(points.length);
			if(rand < SALES_MEN){
				rand = randomNumber(points.length);
			}
			points[rand].isTargetUnfind = true;
		}
		running = false;
		routes = [];
		for (var i = 0; i < SALES_MEN; i++) {
			routes[i] = new Array();
		}
		if (drawHidden) {
			var j = -1;
			for (var i = 0; i < hiddenRoutes.length; i++) {
				if (hiddenRoutes[i].hasOwnProperty('isCenter') && j < SALES_MEN - 1) {
					j++;
					routes[j].push(hiddenRoutes[i])
				} else {
					routes[j].push(hiddenRoutes[i])
				}
			}
			for (var i = 0; i < routes.length; i++) {
				drone++;
				addinfo("第"+drone+"号无人机执行巡查任务,预计巡查距离为:"+routeDistance(routes[i]));
			}
			move(routes);
		} else {
			var index = -1;
			for (var i = 0; i < best.length; i++) {
				if (best[i] < SALES_MEN) {
					index = i;
					break;
				}
			}
			var newBest = best.slice(index, best.length).concat(best.slice(0, index));
			for (var i = 0, j = -1; i < newBest.length; i++) {
				if (newBest[i] < SALES_MEN) {
					if (j >= 0) {
						routes[j].push(points[newBest[routesIndex[j]]]);
					}
					j++;
					routes[j].push(points[newBest[i]]);
					routesIndex[j] = i;
				} else {
					routes[j].push(points[newBest[i]]);
				}
			}
			routes[j].push(points[newBest[routesIndex[routesIndex.length - 1]]]);
			for (var i = 0; i < routes.length; i++) {
				drone++;
				addinfo("第"+drone+"号无人机执行巡查任务,预计巡查距离为:"+routeDistance(routes[i]));
			}
			move(routes);
		}
}

//初始化数据
function initData() {
	running = false; // 控制程序运行
	POPULATION_SIZE = 200; //种群大小
	ELITE_RATE = 0.3; //精英率
	CROSSOVER_PROBABILITY = 0.9; //交叉概率
	hitung_u(); //
	hitung_z();
	MUTATION_PROBABILITY = bobot(); //变异率
	//MUTATION_PROBABILITY = 0.1; //变异率
	// console.log(bobot());
	UNCHANGED_GENS = 0; //无变化代数
	mutationTimes = 0; //变异次数
	doPreciseMutate = true; //精确变异

	ratio = area_y / 800; //比例尺换算
	routeLenth = 0; //路径长度

	bestValue = undefined; // 最佳路径距离
	best = []; //最佳路径[12312563]
	currentGeneration = 0; //当前
	currentBest; //一代中 最优解
	population = []; //种群 [[],[],[]]
	values = new Array(POPULATION_SIZE); //记录种群的路径距离
	fitnessValues = new Array(POPULATION_SIZE); //记录种群适应度
	roulette = new Array(POPULATION_SIZE); //轮盘值
}


//添加随机点
function addRandomPoints(number) {
	allPoint = (area_x / width_X) * (area_y / height_Y) - hidden.length;
	if (points.length == allPoint) {
		return;
	} else {
		number = (allPoint - points.length) > number ? number : allPoint - points.length;
	}
	running = false;
	for (var i = 0; i < number; i++) {
		var point = randomPoint();
		point.x = point.x - point.x % (800 / (area_x / width_X)) + 0.5 * (800 / (area_x / width_X));
		point.y = point.y - point.y % (800 / (area_y / height_Y)) + 0.5 * (800 / (area_y / height_Y));
		if (unique(points, point) === true && unique(hidden, point) === true) {
			points.push(point);
		} else {
			i--;
		}
	}
	if (points.length == number) {
		for (var i = 0; i < SALES_MEN; i++) {
			points[i].isCenter = true;
		}
	}
}


function unique(arr, point) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].x == point.x && arr[i].y == point.y) {
			return i;
		}
	}
	return true;
}


//画图
function draw() {
	if (running) {
		GANextGeneration();
		$('#status').html(
		`
		<p>一共有${points.length - 1}个收搜地点和${SALES_MEN}架无人机</p>
		<p>第${currentGeneration}代收搜结果.和${mutationTimes}次变异</p> 
		<p>最佳评价值:${~~(bestValue)}.路径长度${routeLenth}</p> 
		`
		)
	} else if (running === false && currentGeneration !== 0) {
		$('#status').html(
		`
		<p>一共有${points.length - 1}个收搜地点和${SALES_MEN}架无人机</p>
		<p>第${currentGeneration}代收搜结果.和${mutationTimes}次变异</p> 
		<p>最佳评价值:${~~(bestValue)}.路径长度${routeLenth}</p> 
		`
		)
		// Nilai mutasinya adalah 
	} else {
		$('#status').html(`<p>一共有${points.length}个收搜地点和${SALES_MEN}架无人机</p>`);
	}
	clearCanvas();
	drawGrid();
	//画障碍
	if (hidden.length > 0) {
		for (var i = 0; i < hidden.length; i++) {
			drawHiddenArea(hidden[i]);
		}
	}
	if (points.length > 0) {
		for (var i = 0; i < points.length; i++) {
			drawCircle(points[i]);
		}

		var drawBest = best.clone();
		var statPoint = [];
		var index = -1;
		for (var i = 0; i < drawBest.length; i++) {
			if (drawBest[i] < SALES_MEN) {
				currentStartPoint = drawBest[i];
				index = i;
				var frontIndivial = drawBest.slice(0, index);
				break;
			}
		}
		drawBest = drawBest.slice(index).concat(frontIndivial);

		if (running || currentGeneration !== 0) {
			var index = drawBest[0];
			for (var i = 1; i < drawBest.length; i++) {
				if (drawBest[i] < SALES_MEN) {
					drawBest.splice(i, 0, index);
					i++;
					index = drawBest[i];
				}
			}
			drawBest.push(index);
		}
		if (drawHidden) {
			drawAvoidHidden(drawBest);
		} else if (drawBest.length === (points.length + SALES_MEN) && drawBest.length !== 0) {
			//console.log("QQQ");
			drawLines(drawBest);
		}
	}
	drawTargetPoint();
}


