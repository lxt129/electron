//-------------------引入electron的dialog-------------------
const { remote } = nodeRequire('electron')
const fs = nodeRequire("fs")
const ipc = nodeRequire('electron').ipcRenderer;
//-------------------绘图的全局变量-------------------
var varData = {};
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
var total = 20;  //总数
var drones = 10; //无人机个数
var ship = 5; //无人艇个数
var submarine = 5;//无人潜航器
var resourcesTotal = 1000 //总资源数
var surveyResources = 500;//探测资源数量
//var roundUpResources = 333;//围捕资源数量
var attackResources = 500;//打击资源数量

var droneSpeed = 200; //无人机速度
var droneMaxTime = 25; //无人机最大运动时间
var droneMaxLoad = 40;  //无人机最大负载
var shipSpeed = 200; //无人艇速度
var shipMaxTime = 25; //无人艇最大运动时间
var shipMaxLoad = 40;  //无人艇最大负载
var submarineSpeed = 200; //无人潜航器速度
var submarineMaxTime = 25; //无人潜航器最大运动时间
var submarineMaxLoad = 40;  //无人潜航器最大负载



var surveyRequirement = 1; 	//探测任务需要设备
var roundUpRequirement = 2;	//围捕任务需要设备
var attackRequirement = 2;	//打击任务需要设备
var surveyTime = 100;   //探测任务所需时间
var roundUpTime = 1000;  //围捕任务所需时间
var attackTime = 1000;   //打击任务所需时间
var surveyUseResrouce = 1; //探测任务所需资源
var attackUseResrouce = 10; //打击任务所需资源
//var roundUpUseResrouce = 0

var taskProgramme = 1;//任务方案
var taskEquipment = 1;//任务设备
var taskType = 1; //任务类型（1探测、2围捕、3打击）
// var hitRate = 50
// var surroundRate = 35

var planning = 1;
var sales = 2;
var tableData = [];

//记录探测时机和围捕打击时机
var logbookInfo = [];
var logbook = [];
$(function () {
	//读文件
	fs.readFile('./render/var.json','utf8',(err,data)=>{
		if(err) {
			console.log(err);
			area_y = 800;
			area_x = area_y;
			height_Y = 40;
			width_X = 40;
			total = 20;  //总数
			drones = 10; //无人机个数
			ship = 5; //无人艇个数
			submarine = 5;//无人潜航器
			resourcesTotal = 1000 //总资源数
			surveyResources = 500;//探测资源数量
			//roundUpResources = 333;//围捕资源数量
			attackResources = 500;//打击资源数量

			droneSpeed = 200; //无人机速度
			droneMaxTime = 25; //无人机最大运动时间
			droneMaxLoad = 40;  //无人机最大负载
			shipSpeed = 200; //无人艇速度
			shipMaxTime = 25; //无人艇最大运动时间
			shipMaxLoad = 40;  //无人艇最大负载
			submarineSpeed = 200; //无人潜航器速度
			submarineMaxTime = 25; //无人潜航器最大运动时间
			submarineMaxLoad = 40;  //无人潜航器最大负载



			surveyRequirement = 1; 	//探测任务需要设备
			roundUpRequirement = 2;	//围捕任务需要设备
			attackRequirement = 2;	//打击任务需要设备
			surveyTime = 100;   //探测任务所需时间
			roundUpTime = 1000;  //围捕任务所需时间
			attackTime = 1000;   //打击任务所需时间
			surveyUseResrouce = 1; //探测任务所需资源
			attackUseResrouce = 10; //打击任务所需资源
			
			
			varData.area_y = 800;
			varData.area_x = area_y;
			varData.height_Y = 40;
			varData.width_X = 40;
			varData.total = 20;  //总数
			varData.drones = 10; //无人机个数
			varData.ship = 5; //无人艇个数
			varData.submarine = 5;//无人潜航器
			varData.resourcesTotal = 1000 //总资源数
			varData.surveyResources = 500;//探测资源数量
			
			varData.attackResources = 500;//打击资源数量
			varData.droneSpeed = 200; //无人机速度
			varData.droneMaxTime = 25; //无人机最大运动时间
			varData.droneMaxLoad = 40;  //无人机最大负载
			varData.shipSpeed = 200; //无人艇速度
			varData.shipMaxTime = 25; //无人艇最大运动时间
			varData.shipMaxLoad = 40;  //无人艇最大负载
			varData.submarineSpeed = 200; //无人潜航器速度
			varData.submarineMaxTime = 25; //无人潜航器最大运动时间
			varData.submarineMaxLoad = 40;  //无人潜航器最大负载
			varData.surveyRequirement = 1; 	//探测任务需要设备
			varData.roundUpRequirement = 2;	//围捕任务需要设备
			varData.attackRequirement = 2;	//打击任务需要设备
			varData.surveyTime = 100;   //探测任务所需时间
			varData.roundUpTime = 1000;  //围捕任务所需时间
			varData.attackTime = 1000;   //打击任务所需时间
			varData.surveyUseResrouce = 1; //探测任务所需资源
			varData.attackUseResrouce = 10; //打击任务所需资源

			fs.writeFile("./render/var.json", JSON.stringify(varData), function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
		}else{
			console.log(JSON.parse(data));
			varData = JSON.parse(data)
			area_y = varData.area_y;
			area_x = area_y;
			height_Y = varData.height_Y;
			width_X = varData.width_X;
			total = varData.total;
			drones = varData.drones
			ship = varData.ship
			submarine = varData.submarine
			resourcesTotal = varData.resourcesTotal
			surveyResources = varData.surveyResources
			attackResources = varData.attackResources
			droneSpeed = varData.droneSpeed
			droneMaxTime = varData.droneMaxTime
			droneMaxLoad = varData.droneMaxLoad
			shipSpeed = varData.shipSpeed
			shipMaxTime = varData.shipMaxTime
			shipMaxLoad = varData.shipMaxLoad
			submarineSpeed = varData.submarineSpeed
			submarineMaxTime = varData.submarineMaxTime
			submarineMaxLoad = varData.submarineMaxLoad
			surveyRequirement = varData.surveyRequirement
			roundUpRequirement = varData.roundUpRequirement
			attackRequirement = varData.attackRequirement
			surveyTime = varData.surveyTime
			roundUpTime = varData.roundUpTime
			attackTime = varData.attackTime
			surveyUseResrouce = varData.surveyUseResrouce
			attackUseResrouce = varData.attackUseResrouce
		}
	})
	//全局初始化
	init();
	//算法数据初始化
	initData();
	//随机增加目标点
	$('#addRandom_btn').click(function () {
		addRandomPoints(20);
		$('#status').text("");
		running = false;
	});
	//规划路线
	$('#start_btn').click(function () {
		tools.planning();
	});
	//算法第一轮运行
	function MTSP() {
		initData();
		GAInitialize();
		running = true;
		drawHidden = false;
	}
	//重置按钮
	$('#clear_btn').click(function () {
		running === false;
		initData();
		points = new Array();
		hidden = new Array();
		targetPointHit = new Array();
		targetPointSurround = new Array();
	});
	//暂停、继续按钮
	$('#stop_btn').click(function () {
		if (running === false && currentGeneration !== 0) {
			running = true;
		} else {
			running = false;
		}
	});
	// $('#avoidHidden').click(function () {
	// 	drawHidden = !drawHidden;
	// 	drawAvoidHidden(best);
	// })
	//执行任务动画
	$('#move').click(function () {
		logbookInfo = [];
		logbook = [];
		if (drawLineFlag == false) {
			layer.msg('请先规划路线！', { icon: 5 });
			return;
		}
		running = false;
		let thisSpeed = 0;
        let thisMaxTime = 0
		if(taskEquipment === 1){
            thisSpeed = droneSpeed;
            thisMaxTime = droneMaxTime;
          }else if(taskEquipment === 2){
            thisSpeed = shipSpeed;
            thisMaxTime = shipMaxTime;
          }else{
            thisSpeed = submarineSpeed;
            thisMaxTime = submarineMaxTime;
          }
		let max = getMaxSubPath(best, SALES_MEN)
		if (max > thisSpeed * thisMaxTime) {
			layer.msg('路线超过设备的最大行驶距离,请重新规划路径！'
			, { icon: 5 }
			, function(){
				$('#start_btn').click();
			  }
			);
			//SALES_MEN++;
			//MTSP();
			return;
		}
		$("#infoDiv").empty();
		tools.messageComfirm()
		//添加任务
		// for (let i = 0; i < total; i++) {
		// 	if(i < SALES_MEN){
		// 		tableData[i].taskType = 1;
		// 	}else{
		// 		tableData[i].taskType = taskType;
		// 	}
		// 	tableData[i].currentPosition = "(" + ~~(points[0].x) + "," + ~~(points[0].y) + ")";
		// }
		tools.initTable();
	})

	// $('#carryOutTask').click(function () {
	// 	var newPoints = [];
	// 	newPoints.push(points[0]);
	// 	for (let i = 0; i < points.length; i++) {
	// 		if (points[i].hasOwnProperty('isTarget') || points[i].hasOwnProperty('isTargetUnfind')) {
	// 			let point = new Point(points[i].x, points[i].y)
	// 			newPoints.push(point);
	// 		}
	// 	}
	// 	points = newPoints;
	// 	SALES_MEN = 1;
	// 	MTSP();
	// })
	//显示时序
	$('#showLog').click(function () {
		tools.showLog();
	})
});

//执行任务之前判断操作
function MoveProgress() {
	//maxSubPath = getMaxSubPath(best, SALES_MEN) 
	// let htmllet = `
	// <div id="progress">
	// 	<p>探测任务执行进度</p>
	// 	<div class="layui-progress" lay-filter="progress">
	// 		<div class="layui-progress-bar" lay-percent="0%" lay-showPercent="true"></div>
	// 	</div>
	// </div>
	// `;
	let htmllet = ``;
	for (let i = 0; i < SALES_MEN; i++) {
		htmllet = htmllet + `<div id="device${i}" style="display:block;margin-top:5px"></div>`
	}
	$('#infoDiv').append(htmllet);

	//tools.startProgress();
	target = 0;//目标数
	drone = 0; //无人机数
	$('#info').val('');
	addinfo("巡查任务开始...");
	routes = [];
	for (var i = 0; i < SALES_MEN; i++) {
		routes[i] = new Array();
	}
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
	routes[j].push(points[0]);
	for (var i = 0; i < routes.length; i++) {
		drone++;
		addinfo("第" + drone + "号无人机执行巡查任务,预计巡查距离为:" + routeDistance(routes[i]));
	}
	move(routes);
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
		<p>共有${points.length}个目标点,第${currentGeneration}代收搜结果</p>
		`
		)
	} else if (running === false && currentGeneration !== 0) {
		$('#status').html(
			`
		<p>共有${points.length}个目标点,第${currentGeneration}代收搜结果</p>
		`
		)
		// Nilai mutasinya adalah 
	} else {
		$('#status').html(`<p>共有${points.length}个目标点,未开始</p>`);
	}
	clearCanvas();
	drawGrid();
	if (surveyShow.length > 0) {
		for (let i = 0; i < surveyShow.length; i++) {
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
function initTableData(taskEquipment) {
	let currentresourcesTotal = resourcesTotal;
	tableData = [];
	if (taskEquipment == 1) {
		let i = 0;
		for (i; i < drones; i++) {
			if(currentresourcesTotal > droneMaxLoad){
				currentresourcesTotal -= droneMaxLoad;
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, droneMaxLoad, droneMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, currentresourcesTotal, droneMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship; i++) {
			if(currentresourcesTotal > shipMaxLoad){
				currentresourcesTotal -= shipMaxLoad;
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, shipMaxLoad, shipMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, currentresourcesTotal, shipMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship + submarine; i++) {
			if(currentresourcesTotal > submarineMaxLoad){
				currentresourcesTotal -= submarineMaxLoad;
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, submarineMaxLoad, submarineMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, currentresourcesTotal, submarineMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
	} else if (taskEquipment == 2) {
		let i = 0;
		for (i; i < ship; i++) {
			if(currentresourcesTotal > shipMaxLoad){
				currentresourcesTotal -= shipMaxLoad;
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, shipMaxLoad, shipMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, currentresourcesTotal, shipMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship; i++) {
			if(currentresourcesTotal > droneMaxLoad){
				currentresourcesTotal -= droneMaxLoad;
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, droneMaxLoad, droneMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, currentresourcesTotal, droneMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship + submarine; i++) {
			if(currentresourcesTotal > submarineMaxLoad){
				currentresourcesTotal -= submarineMaxLoad;
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, submarineMaxLoad, submarineMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, currentresourcesTotal, submarineMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
	} else if (taskEquipment == 3) {
		let i = 0;
		for (i; i < submarine; i++) {
			if(currentresourcesTotal > submarineMaxLoad){
				currentresourcesTotal -= submarineMaxLoad;
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, submarineMaxLoad, submarineMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, currentresourcesTotal, submarineMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + submarine; i++) {
			if(currentresourcesTotal > droneMaxLoad){
				currentresourcesTotal -= droneMaxLoad;
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, droneMaxLoad, droneMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, currentresourcesTotal, droneMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship + submarine; i++) {
			if(currentresourcesTotal > shipMaxLoad){
				currentresourcesTotal -= shipMaxLoad;
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, shipMaxLoad, shipMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, currentresourcesTotal, shipMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
	} else {
		let i = 0;
		for (i; i < drones; i++) {
			if(currentresourcesTotal > droneMaxLoad){
				currentresourcesTotal -= droneMaxLoad;
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, droneMaxLoad, droneMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人机", null, null, droneSpeed, null, currentresourcesTotal, droneMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship; i++) {
			if(currentresourcesTotal > shipMaxLoad){
				currentresourcesTotal -= shipMaxLoad;
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, shipMaxLoad, shipMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人艇", null, null, shipSpeed, null, currentresourcesTotal, shipMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
		for (i; i < drones + ship + submarine; i++) {
			if(currentresourcesTotal > submarineMaxLoad){
				currentresourcesTotal -= submarineMaxLoad;
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, submarineMaxLoad, submarineMaxTime, null, "未启用");
			}else{
				var deviceInfo = new info(i + 1, "无人潜航器", null, null, submarineSpeed, null, currentresourcesTotal, submarineMaxTime, null, "未启用");
				currentresourcesTotal = 0;
			}
			tableData.push(deviceInfo);
		}
	}

	tools.initTable();
}

function initTableDataTaskType(index) {
	for (let i = 0; i < tableData.length; i++) {
		if(i < SALES_MEN){
			tableData[i].taskType = 1;
		}else{
			tableData[i].taskType = Number(index);
		}
	}

}

function info(id, type, target, taskType, speed, currentPosition, load, spendTime, timeLeft, status) {
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

