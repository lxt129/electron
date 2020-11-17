Array.prototype.clone = function() {
	return this.slice(0);
}
Array.prototype.shuffle = function() {
	for (var j, x, i = this.length - 1; i; j = randomNumber(i), x = this[--i], this[i] = this[j], this[j] = x);
	return this;
};
Array.prototype.indexOf = function(value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === value) {
			return i;
		}
	}
}
Array.prototype.deleteByValue = function(value) {
	var pos = this.indexOf(value);
	this.splice(pos, 1);
}
Array.prototype.next = function(index) {
	if (index === this.length - 1) {
		return this[0];
	} else {
		return this[index + 1];
	}
}
Array.prototype.previous = function(index) {
	if (index === 0) {
		return this[this.length - 1];
	} else {
		return this[index - 1];
	}
}
Array.prototype.swap = function(x, y) {
	if (x > this.length || y > this.length || x === y) {
		return
	}
	var tem = this[x];
	this[x] = this[y];
	this[y] = tem;
}

Array.prototype.roll = function() {
	var rand = randomNumber(this.length);
	var tem = [];
	for (var i = rand; i < this.length; i++) {
		tem.push(this[i]);
	}
	for (var i = 0; i < rand; i++) {
		tem.push(this[i]);
	}
	return tem;
}
Array.prototype.reject = function(array) {
	return $.map(this, function(ele) {
		return $.inArray(ele, array) < 0 ? ele : null;
	})
}

function intersect(x, y) {
	return $.map(x, function(xi) {
		return $.inArray(xi, y) < 0 ? null : xi;
	})
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function randomPoint() {
	var randomx = randomNumber(WIDTH);
	var randomy = randomNumber(HEIGHT);
	var randomPoint = new Point(randomx, randomy);
	return randomPoint;
}

function randomNumber(boundary) {
	return parseInt(Math.random() * boundary);
	//return Math.floor(Math.random() * boundary);
}

//计算距离
function distance(p1, p2) {
	return euclidean(p1.x - p2.x, p1.y - p2.y);
}
//计算距离
function euclidean(dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
}

//找点
function findPoint(points, point) {
	for (var i = 0; i < points.length; i++) {
		if (point.x == points[i].x && point.y == points[i].y) {
			return point;
		}
	}
	return false;
}

//计算一段路的距离
function routeDistance(route){
	let routeDistance = 0;
	for (let i = 1; i < route.length; i++) {
		routeDistance += distance(route[i - 1],route[i]);
	}
	return routeDistance.toFixed(2);
}



function getMaxSubPath(indivial,SALES_MEN) {
	//每段距离的初始值
	var sumForSalesman = new Array(SALES_MEN).fill(0);
	//当前路径起点
	var currentStartPoint = -1;
	//当前是第几段路径
	var currentPart = 0;
	//移动数组index
	var index = -1;
	for (var i = 0; i < indivial.length; i++) {
		if (indivial[i] < SALES_MEN) {
			currentStartPoint = indivial[i];
			index = i;
			var frontIndivial = indivial.slice(0, index);
			break;
		}
	}
	indivial = indivial.slice(index).concat(frontIndivial); //让路径变为[0....1.....2....],方便计算路程
	currentStartPoint = indivial[0];
	for (var i = 1; i < indivial.length; i++) {
		if (indivial[i] < SALES_MEN) {
			sumForSalesman[currentPart] += dis[indivial[i - 1]][currentStartPoint];
			currentStartPoint = indivial[i];
			currentPart = currentPart + 1;
		} else {
			sumForSalesman[currentPart] += dis[indivial[i - 1]][indivial[i]];
		}
	}
	//添加最后一个点到它的起始位置的距离
	sumForSalesman[currentPart] += dis[indivial[indivial.length - 1]][currentStartPoint];
	var max = 0;
	for (var i = 0; i < sumForSalesman.length; i++) {
		if(max < sumForSalesman[i]){
			max = sumForSalesman[i];
		}
	}

	return max; // returns larger values for unfair distribution of distances between salesmen.
}