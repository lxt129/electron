let timer = 0
//let cvs = document.getElementById('canvas')
//let ctx = cvs.getContext('2d')
//let allPoints = [] //已经运动过的数据
let animatePoint = [] //当前运动点位置
let nextPointIndex = [] //下一个运动点的index
let startTime = [] //每条路径的时间表(用来计算点的位置)
let targetNum = [] //计算每条路径上目标点的个数
let targetPointHit = []; //目标点执行任务情况
let targetPointSurround = []; //目标点执行任务情况
let type = [];
let speed = 200;
let goTaskNumner = 0;
let status = [];
let estimatedTime = [];
let timeSpent = [];


let newAddRoute = [];
let nextTarget = [];
let flag = 0;
let taskFalg = 0;
let taskFinish = false;
let taskSort = [];
let taskStatusIndex = [];
let endFlag = 0;
let startPoint;
let sleep = 0;

let target = 0;
let drone = 0;

//开始运动
//move(routes)

function move(routes) {
	status = [];
	drone = 0;
	target = 0;
	newAddRoute = [];
	nextTarget = [];
	taskFalg = 0;
	flag = 0;
	endFlag = 0;
	startPoint = {};
	taskFinish = false;
	taskSort = [];
	taskStatusIndex = [];
	goTaskNumner = 0;
	if(taskEquipment === 1){
		speed = droneSpeed;
	}else if(taskEquipment === 2){
		speed = shipSpeed
	}else{
		speed = submarineSpeed;
	}
	if(taskType === 1){
		sleep = surveyTime;
	}else if(taskType === 2){
		sleep = roundUpTime;
	}else{
		sleep = attackTime;
	}
	for (var i = 0; i < SALES_MEN; i++) {
		var point = new Point(routes[i][0].x, routes[i][0].y);
		animatePoint[i] = {
			x: point.x,
			y: point.y,
		}
		targetNum[i] = 3;
		status[i] = false;
	}
	for (var i = 0; i < SALES_MEN; i++) {
		nextPointIndex[i] = 1;
	}
	// ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight)
	for (var i = 0; i < SALES_MEN; i++) {
		if (routes[i].length > 0) {
			drawPoint(routes[i][0].x, routes[i][0].y)
		}
	}
	this.startTimer()
}

function startTimer(index) {
	if (index != undefined) {
		startTime[index] = new Date().getTime()
	} else {
		for (var i = 0; i < routes.length; i++) {
			startTime[i] = new Date().getTime()
		}
	}


	if (routes.length > 0) {
		this.clearTimer()
		this.animate()
	}
}

function clearTimer() {
	window.cancelAnimationFrame(timer)
}

function animate() {
	//  if(nextPointIndex[] >= routes.length)
	// return;
	timer = window.requestAnimationFrame(animate)
	startMove()
}

let targetDistance = [];
let currentDistance = [];
let end = 0;

function startMove() {
	for (let i = 0; i < routes.length; i++) {
		//------------------------------------------资源最少方案------------------------------------------
		if(taskProgramme === 1){
			//发现目标点后派出无人机 条件一 路径长度 > 1 条件2 上一个点是目标点 条件3 是否为最后一个点  条件4不是探测任务 
			if (routes[i].length > 0 && routes[i][nextPointIndex[i] - 1].hasOwnProperty('isTarget') == true && nextPointIndex[i] == routes[i].length&& taskType !==1 && targetNum[i] < 3) {
				taskFalg++;
				if(targetNum[i] <= 1){
					if(routes[i][nextPointIndex[i] - 1].isHit >= 0){
						routes[i][nextPointIndex[i] - 1].isHit += 1
					}else if(routes[i][nextPointIndex[i] - 1].isSurround >= 0){
						routes[i][nextPointIndex[i] - 1].isSurround += 1
					}
				}
				targetNum[i] = targetNum[i] + 3;
				if(taskFalg == newAddRoute.length){
					taskFalg = 0;
					taskSort.push(routes[i][nextPointIndex[i] - 1])
					setTimeout(function(){
						taskFinish = true;
						if(taskType === 2){
							taskSort[0].isSurround = 0;
						}else{
							taskSort[0].isHit = 0;
						}
						taskSort[0].isComplete = true;
						taskSort.shift();
					},sleep,i) 
				}
				continue;
			}

			if(newAddRoute.length > 0 && taskFinish && nextTarget.length > 0){
				let point;
				let t;
				let minIndex = 0;
				let min = distance(nextTarget[0],routes[i][routes[i].length - 1]);
				for(let a =1; a < nextTarget.length; a++){
					t = distance(nextTarget[a],routes[i][routes[i].length - 1])
					if(t < min){
						min = t;
						minIndex = a
					}
				}
				point = nextTarget[minIndex];
				for(let a = 0; a < newAddRoute.length; a++){
					if(newAddRoute[a] === i && nextPointIndex[i] > routes[i].length - 1 && nextTarget.length > 0){
						flag++;
						addRoute3(newAddRoute[a],routes[newAddRoute[a]][routes[newAddRoute[a]].length -1],point);
						targetNum[newAddRoute[a]] = 0;
					}
				}
				if(flag == newAddRoute.length){
					flag = 0;
					nextTarget.splice(minIndex,1);
					taskFinish = false;
				}
			}
		}else{
		//------------------------------------------时间最少方案------------------------------------------
			//发现目标点后派出无人机 条件一 路径长度 > 1 条件2 上一个点事目标点  条件3 不是探测任务 
			if (routes[i].length > 0 && routes[i][nextPointIndex[i] - 1].hasOwnProperty('isTarget') == true && nextPointIndex[i] == routes[i].length&& taskType !==1 && targetNum[i] < 3) {
				
				taskFalg++;
				if(targetNum[i] <= 1){
					if(routes[i][nextPointIndex[i] - 1].isHit >= 0){
						routes[i][nextPointIndex[i] - 1].isHit += 1
						//console.log(i,targetNum[i],routes[i][nextPointIndex[i] - 1].isHit)
					}else if(routes[i][nextPointIndex[i] - 1].isSurround >= 0){
						routes[i][nextPointIndex[i] - 1].isSurround += 1
					}
				}
				targetNum[i] = targetNum[i] + 3;
				let a = -1;
				//判断任务是否完成 status[a] = true;为完成
				if(taskType === 2){
					if(taskFalg === roundUpRequirement){
						a = Math.floor((i - SALES_MEN)/roundUpRequirement);
						status[a] = true;
						taskFalg = 0;
					}
				}else if(taskType === 3){
					if(taskFalg === attackRequirement){
						a = Math.floor((i - SALES_MEN)/attackRequirement);
						status[a] = true;
						taskFalg = 0;
					}
				}
				//console.log(i,taskFalg,status[a])
				for(let a = 0;a < status.length;a++){
					if(status[a] === true){
						status[a] = false;
						taskStatusIndex.push(a);
						taskSort.push(routes[i][nextPointIndex[i] - 1])
						setTimeout(function(){
							taskFinish = true;
							if(taskType === 2){
								taskSort[0].isSurround = 0;
							}else{
								taskSort[0].isHit = 0;
							}
							taskSort[0].isComplete = true;
							taskSort.shift();
							status[taskStatusIndex[0]] = true;
							taskStatusIndex.shift();

						},sleep) 
					}
				}
				continue;
			}
		
			let end = 0;
			for(let a = 0;a < SALES_MEN;a++){
				if(nextPointIndex[a] > routes[a].length - 1 ){
					end++;
				}
			}
			//回基地
			if(end == SALES_MEN){
				let c;
				c =  taskType === 2 ? roundUpRequirement : attackRequirement;
				let d;
				let e;
				for(let a = 0;a < status.length;a++){
					if(status[a] === true){
						console.log(a)
						d = a;
						e = a*c + SALES_MEN;
						for(let b = 0;b < c;b++){
							console.log(status[a])
							addRoute3(e + b,routes[e + b][routes[e + b].length -1],routes[0][0]);
							console.log(routes[e + b])
						}
						status[d] = false;
					}
				}
			}
		}


		
		//***********************************************发现目标点***********************************************
		if (routes[i].length > 0 && routes[i][nextPointIndex[i] - 1].hasOwnProperty('isTargetUnfind') == true && routes[i][nextPointIndex[i] - 1].isTarget !== true) {
			routes[i][nextPointIndex[i] - 1].isTarget = true;
			targetNum[i] += 3;
			target++;
			//------------------------------------------资源最少方案------------------------------------------
			if(taskProgramme === 1){
				//探测任务  taskType:任务类型 1 探测 2围捕 3打击
				if(taskType === 1 && targetNum[i] === 1){
					addinfo("发现"+target+"号目标!!!");
				}else if(taskType === 2) { //围捕任务
					addinfo("发现"+target+"号目标!!!");
					addinfo("进行围捕任务");
					routes[i][nextPointIndex[i] - 1].isSurround = 0;
					targetPointSurround.push(routes[i][nextPointIndex[i] - 1]);
					let k = roundUpRequirement;
					if(target === 1){
						while(k > 0){
							newAddRoute.push(addRoute(routes[i][nextPointIndex[i] - 1]));
							k = k - 1;
						}
					}else{
						nextTarget.push(routes[i][nextPointIndex[i] - 1]);	
					}
				}else if (taskType === 3) {//打击任务
					addinfo("发现"+target+"号目标!!!");
					addinfo("进行打击任务");
					routes[i][nextPointIndex[i] - 1].isHit = 0;
					targetPointHit.push(routes[i][nextPointIndex[i] - 1]);
					let k = attackRequirement;
					if(target === 1){
						while(k > 0){
							newAddRoute.push(addRoute(routes[i][nextPointIndex[i] - 1]));
							k = k - 1;
						}
					}else{
						nextTarget.push(routes[i][nextPointIndex[i] - 1]);	
					}
				} 
			}else if(taskProgramme === 2){
			//------------------------------------------时间最少方案------------------------------------------
				//探测任务  taskType:任务类型 1 探测 2围捕 3打击
				if(taskType === 1 && targetNum[i] === 1){
					addinfo("发现"+target+"号目标!!!");
				}else if(taskType === 2) { //围捕任务
					addinfo("发现"+target+"号目标!!!");
					addinfo("进行围捕任务");
					routes[i][nextPointIndex[i] - 1].isSurround = 0;
					targetPointSurround.push(routes[i][nextPointIndex[i] - 1]);
					let k = roundUpRequirement;
					if(target === 1){
						while(k > 0){
							newAddRoute.push(addRoute(routes[i][nextPointIndex[i] - 1]));
							k = k - 1;
						}
					}else{
						let key = false;
						nextTarget.push(routes[i][nextPointIndex[i] - 1]);
						let point = nextTarget[nextTarget.length - 1];
						let min = Number.MAX_VALUE;
						let indexSelect = -1;
						let x;
						let t;
						for(let a = 0;a < status.length; a++){
							if(status[a] === true){
								x = a;
								a = a * roundUpRequirement + SALES_MEN
								t = distance(routes[a][routes[a].length -1],point)
								if(t < min){
									min = t;
									indexSelect = x;
									key = true;
								}
								
							}
						}
						for(let a = 0;a < SALES_MEN;a++){
							t = distance(routes[a][0],point);
							if(t < min){
								min = t;
								indexSelect = a;
								key = false;
							}
						}
						if(key === false){
							let a = -1;
							while(k > 0){
								a = addRoute(routes[i][nextPointIndex[i] - 1])
								newAddRoute.push(a);
								k = k - 1;
							}
							status[goTaskNumner] = false;
							goTaskNumner++;
						}else{
							let c = indexSelect ;
							a = indexSelect * roundUpRequirement + SALES_MEN
							for(let b = 0;b < roundUpRequirement; b++){
								console.log(a + b,routes[a + b])
								addRoute3(a + b,routes[a + b][routes[a + b].length -1],point);
								targetNum[a + b] = 0;
							}
							status[c] = false;
							break;
						}

					}
				}else if (taskType === 3) {//打击任务
					addinfo("发现"+target+"号目标!!!");
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
					addinfo("进行打击任务");
					routes[i][nextPointIndex[i] - 1].isHit = 0;
					targetPointHit.push(routes[i][nextPointIndex[i] - 1]);
					let k = attackRequirement;
					if(target === 1){
						let a = -1;
						while(k > 0){
							a = addRoute(routes[i][nextPointIndex[i] - 1])
							newAddRoute.push(a);
							k = k - 1;
						}
						status[goTaskNumner] = false;
						goTaskNumner++;
					}else{
						let key = false;
						nextTarget.push(routes[i][nextPointIndex[i] - 1]);
						let point = nextTarget[nextTarget.length - 1];
						let min = Number.MAX_VALUE;
						let indexSelect = -1;
						let x;
						let t;
						for(let a = 0;a < status.length; a++){
							if(status[a] === true){
								x = a;
								a = a * attackRequirement + SALES_MEN
								t = distance(routes[a][routes[a].length -1],point)
								if(t < min){
									min = t;
									indexSelect = x;
									key = true;
								}
								
							}
						}
						for(let a = 0;a < SALES_MEN;a++){
							t = distance(routes[a][0],point);
							if(t < min){
								min = t;
								indexSelect = a;
								key = false;
							}
						}
						if(key === false){
							let a = -1;
							while(k > 0){
								a = addRoute(routes[i][nextPointIndex[i] - 1])
								newAddRoute.push(a);
								k = k - 1;
							}
							status[goTaskNumner] = false;
							goTaskNumner++;
						}else{
							let c = indexSelect ;
							a = indexSelect * attackRequirement + SALES_MEN
							for(let b = 0;b < attackRequirement; b++){
								addRoute3(a + b,routes[a + b][routes[a + b].length -1],point);
								targetNum[a + b] = 0;
							}
							status[c] = false;
							break;
						}
					}
				}
			}
		}

		
		//判断探测是否完毕
		if(i < SALES_MEN){
			endFlag = 0;
			for(let a = 0; a < SALES_MEN; a++){
				if(nextPointIndex[a] > routes[a].length - 1){
					endFlag++;
				}else{
					break;
				}
			}
			//探测完毕返回基地
			if(endFlag === SALES_MEN){
				if(nextTarget.length == 0){
					nextTarget.push(startPoint);	
				}
			}
		}
		
		if (nextPointIndex[i] > routes[i].length - 1) {
			end = 0;
			for (let a = 0; a < SALES_MEN; a++) {
				if (nextPointIndex[a] > routes[a].length - 1) {
					end++;
				} else {
					break;
				}
			}
			if (end == routes.length) {
				console.log("move end!!!")

				clearTimer();
			}
			continue;
		}
		targetDistance[i] = Math.sqrt(
			Math.pow(routes[i][nextPointIndex[i] - 1].x - routes[i][nextPointIndex[i]].x, 2) +
			Math.pow(routes[i][nextPointIndex[i] - 1].y - routes[i][nextPointIndex[i]].y, 2),
		)
		currentDistance[i] = Math.sqrt(
			Math.pow(routes[i][nextPointIndex[i] - 1].x - animatePoint[i].x, 2) +
			Math.pow(routes[i][nextPointIndex[i] - 1].y - animatePoint[i].y, 2),
		)

		if (currentDistance[i] >= targetDistance[i]) {
			//利用运动距离与目标距离, 判断运动的点是否超过下一个目标点, 超过了就重置下一个点
			startTime[i] = new Date().getTime()

			animatePoint[i] = {
				x: routes[i][nextPointIndex[i]].x,
				y: routes[i][nextPointIndex[i]].y,
			}
			nextPointIndex[i]++

			clearTimer();

			startTimer(i);
			
			//重绘
			//ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight)
			//drawPolygon(allPoints)
			drawPoint(animatePoint[i].x, animatePoint[i].y, 'blue')
			return
		}

		if (nextPointIndex[i] > routes[i].length - 1) {
			//轨迹运动结束后, 关闭timer
			clearTimer();
			continue;
		} else {
			let deltaTime = new Date().getTime() - startTime[i]
			let deltaDistance = deltaTime * (speed/1000); 
			let rate = deltaDistance / targetDistance[i]
			let x =
				routes[i][nextPointIndex[i] - 1].x +
				(routes[i][nextPointIndex[i]].x - routes[i][nextPointIndex[i] - 1].x) * rate
			let y =
				routes[i][nextPointIndex[i] - 1].y +
				(routes[i][nextPointIndex[i]].y - routes[i][nextPointIndex[i] - 1].y) * rate
			//重绘, 将animatePoint设为轨迹的下一个点, 以达到动态的效果
			animatePoint[i].x = x
			animatePoint[i].y = y
			
			drawPoint(animatePoint[i].x, animatePoint[i].y, 'blue')
		}
	}
}

function drawTargetPoint() {
	for (var i = 0; i < targetPointHit.length; i++) {
		var a = targetPointHit[i].isHit;
		if(a >= 1){
			drawPoint(targetPointHit[i].x - width_X*0.5, targetPointHit[i].y, "black")
		}
		if(a >= 2){
			drawPoint(targetPointHit[i].x + width_X*0.5, targetPointHit[i].y, "black")
		}
		if(a >= 3){
			drawPoint(targetPointHit[i].x , targetPointHit[i].y - height_Y*0.5, "black")
		}
		if(a >= 4){
			drawPoint(targetPointHit[i].x, targetPointHit[i].y + height_Y*0.5, "black")
		}
	}
	for (var i = 0; i < targetPointSurround.length; i++) {
		var a = targetPointSurround[i].isSurround;
		if(a >= 1){
			drawPoint(targetPointSurround[i].x - width_X*0.5, targetPointSurround[i].y, "blue")
		}
		if(a >= 2){
			drawPoint(targetPointSurround[i].x + width_X*0.5, targetPointSurround[i].y, "blue")
		}
		if(a >= 3){
			drawPoint(targetPointSurround[i].x , targetPointSurround[i].y - height_Y*0.5, "black")
		}
		if(a >= 4){
			drawPoint(targetPointSurround[i].x, targetPointSurround[i].y + height_Y*0.5, "black")
		}
	}
}

function drawPoint(x, y, color) {
	var img;
	if(taskEquipment === 1){
		if(taskType !== 3){
			img=document.getElementById("drones");;
		}else{
			img=document.getElementById("dronesWithArms");
		}
	}else if(taskEquipment === 2){
		if(taskType !== 3){
			img=document.getElementById("ship");
		}else{
			img=document.getElementById("shipWithArms");
		}
	}else if(taskEquipment === 3){
		if(taskType !== 3){
			img=document.getElementById("submarine");
		}else{
			img=document.getElementById("submarineWithArms");
		}
	}
	ctx.drawImage(img,x - 10,y - 10,20,20);
}

//改变路径
function changeRoute(index, currentPoint) {
	//新路
	routes[index] = routes[index].splice(currentPoint, routes[index].length).reverse();
	let k = 0
	if(routes[index][0].isCenter != true){
		var point = routes[index].shift();
		routes[index].unshift(points[0]);
		k = 1;
		console.log("!!!!");
	}
	// routes[index] = routes[index].splice(currentPoint, routes[index].length).reverse();
	// routes[index].pop();
	// console.log(routes[index])
	// routes[index].push(routes[index][0]);
	
	// routes[index].splice(0, routes[index].length);
	// for(var i=0;i<routes.length;i++){
	// 	nextPointIndex[i] = nextPointIndex[i]
	// }
	//添加路径的一些参数更新
	addRouteParams(index);
	if(k == 1){
		addRoute(point);
	}
}


//给定结束点，选定最近的出发点
function addRoute(targetPoint) {
	let min = 9999999;
	let res = -1;
	for (var i = 0; i < SALES_MEN; i++) {
		if (min > distance(points[i], targetPoint)) {
			min = distance(points[i], targetPoint);
			res = i;
		}
	}
	routes[routes.length] = new Array();
	routes[routes.length - 1].push(points[res]);
	routes[routes.length - 1].push(targetPoint);
	targetNum[routes.length - 1] = 0;
	startPoint = points[res];
	drone++;
	addinfo("第"+drone+"号无人机执行任务,预计距离为:"+routeDistance(routes[routes.length - 1])+"(不包括到达目的点后执行任务的距离和返回基地距离)");
	addRouteParams(routes.length - 1);
	return routes.length - 1;
}

function addRoute2(subRoute) {
	if (subRoute.length > 0) {
		subRoute.pop();
	}else{
		return;
	}
	subRoute = subRoute.reverse();
	let min = 999999;
	let res = -1;
	let sum = 0;
	for (var i = 0; i < SALES_MEN; i++) {
		sum = 0;
		for (var j = 1; j < subRoute.length; j++) {
			sum += distance(subRoute[j], subRoute[j - 1])
		}
		console.log(subRoute[0], subRoute[subRoute.length - 1])
		sum +=  distance(points[i], subRoute[0]) 
		if (min > sum) {
			min = sum;
			res = i;
		}
	}
	routes[routes.length] = new Array();
	routes[routes.length - 1].push(points[res])
	routes[routes.length - 1] = routes[routes.length - 1].concat(subRoute)
	targetNum[routes.length - 1] = 0;
	addRouteParams(routes.length - 1);
}

//给定出发点和结束点
function addRoute3(index,startPoint,targetPoint) {
	
	routes[index].splice(0, routes[index].length);
	routes[index].push(startPoint);
	routes[index].push(targetPoint);
	//addinfo("第"+drone+"号无人机执行任务,预计距离为:"+routeDistance(routes[routes.length - 1])+"(不包括到达目的点后执行任务的距离和返回基地距离)");
	addRouteParams(index);
}

function addRouteParams(index) {
	nextPointIndex[index] = 1;
	animatePoint[index] = {
		x: routes[index][0].x,
		y: routes[index][0].y,
	}
	startTime[index] = new Date().getTime()
}

function addinfo(str){
	if($('#info').val() == ''){
		$('#info').val(str);
	}else{
		$('#info').val($('#info').val() +'\n'+str);
	}
	var height=$("#info")[0].scrollHeight;
	$("#info").scrollTop(height);
}