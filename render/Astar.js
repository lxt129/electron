//画避障路线
function drawAvoidHidden(array) {
	hiddenRoutes = [];
	ctx.beginPath();
	colorArray = ['#f00', '#00FF00', '#0101DF', '#000000', '#F9ED09', '#C700B3'];
	var colorIndex = 0;
	ctx.strokeStyle = colorArray[colorIndex];
	var ratioX = area_x / 800;
	var ratioY = area_y / 800;
	var Y = ~~(area_x / width_X);
	var X = ~~(area_y / height_Y);
	for (var i = 1; i < array.length; i++) {
		if (array[i] < SALES_MEN && array[i - 1] < SALES_MEN) {
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			colorIndex++;
			ctx.strokeStyle = colorArray[colorIndex];
			continue;
		}
		var startPonit = null;
		var endPoint = null;
		startPonit = compare(points[array[i - 1]], points[array[i]]);
		if (startPonit == points[array[i - 1]]) {
			endPoint = points[array[i]];
		} else {
			endPoint = points[array[i - 1]];
		}
		var tArray = new Array(); //先声明一维
		for (var k = 0; k < X; k++) { //一维长度为i,i为变量，可以根据实际情况改变
			tArray[k] = new Array(); //声明二维，每一个一维数组里面的一个元素都是一个数组；
			for (var j = 0; j < Y; j++) { //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；
				tArray[k][j] = -1; //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
			}
		}
		for (var l = 0; l < hidden.length; l++) {
			tArray[~~(hidden[l].y * ratioY / height_Y)][~~(hidden[l].x * ratioX / width_X)] = -3;
		}
		var x1 = ~~(startPonit.y * ratioY / height_Y);
		var y1 = ~~(startPonit.x * ratioX / width_X);
		var x2 = ~~(endPoint.y * ratioY / height_Y);
		var y2 = ~~(endPoint.x * ratioX / width_X);
		tArray[x1][y1] = 0;
		tArray[x2][y2] = -2;
		var midPoint = [];
		//midPoint = getMidPoint(x1,y1,x2,y2,tArray);
		//midPoint = Astar2(x2,y2,tArray);
		midPoint = getMidPoint2(x1, y1, x2, y2, tArray);
		ctx.moveTo(endPoint.x, endPoint.y);
		hiddenRoutes.push(points[array[i - 1]])
		for (var k = 0; k < midPoint.length; k++) {
			ctx.lineTo((midPoint[k].y * width_X + 0.5 * width_X) / ratioX, (midPoint[k].x * height_Y + 0.5 * height_Y) / ratioY);
		}
		if (startPonit == points[array[i]]) {
			for (var k = 0; k < midPoint.length; k++) {
				point = new Point((midPoint[k].y * width_X + 0.5 * width_X) / ratioX, (midPoint[k].x * height_Y + 0.5 * height_Y) /
					ratioY);
				hiddenRoutes.push(point);
			}
		} else {
			for (var k = midPoint.length - 1; k >= 0; k--) {
				point = new Point((midPoint[k].y * width_X + 0.5 * width_X) / ratioX, (midPoint[k].x * height_Y + 0.5 * height_Y) /
					ratioY);
				hiddenRoutes.push(point);
			}
		}
		ctx.lineTo(startPonit.x, startPonit.y);
		// console.log(tArray);
		// console.log(midPoint);
	}
	ctx.stroke();
	ctx.closePath();
	hiddenRoutes.push(points[array[array.length - 1]]);
}

//优化只能上下左右走的情况,
function getMidPoint(x1, y1, x2, y2, array) {
	var res = new Array();
	if (x1 == x2) {
		for (var a = y1 + 1; a < y2; a++) {
			if (array[x1][a] !== -1) {
				return Astar(x1, y1, x2, y2, array);
			}
		}
		return res;
	} else if (y1 == y2) {
		for (var a = x1 + 1; a < x2; a++) {
			if (array[a][y1] !== -1) {
				return Astar(x1, y1, x2, y2, array);
			}
		}
		return res;
	} else if (y1 < y2) {
		for (var a = y1 + 1; a <= y2; a++) {
			if (array[x1][a] !== -1) {
				a = -1;
				break;
			}
		}
		if (a == y2 + 1) {
			for (var a = x1; a < x2; a++) {
				if (array[a][y2] !== -1) {
					break;
				}
			}
		}
		if (a == x2) {
			point = new Point(x1, y2);
			res.push(point);
			return res;
		} else {
			for (var a = x1 + 1; a <= x2; a++) {
				if (array[a][y1] !== -1) {
					return Astar(0, y1, x2, y2, array);
				}
			}
			for (var a = y1; a < y2; a++) {
				if (array[x2][a] !== -1) {
					return Astar(1, y1, x2, y2, array);
				}
			}
			point = new Point(x2, y1);
			res.push(point);
			return res;
		}
	} else {
		console.log("y1>y2")
		for (var a = y2; a < y1; a++) {
			if (array[x1][a] !== -1) {
				break;
			}
		}
		if (a == y1) {
			for (var a = x1; a < x2; a++) {
				if (array[a][y2] !== -1) {
					break;
				}
			}
		}
		if (a == x2) {
			point = new Point(x1, y2);
			res.push(point);
			return res;
		} else {
			for (var a = x1 + 1; a <= x2; a++) {
				if (array[a][y1] !== -1) {
					return Astar(2, y1, x2, y2, array);
				}
			}
			if (a == x2 + 1) {
				for (var a = y2 + 1; a < y1; a++) {
					if (array[x2][a] !== -1) {
						return Astar(x1, y1, x2, y2, array);
					}
				}
			}
			point = new Point(x2, y1);
			res.push(point);
			return res;
		}
	}
}

//只能走上下左右
function Astar(x1, y1, x2, y2, array) {
	//console.log(array)
	var res = [];
	var X = array.length;
	var Y = array[0].length;
	// console.log(X,Y)
	// console.log(array);
	var neighborPoint = [];
	var min = -1;
	while (array[x2][y2] <= 0) {
		console.log("1")
		for (var j = 0; j < Y; j++) {
			for (var i = 0; i < X; i++) {
				// console.log(i,j)
				if (array[i][j] == -3 || array[i][j] >= 0) {
					continue;
				}
				neighborPoint = [];
				min = -1;
				if (j - 1 >= 0 && array[i][j - 1] >= 0) {
					neighborPoint.push(array[i][j - 1]);
				}
				if (i - 1 >= 0 && array[i - 1][j] >= 0) {
					neighborPoint.push(array[i - 1][j]);
				}
				if (i + 1 < X && array[i + 1][j] >= 0) {
					neighborPoint.push(array[i + 1][j]);
				}
				if (j + 1 < Y && array[i][j + 1] >= 0) {
					neighborPoint.push(array[i][j + 1]);
				}
				if (neighborPoint.length == 0) {
					continue;
				}
				array[i][j] = Math.min(...neighborPoint) + 1;
			}
		}
	}
	var i, j;
	i = x2;
	j = y2;
	while (array[i][j] != 0) {
		if (i - 1 >= 0 && array[i - 1][j] == array[i][j] - 1) {
			i = i - 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (i + 1 < X && array[i + 1][j] == array[i][j] - 1) {
			i = i + 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (j - 1 >= 0 && array[i][j - 1] == array[i][j] - 1) {
			j = j - 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (j + 1 < Y && array[i][j + 1] == array[i][j] - 1) {
			j = j + 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
	}
	return res;
}

function getMidPoint2(x1, y1, x2, y2, array) {
	var res = new Array();
	if (x1 == x2) {
		for (var a = y1 + 1; a < y2; a++) {
			if (array[x1][a] !== -1) {
				return Astar2(x2, y2, array);
			}
		}
		return res;
	} else if (y1 == y2) {
		for (var a = x1 + 1; a < x2; a++) {
			if (array[a][y1] !== -1) {
				return Astar2(x2, y2, array);
			}
		}
		return res;
	} else {
		return Astar2(x2, y2, array);
	}
}

//允许斜45°方向走
function Astar2(x2, y2, array) {
	var res = [];
	var X = array.length;
	var Y = array[0].length;
	// console.log(X,Y)
	// console.log(array);
	var neighborPoint = [];
	var min = -1;
	var key = 0;
	while (array[x2][y2] <= 0 || key < 1) {
		for (var j = 0; j < Y; j++) {
			for (var i = 0; i < X; i++) {
				if (array[i][j] == -3 || array[i][j] >= 0) {
					continue;
				}
				neighborPoint = [];
				min = -1;
				if (j - 1 >= 0 && array[i][j - 1] >= 0) {
					neighborPoint.push(array[i][j - 1]);
				}
				if (i - 1 >= 0 && array[i - 1][j] >= 0) {
					neighborPoint.push(array[i - 1][j]);
				}
				if (i + 1 < X && array[i + 1][j] >= 0) {
					neighborPoint.push(array[i + 1][j]);
				}
				if (j + 1 < Y && array[i][j + 1] >= 0) {
					neighborPoint.push(array[i][j + 1]);
				}
				if (i - 1 >= 0 && j - 1 >= 0 && array[i - 1][j - 1] >= 0) {
					neighborPoint.push(array[i - 1][j - 1]);
				}
				if (i - 1 >= 0 && j + 1 < Y && array[i - 1][j + 1] >= 0) {
					neighborPoint.push(array[i - 1][j + 1]);
				}
				if (i + 1 < X && j - 1 >= 0 && array[i + 1][j - 1] >= 0) {
					neighborPoint.push(array[i + 1][j - 1]);
				}
				if (i + 1 < X && j + 1 < Y && array[i + 1][j + 1] >= 0) {
					neighborPoint.push(array[i + 1][j + 1]);
				}
				if (neighborPoint.length == 0) {
					continue;
				}
				array[i][j] = Math.min(...neighborPoint) + 1;
			}
		}
		key++;
	}
	var i, j;
	i = x2;
	j = y2;
	while (array[i][j] != 0) {
		if (i - 1 >= 0 && array[i - 1][j] == array[i][j] - 1) {
			i = i - 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (i + 1 < X && array[i + 1][j] == array[i][j] - 1) {
			i = i + 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (j - 1 >= 0 && array[i][j - 1] == array[i][j] - 1) {
			j = j - 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (j + 1 < Y && array[i][j + 1] == array[i][j] - 1) {
			j = j + 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (i - 1 >= 0 && j - 1 >= 0 && array[i - 1][j - 1] == array[i][j] - 1) {
			i = i - 1;
			j = j - 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (i - 1 >= 0 && j + 1 < Y && array[i - 1][j + 1] == array[i][j] - 1) {
			i = i - 1;
			j = j + 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (i + 1 < X && j - 1 >= 0 && array[i + 1][j - 1] == array[i][j] - 1) {
			i = i + 1;
			j = j - 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
		if (i + 1 < X && j + 1 < Y && array[i + 1][j + 1] == array[i][j] - 1) {
			i = i + 1;
			j = j + 1;
			point = new Point(i, j);
			res.push(point);
			continue;
		}
	}
	return res;
}

function compare(point1, point2) {
	if (point1.x < point2.x && point1.y < point2.y) {
		return point1;
	} else if (point1.y < point2.y) {
		return point1;
	} else if (point2.y < point1.y) {
		return point2;
	} else if (point1.x < point2.x) {
		return point1;
	} else {
		return point2;
	}
}
