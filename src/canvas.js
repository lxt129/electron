//初始化画布
function init() {
	ctx = $('#canvas')[0].getContext("2d");
	cvs = document.getElementById('canvas')
	WIDTH = $('#canvas').width();
	HEIGHT = $('#canvas').height();

	//每隔10ms,调用draw()进行画图
	setInterval(draw, 10);
	//监听鼠标事件
	init_mouse();
}

function init_mouse() {
	canvas = document.getElementsByTagName("canvas")[0]
	wrap.oncontextmenu = canvas.oncontextmenu = function(evt) {
		event.preventDefault();
		canvasMinX = $("#canvas").offset().left;
		canvasMinY = $("#canvas").offset().top;
		x = evt.pageX - canvasMinX;
		y = evt.pageY - canvasMinY;
		x = x - x % (800 / (area_x / width_X)) + 0.5 * (800 / (area_x / width_X));
		y = y - y % (800 / (area_y / height_Y)) + 0.5 * (800 / (area_y / height_Y));
		x = x % 800;
		y = y % 800;
		point = new Point(x, y);
		// if (unique(points, point) !== true) {
		// 	alert("该区域有目标点,无法添加障碍!");
		// 	return;
		// }
		// if (unique(hidden, point) !== true) {
		// 	let i = unique(hidden, point);
		// 	hidden.splice(i, 1);
		// } else {
		// 	hidden.push(point);
		// }
		let key = findPoint(points,point)
		if(key !== false){
			console.log("!!!")
			points[key].isTargetUnfind = true;
		}
		
		return false;
	}
	$("canvas").click(function(evt) {
		if (!running) {
			canvasMinX = $("#canvas").offset().left;
			canvasMinY = $("#canvas").offset().top;
			$('#status').text("");

			x = evt.pageX - canvasMinX;
			y = evt.pageY - canvasMinY;
			x = x - x % (800 / (area_x / width_X)) + 0.5 * (800 / (area_x / width_X));
			y = y - y % (800 / (area_y / height_Y)) + 0.5 * (800 / (area_y / height_Y));
			x = x % 800;
			y = y % 800;
			point = new Point(x, y);
			if (unique(hidden, point) !== true) {
				alert("该区域有障碍,无法添加目标点");
				return;
			}
			if (unique(points, point) == 0) {
				//起始点无法删除
			} else if (unique(points, point) !== true) {
				let i = unique(points, point);
				points.splice(i, 1);
			} else {
				points.push(point);
			}

			if (points.length <= 1) {
				points[0].isCenter = true;
			}
		}
	});
}

//描点
function drawCircle(point) {
	ctx.beginPath();
	if (point.hasOwnProperty('isCenter')) {
		ctx.fillStyle = '#0f0';
		ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, true);
	} else if(point.hasOwnProperty('isComplete')){
		ctx.fillStyle = '#000';
		ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, true);
	} else if (point.hasOwnProperty('isTarget')||point.hasOwnProperty('isTargetUnfind')) {
		ctx.fillStyle = 'red';
		ctx.arc(point.x, point.y, 5, 0, Math.PI * 2, true);
	} else {
		ctx.fillStyle = '#000';
		ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, true);
	}
	ctx.closePath();
	ctx.fill();
}

//画障碍区域
function drawHiddenArea(point) {
	ctx.fillStyle = '#999999';
	ctx.beginPath();
	ctx.globalAlpha=0.2;
	ctx.fillRect(point.x - width_X * 0.5 * (800 / area_x), point.y - height_Y * 0.5 * (800 / area_x), width_X * (800 /
		area_x), height_Y * (800 / area_x));
	ctx.closePath();
	ctx.globalAlpha=1;
	ctx.fill();
}

//画线
function drawLines(array) {
	colorArray = ['#f00','#00FF00','#0101DF','#000000','#F9ED09','#C700B3'];
	ctx.strokeStyle = colorArray[0];
	var colorIndex = 1;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(points[array[0]].x, points[array[0]].y);
	for (var i = 1; i < array.length; i++) {
		ctx.lineTo(points[array[i]].x, points[array[i]].y)
		if(array[i] === 0){ 
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(points[array[i]].x, points[array[i]].y);
			if(SALES_MEN === colorIndex){
				ctx.strokeStyle = colorArray[0];
			}else{
				ctx.strokeStyle = colorArray[colorIndex];
			}
			colorIndex = (colorIndex+1)%colorArray.length;
		}
	}
	ctx.lineTo(points[array[0]].x, points[array[0]].y);

	ctx.stroke();
	ctx.closePath();
	// colorArray = ['#f00', '#00FF00', '#0101DF', '#000000', '#F9ED09', '#C700B3'];
	// var colorIndex = 0;
	// ctx.strokeStyle = colorArray[colorIndex];
	// ctx.lineWidth = 1;
	// ctx.beginPath();
	// var index = array[0];
	// ctx.moveTo(points[array[0]].x, points[array[0]].y);
	// for (var i = 1; i < array.length; i++) {
	// 	if (array[i] < SALES_MEN && array[i - 1] < SALES_MEN) {
	// 		ctx.stroke();
	// 		ctx.closePath();
	// 		colorIndex++;
	// 		ctx.beginPath();
	// 		ctx.strokeStyle = colorArray[colorIndex];
	// 		ctx.moveTo(points[array[i]].x, points[array[i]].y);
	// 	} else {
	// 		ctx.lineTo(points[array[i]].x, points[array[i]].y)
	// 	}
	// }
	// //ctx.lineTo(points[array[0]].x, points[array[0]].y);

	// ctx.stroke();
	// ctx.closePath();
}
//画网格
function drawGrid() {
	ctx.beginPath();
	var canvasHeight = ctx.canvas.height; //计算canvas画布的高度
	var canvasWidth = ctx.canvas.width; //获取画布的宽度
	var gridy = canvasHeight / (area_y / height_Y);
	var gridx = canvasWidth / (area_x / width_X);
	var xLineNumber = Math.ceil(area_y / height_Y); //计算需要几条横线
	var yLineNumber = Math.ceil(area_x / width_X); //计算需要几条竖线
	ctx.strokeStyle = "#eee";
	for (var i = 0; i < xLineNumber; i++) { //循环来画线
		ctx.moveTo(0, i * gridy);
		ctx.lineTo(canvasWidth, i * gridy);
		ctx.stroke();
	}
	for (var i = 0; i < yLineNumber; i++) {
		ctx.moveTo(i * gridx, 0);
		ctx.lineTo(i * gridx, canvasHeight);
		ctx.stroke();
	}
	ctx.closePath();
	ctx.fill();
}

function drawSurveyShow(point){
	ctx.fillStyle = '#999999';
	ctx.beginPath();
	ctx.globalAlpha=0.2;
	ctx.fillRect(point.x - width_X * 0.5 * (800 / area_x), point.y - height_Y * 0.5 * (800 / area_x), width_X * (800 /
		area_x), height_Y * (800 / area_x));
	ctx.closePath();
	ctx.globalAlpha=1;
	ctx.fill();
}


//清除画布
function clearCanvas() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
//显示坐标
function displayCoordinates(){
	canvas.addEventListener("onmouseover", function(evt){
		console.log("!!!")
		canvasMinX = $("#canvas").offset().left;
		canvasMinY = $("#canvas").offset().top;
		$('#status').text("");
		
		x = evt.pageX - canvasMinX;
		y = evt.pageY - canvasMinY;
		// x = x - x % (800 / (area_x / width_X)) + 0.5 * (800 / (area_x / width_X));
		// y = y - y % (800 / (area_y / height_Y)) + 0.5 * (800 / (area_y / height_Y));
		// x = x % 800;
		// y = y % 800;
		ctx.beginPath();
		ctx.fillText("Mouse: X-"+x+",Y-"+y,x,y)
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
	},false);
	
}