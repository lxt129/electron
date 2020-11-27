//-------------------引入electron的dialog-------------------
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

var surveyShow = []; //显示探测时机

var drawLineFlag = false;


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
var maxSubPath;
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
var total = 10;  //总数
var drones = 10; //无人机个数
var ship = 0; //无人船个数
var submarine = 0;//无人潜艇
var resourcesTotal = 99 //总资源数
var surveyResources = 33;//探测资源数量
var roundUpResources = 33;//围捕资源数量
var attackResources = 33;//打击资源数量

var droneSpeed = 200; //无人机速度
var droneMaxTime = 15; //无人机最大运动时间
var droneMaxLoad = 2;  //无人机最大负载
var shipSpeed = 200; //无人船速度
var shipMaxTime = 15; //无人船最大运动时间
var shipMaxLoad = 2;  //无人船最大负载
var submarineSpeed = 200; //无人潜艇速度
var submarineMaxTiem = 15; //无人潜艇最大运动时间
var submarineMaxLoad = 2;  //无人潜艇最大负载



var surveyRequirement = 1; 	//探测任务需要设备
var roundUpRequirement = 2;	//围捕任务需要设备
var attackRequirement = 3;	//打击任务需要设备
var surveyTime = 0;   //探测任务所需时间
var roundUpTime = 1000;  //围捕任务所需时间
var attackTime = 1000;   //打击任务所需时间
var surveyUseResrouce = 0; //探测任务所需资源
var attackUseResrouce = 2; //打击任务所需资源
//var roundUpUseResrouce = 0

var taskProgramme = 1;//任务方案
var taskEquipment = 1;//任务设备
var taskType = 1; //任务类型（1探测、2围捕、3打击）
// var hitRate = 50
// var surroundRate = 35
var tableData = [];


$(function() {
	init();
	initData();
	
	$('#addRandom_btn').click(function() {
		addRandomPoints(20);
		$('#status').text("");
		running = false;
	});

	$('#start_btn').click(function() {
		initTableData(taskEquipment);
		if (points.length >= 3) {
			initData();
			GAInitialize();
			while(currentGeneration <= 1000){
				GANextGeneration();
				console.log(currentGeneration)
			}
			//判断大致需要的无人设备数量
			SALES_MEN = Math.ceil(routeLenth/(droneSpeed * (droneMaxTime*0.8)));
			//console.log(SALES_MEN)
			MTSP();
		} else {
			alert("请在地图上添加更多的点!");
		}
	});

	function MTSP(){
		initData();
		GAInitialize();
		running = true;
		drawHidden = false;
	}

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
		if(drawLineFlag == false){
			layer.msg('请先规划路线！', {icon: 5}); 
			return;
		}
		running = false;
		let max = getMaxSubPath(best,SALES_MEN)
		console.log(max,droneSpeed * droneMaxTime)
		if(max > droneSpeed * droneMaxTime){
			layer.msg('路线超过设备的最大行驶距离，已为您重新规划路径！', {icon: 5}); 
			SALES_MEN++
			MTSP();
		}
		$("#infoDiv").empty();
		tools.messageComfirm()
		//添加任务
		for(let i=0;i < total; i++){
			tableData[i].taskType = taskType;
			tableData[i].currentPosition = "("+~~(points[0].x) +","+~~(points[0].y)+")";
		}
		tools.initTable();
	})

	$('#carryOutTask').click(function(){
		var newPoints = [];
		newPoints.push(points[0]);
		for(let i = 0; i < points.length; i++){
			if(points[i].hasOwnProperty('isTarget')||points[i].hasOwnProperty('isTargetUnfind')){
				let point = new Point(points[i].x,points[i].y)
				newPoints.push(point);
			}
		}
		points = newPoints;
		SALES_MEN = 1;
		MTSP();

	})
});

function MoveProgress(){
	maxSubPath = getMaxSubPath(best,SALES_MEN)
	let htmllet = `
	<div id="progress">
		<p>探测任务执行进度</p>
		<div class="layui-progress" lay-filter="progress">
			<div class="layui-progress-bar" lay-percent="0%" lay-showPercent="true"></div>
		</div>
	</div>
	`;
	for(let i=0;i< SALES_MEN;i++){
		htmllet = htmllet + `<div id="device${i}" style="display:block;margin-top:5px"></div>`
	}
	$('#infoDiv').append(htmllet);
	
	tools.startProgress();
		target = 0;//目标数
		drone = 0; //无人机数
		$('#info').val('');
		addinfo("巡查任务开始...");
		// for (var i = 0; i < 3; i++) {
		// 	var rand = randomNumber(points.length);
		// 	if(rand < SALES_MEN){
		// 		rand = randomNumber(points.length);
		// 	}
		// 	points[rand].isTargetUnfind = true;
		// }
		
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
				if (best[i] <= 0) {
					index = i;
					break;
				}
			}
			var newBest = best.slice(index, best.length).concat(best.slice(0, index));
			for (var i = 0, j = -1; i < newBest.length; i++) {
				if (newBest[i] <= 0) {
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
	POPULATION_SIZE = 100; //种群大小
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
		for (var i = 0; i < 1; i++) {
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
	// if (hidden.length > 0) {
	// 	for (var i = 0; i < hidden.length; i++) {
	// 		drawHiddenArea(hidden[i]);
	// 	}
	// }
	//画探测时机
	if(surveyShow.length > 0){
		for(let i = 0; i < surveyShow.length;i++){
			//console.log("!!!!!")
			drawSurveyShow(surveyShow[i]);
		}
	}
	if (points.length > 0) {
		for (var i = 0; i < points.length; i++) {
		  drawCircle(points[i]);
		}
		if (best.length - SALES_MEN + 1 === points.length) {
		  drawLineFlag = true
		  drawLines(best);
		}
	}
	drawTargetPoint();
}


//初始化数据表格
function initTableData(taskEquipment){
	tableData = [];
	if(taskEquipment == 1){
		let i = 0;
		for(i;i < drones;i++){
			var deviceInfo = new info(i + 1,"无人机",null,null,droneSpeed,null,droneMaxLoad,droneMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship;i++){
			var deviceInfo = new info(i + 1,"无人船",null,null,shipSpeed,null,shipMaxLoad,shipMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship + submarine;i++){
			var deviceInfo = new info(i + 1,"无人潜艇",null,null,submarineSpeed,null,submarineMaxLoad,submarineMaxTiem,null,"未启用");
			tableData.push(deviceInfo);
		}
	}else if(taskEquipment == 2){
		let i = 0;
		for(i;i < ship;i++){
			var deviceInfo = new info(i + 1,"无人船",null,null,shipSpeed,null,shipMaxLoad,shipMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship;i++){
			var deviceInfo = new info(i + 1,"无人机",null,null,droneSpeed,null,droneMaxLoad,droneMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship + submarine;i++){
			var deviceInfo = new info(i + 1,"无人潜艇",null,null,submarineSpeed,null,submarineMaxLoad,submarineMaxTiem,null,"未启用");
			tableData.push(deviceInfo);
		}
	}else if(taskEquipment == 3){
		let i = 0;
		for(i;i < submarine;i++){
			var deviceInfo = new info(i + 1,"无人潜艇",null,null,submarineSpeed,null,submarineMaxLoad,submarineMaxTiem,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + submarine;i++){
			var deviceInfo = new info(i + 1,"无人机",null,null,droneSpeed,null,droneMaxLoad,droneMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship + submarine;i++){
			var deviceInfo = new info(i + 1,"无人船",null,null,shipSpeed,null,shipMaxLoad,shipMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
	}else{
		let i = 0;
		for(i;i < drones;i++){
			var deviceInfo = new info(i + 1,"无人机",null,null,droneSpeed,null,droneMaxLoad,droneMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship;i++){
			var deviceInfo = new info(i + 1,"无人船",null,null,shipSpeed,null,shipMaxLoad,shipMaxTime,null,"未启用");
			tableData.push(deviceInfo);
		}
		for(i;i< drones + ship + submarine;i++){
			var deviceInfo = new info(i + 1,"无人潜艇",null,null,submarineSpeed,null,submarineMaxLoad,submarineMaxTiem,null,"未启用");
			tableData.push(deviceInfo);
		}
	}
	
	tools.initTable();
}

function info(id,type,target,taskType,speed,currentPosition,load,spendTime,timeLeft,status){
	this.id = id;   //编号
	this.type = type; 
	this.target = target;
	this.taskType = taskType;
	this.speed = speed;
	this.currentPosition = currentPosition;
	this.load = load;
	this.spendTime = spendTime;
	this.timeLeft = timeLeft;
	this.status = status;
}

