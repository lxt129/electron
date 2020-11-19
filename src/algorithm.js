// var running; //控制是否开始
// var POPULATION_SIZE; //总群大小
// var CROSSOVER_PROBABILITY; //交叉率
// var MUTATION_PROBABILITY; //变异率
// var UNCHANGED_GENS; //已有几代没有发生变化
// var mutationTimes; //变异次数
// var dis;  	//计算每两个点之间的距离
// var bestValue, best; //最佳评价值  最佳路径(best)
// var currentGeneration;//当前是第几代
// var currentBest; // 当代最佳
// var population; // 存放总群的数组
// var values;   
// var routeLenth; //轮盘长度
// var maxSubPath; //最长子路径
// var fitnessValues; //适应度
// var roulette; //轮盘

// var titik1_pop = 0;
// var titik2_pop = 70;
// var titik3_pop = 150;
// var titik1_sales = 0;
// var titik2_sales = 5;
// var titik3_sales = 10;
// var titik1_mut = 0;
// var titik2_mut = 0.002;
// var titik3_mut = 0.01;

//计算变异率
function popKecil() {
	if (POPULATION_SIZE >= titik1_pop && POPULATION_SIZE <= titik2_pop) { // [0,75]
		return 1;
	} else if (POPULATION_SIZE > titik2_pop && POPULATION_SIZE < titik3_pop) { // (75,150)
		return (titik3_pop - POPULATION_SIZE) / (titik3_pop - titik2_pop);
	} else { //[150,...]
		return 0;
	}
};

function popBesar() {
	if (POPULATION_SIZE > titik2_pop && POPULATION_SIZE < titik3_pop) {
		return (POPULATION_SIZE - titik2_pop) / (titik3_pop - titik2_pop);
	} else if (POPULATION_SIZE >= titik3_pop) {
		return 1;
	} else {
		return 0;
	}
};

function salesSedikit() {
	if (SALES_MEN >= titik1_sales && SALES_MEN <= titik2_sales) {
		return 1;
	} else if (SALES_MEN > titik2_sales && SALES_MEN < titik3_sales) {
		return (titik3_sales - SALES_MEN) / (titik3_sales - titik2_sales);
	} else {
		return 0;
	}
};

function salesBanyak() {
	if (SALES_MEN > titik2_sales && SALES_MEN < titik3_sales) {
		return (SALES_MEN - titik2_sales) / (titik3_sales - titik2_sales);
	} else if (SALES_MEN > titik3_sales) {
		return 1;
	} else {
		return 0;
	}
};

function mutasiKecil(nilai_u) {
	return (titik3_mut - (nilai_u * (titik3_mut - titik2_mut)));
};

function mutasiBesar(nilai_u) {
	return (titik2_mut + (nilai_u * (titik3_mut - titik2_mut)));
};

u_mutasi = new Array(4);
z_mutasi = new Array(4);

function hitung_u() {
	u_mutasi[0] = Math.min(popKecil(), salesBanyak());
	u_mutasi[1] = Math.min(popKecil(), salesSedikit());
	u_mutasi[2] = Math.min(popBesar(), salesBanyak());
	u_mutasi[3] = Math.min(popBesar(), salesSedikit());
};

function hitung_z() {
	z_mutasi[0] = mutasiKecil(u_mutasi[0]);
	z_mutasi[1] = mutasiKecil(u_mutasi[1]);
	z_mutasi[2] = mutasiBesar(u_mutasi[2]);
	z_mutasi[3] = mutasiBesar(u_mutasi[3]);
};

function bobot() {
	let atas = 0;
	let bawah = 0;
	for (i = 0; i < 4; i++) {
		atas += (u_mutasi[i] * z_mutasi[i]);
		bawah += u_mutasi[i];
	}
	return (atas / bawah);
};


//产生 初始种群 找到最优解
function GAInitialize() {
	countDistances(); //计算距离
	//初始化 种群 生成POPULATION_SIZE个随机序列
	for (var i = 0; i < POPULATION_SIZE; i++) {
		population.push(randomIndivial(points.length));
	}
	setBestValue();
}

function GANextGeneration() {
	currentGeneration++;
	selection(); 	//选择出新种群
	crossover(); 	//对新选出的种群进行交叉操作
	mutation(); 	//变异操作
	setBestValue(); //获取当前种群最优解和更新全局最优解 
	getRouteLenth(best);
}

function getRouteLenth(best) {
	let newbest = best.clone();
	routeLenth = dis[newbest[newbest.length - 1]][newbest[0]];
	for (let i = 1; i < newbest.length; i++) {
		routeLenth += dis[newbest[i]][newbest[i - 1]];
	}

}

// function tribulate() {
//   //for(var i=0; i<POPULATION_SIZE; i++) {
//   for(var i=population.length>>1; i<POPULATION_SIZE; i++) {
//     population[i] = randomIndivial(points.length);
//   }
// }

//选择新种群
function selection() {
	var parents = new Array();
	var initnum = 4;
	parents.push(population[currentBest.bestPosition]); //上一代总群的最优解(不一定是当前全局最优解)
	parents.push(doMutate(best.clone())); // 交换点位变异操作
	parents.push(pushMutate(best.clone())); // 片段位移变异操作
	parents.push(best.clone()); //当前全局最优解            
	setRoulette(); //按照population(总群)的评价值制作轮盘
	for (var i = initnum; i < POPULATION_SIZE; i++) {
		parents.push(population[wheelOut(Math.random())]);
	} //选择POPULATION_SIZE-initnum个个体(有概率会选择重复的)
	population = parents; //新种群
	
}

//选择交叉的个体
function crossover() {
	var queue = new Array();
	for (var i = 0; i < POPULATION_SIZE; i++) {
		if (Math.random() < CROSSOVER_PROBABILITY) {
			queue.push(i);
		}
	}
	queue.shuffle();
	for (var i = 0, j = queue.length - 1; i < j; i += 2) {
		doCrossover(queue[i], queue[i + 1]);
	}
}

//交叉操作
function doCrossover(x, y) {
	child1 = getChild('next', x, y);
	child2 = getChild('previous', x, y);
	population[x] = child1;
	population[y] = child2;
}
//交叉操作(选取两条路径当前点和相邻点近的(两条路径对比)作为下一个点,然后删除当前点,循环操作)
function getChild(fun, x, y) {
	solution = new Array();
	var px = population[x].clone();
	var py = population[y].clone();
	var dx, dy;
	var c = px[randomNumber(px.length)];
	solution.push(c);
	while (px.length > 1) {
		dx = px[fun](px.indexOf(c));
		dy = py[fun](py.indexOf(c));
		px.deleteByValue(c);
		py.deleteByValue(c);
		c = dis[c][dx] < dis[c][dy] ? dx : dy;
		solution.push(c);
	}
	return solution;
}

//变异操作
function mutation() {
	for (var i = 0; i < POPULATION_SIZE; i++) {
		if (Math.random() < MUTATION_PROBABILITY) {
			if (Math.random() > 0.5) {
				population[i] = pushMutate(population[i]);
			} else {
				population[i] = doMutate(population[i]);
			}
			i--;
		}
	}
}
// function preciseMutate(orseq) {
//   var seq = orseq.clone();
//   if(Math.random() > 0.5){
//     seq.reverse();
//   }
//   var bestv = evaluate(seq);
//   for(var i=0; i<(seq.length>>1); i++) {
//     for(var j=i+2; j<seq.length-1; j++) {
//       var new_seq = swap_seq(seq, i,i+1,j,j+1);
//       var v = evaluate(new_seq);
//       if(v < bestv) {bestv = v, seq = new_seq; };
//     }
//   }
//   //alert(bestv);
//   return seq;
// }
// function preciseMutate1(orseq) {
//   var seq = orseq.clone();
//   var bestv = evaluate(seq);

//   for(var i=0; i<seq.length-1; i++) {
//     var new_seq = seq.clone();
//     new_seq.swap(i, i+1);
//     var v = evaluate(new_seq);
//     if(v < bestv) {bestv = v, seq = new_seq; };
//   }
//   //alert(bestv);
//   return seq;
// }
// function swap_seq(seq, p0, p1, q0, q1) {
//   var seq1 = seq.slice(0, p0);
//   var seq2 = seq.slice(p1+1, q1);
//   seq2.push(seq[p0]);
//   seq2.push(seq[p1]);
//   var seq3 = seq.slice(q1, seq.length);
//   return seq1.concat(seq2).concat(seq3);
// }
//交换点位变异
function doMutate(seq) {
	mutationTimes++;
	// m and n refers to the actual index in the array
	// m range from 0 to length-2, n range from 2...length-m
	do {
		m = randomNumber(seq.length - 2);
		n = randomNumber(seq.length);
	} while (m >= n)

	for (var i = 0, j = (n - m + 1) >> 1; i < j; i++) {
		seq.swap(m + i, n - i);
	}
	return seq;
}

//交换片段实现变异
function pushMutate(seq) {
	mutationTimes++;
	var m, n;
	do {
		m = randomNumber(seq.length >> 1);
		n = randomNumber(seq.length);
	} while (m >= n)

	var s1 = seq.slice(0, m);
	var s2 = seq.slice(m, n)
	var s3 = seq.slice(n, seq.length);
	return s2.concat(s1).concat(s3).clone();
}

function setBestValue() {
	for (var i = 0; i < population.length; i++) {
		values[i] = evaluate(population[i]);
	}
	currentBest = getCurrentBest();
	if (bestValue === undefined || bestValue > currentBest.bestValue) {
		best = population[currentBest.bestPosition].clone(); //获取当前最优解(路径)
		bestValue = currentBest.bestValue; //获取当前最优解(评价值)
		UNCHANGED_GENS = 0; //重新开始记录 无变化代数
	} else {
		UNCHANGED_GENS += 1; //一轮交叉变异后,最优解没有改变
	}
}


//获得当前子代的最优解(不是全局最优解)
function getCurrentBest() {
	var bestP = 0,
		currentBestValue = values[0];

	for (var i = 1; i < population.length; i++) {
		if (values[i] < currentBestValue) {
			currentBestValue = values[i];
			bestP = i; //获取最优解下标
		}
	}
	return {
		bestPosition: bestP //最优解下标
			,
		bestValue: currentBestValue //最优评价值
	}
}

//制作轮盘
function setRoulette() {
	//计算适应度
	for (var i = 0; i < values.length; i++) {
		fitnessValues[i] = 1.0 / values[i];
	}
	//总和为1的轮盘,每个个体占一部分
	var sum = 0;
	for (var i = 0; i < fitnessValues.length; i++) {
		sum += fitnessValues[i];
	}
	for (var i = 0; i < roulette.length; i++) {
		roulette[i] = fitnessValues[i] / sum;
	}
	for (var i = 1; i < roulette.length; i++) {
		roulette[i] += roulette[i - 1];
	}
}
//赌轮盘
function wheelOut(rand) {
	var i;
	for (i = 0; i < roulette.length; i++) {
		if (rand <= roulette[i]) {
			return i;
		}
	}
}
//生成随机序列[10,1,4,5,6,3,7,8,2,9] 前n个旅行商为分割点为分割点
function randomIndivial(n) {
	var a = [];
	for(var i=1; i<SALES_MEN; i++) //三个旅行商只需要2个0分为三段
		a.push(0);
	for(var i=0; i<n; i++) {
		a.push(i);
	}
	return a.shuffle();
}

//评价个体
function evaluate(indivial) {
	var sumForSalesman = new Array(SALES_MEN).fill(0);
	var currentSalesmanIndex = 0;
	var sum = dis[indivial[0]][indivial[indivial.length - 1]];
	sumForSalesman[currentSalesmanIndex] = sum;
	if(indivial[0] == 0)
		currentSalesmanIndex = (currentSalesmanIndex + 1) % SALES_MEN;

	for(var i=1; i<indivial.length; i++) {
		sum += dis[indivial[i]][indivial[i-1]];
		sumForSalesman[currentSalesmanIndex] += dis[indivial[i]][indivial[i-1]];
		if(indivial[i] == 0)
		currentSalesmanIndex = (currentSalesmanIndex + 1) % SALES_MEN;
	}
	var L2 = sumForSalesman.reduce((t, x) => t + x*x, 0);
	return L2 / sum; // returns larger values for unfair distribution of distances between salesmen.
}

//计算点与点之间的距离
function countDistances() {

	var length = points.length;
	var newPoints = new Array(length);

	//计算真实距离
	for (var i = 0; i < length; i++) {
		var point = {};
		point.x = points[i].x * ratio;
		point.y = points[i].y * ratio;
		newPoints[i] = point;
	}
	dis = new Array(length);
	for (var i = 0; i < length; i++) {
		dis[i] = new Array(length);
		for (var j = 0; j < length; j++) {
			dis[i][j] = ~~distance(newPoints[i], newPoints[j]);
		}
	}
	dis[0][0] = 0;

	console.log(dis);
}
