var twoCombo = []
var threeCombo = []
var hero_list = []
var leftOffset = 1050;
var topOffset = 130;
var barsize = 60;
var firstImgLeftOffset = 50;
var secondImgLeftOffset = 250;
var firtPos = 50;
var secPos = 150;
var thirdPos = 250;
var imgTopOffset = 5;
var imagezoom = '18%';

//load the stats data
var data = $.getJSON("tempt.json", function(json) {
    //console.log(data); // this will show the info it in firebug console
}).done(function(json) {
	combos = data["responseJSON"];
	console.log(combos);
	twoCombo = combos["twoCombo"];
	threeCombo = combos["threeCombo"];
});

//load the hero list for utility
var datab = $.getJSON("hero_list", function(json) {
    //console.log(datab); // this will show the info it in firebug console
}).done(function(json) {
	hero_list = datab["responseJSON"]["result"]["heroes"];
});
  // var json = require('/myData/tempt.json't);


function drawTwoHeroRanking() {
	// build div if there is no div
	var colorID = false;
	for (var i = 0; i < 10; i++) {
		if (document.getElementById("rotk" + i) == null) {
			var current = document.createElement("div");
			current.id = "rotk" + i;
		
		// creating divs for ranking list
			var current = document.createElement("div");
			current.id = "rotk" + i;
			current.style.width = "400px";
			current.style.position = 'absolute';
			current.style.left = leftOffset + "px";
			current.style.top = barsize * i + topOffset + "px";
			current.style.height = "60px";
			if (colorID == false) {
				current.style.backgroundColor = '#ccffcc';
				colorID = true;
			} else {
				current.style.backgroundColor = '#ffe6ff';
				colorID = false;
			}
			document.body.appendChild(current);

		}		//clear used image
		var clearing = document.getElementById("rotk" + i);
		while (clearing.firstChild) {
			clearing.removeChild(clearing.firstChild);
		}
		//dealing with heroID
		var firstHeroID = twoCombo[9 - i]["first_hero_id"];
		var secondHeroID = twoCombo[9 - i]["second_hero_id"];
		firstHeroID--;
		secondHeroID--;
		if (firstHeroID > 23) {
			firstHeroID--;
			secondHeroID--;
		}
		if (firstHeroID > 106) {
			firstHeroID--;
			secondHeroID--;
		}
		if (rankingDicForTwo.length < 10){
			rankingDicForTwo.push([firstHeroID, secondHeroID]);
		}
		//first hero
		var firstHeroName = hero_list[firstHeroID]["name"];
		firstHeroName = firstHeroName.substring(14, firstHeroName.length);
		var img = document.createElement("img");
		img.style.width = imagezoom;
		img.style.position = 'absolute';
		img.style.left = firstImgLeftOffset + "px";
		img.style.top = imgTopOffset + "px";
		img.style.height = 'auto';
		img.src ="http://media.steampowered.com/apps/dota2/images/heroes/" + firstHeroName + "_lg.png";
		document.getElementById("rotk" + i).appendChild(img);

		//append ranking title
		var ranking = document.createElement("zhengxiaoliang");
		ranking.innerHTML = i + 1;
		ranking.style.font = "bold 40px impact,serif"
		ranking.style.position = "absolute";
		ranking.setAttribute("align", "center");
		ranking.style.top = imgTopOffset + "px";
		ranking.style.left = "2%";
		document.getElementById("rotk" + i).appendChild(ranking);

		//append text
		//second hero
		var secondHeroName = hero_list[secondHeroID]["name"];
		secondHeroName = secondHeroName.substring(14, secondHeroName.length);
		var img = document.createElement("img");
		img.style.width = imagezoom;
		img.style.position = 'absolute';
		img.style.left = secondImgLeftOffset + "px";
		img.style.top = imgTopOffset + "px";
		img.style.height = 'auto';
		img.src ="http://media.steampowered.com/apps/dota2/images/heroes/" + secondHeroName + "_lg.png";
		document.getElementById("rotk" + i).appendChild(img);
		//mousevents
		document.getElementById("rotk" + i).onclick = function() {
			//add  your node links here
			var heroes = rankingDicForTwo[i];
			var id = d3.select(this)[0][0].id;
			var comboNumber = id.substr(id.length - 1);
			selectedHeroes.length=0;
			comboNumber = parseInt(comboNumber);
			selectedHeroes.push({
				name: nodesDataRef[rankingDicForTwo[comboNumber][0]].name,
				id: rankingDicForTwo[comboNumber][0]
			});
			selectedHeroes.push({
				name: nodesDataRef[rankingDicForTwo[comboNumber][1]].name,
				id: rankingDicForTwo[comboNumber][1]
			});
			console.log(selectedHeroes);
			drawTree();
			selectedHeroes.length = 0;
		};
		document.getElementById("rotk" + i).onmouseover = function() {
			this.style.opacity = "0.5";
			var heroes = rankingDicForTwo[i];
			var id = d3.select(this)[0][0].id;
			var comboNumber = id.substr(id.length - 1);
			comboNumber = parseInt(comboNumber);
			selectedHeroes.push.apply(selectedHeroes, rankingDicForTwo[comboNumber]);
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[0])
          	.attr("class", "tooltip hovered");
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[1])
          	.attr("class", "tooltip hovered");
          	linksRef.style("opacity", function(d) {
          		if (d.source.idx == selectedHeroes[0] && d.target.idx == selectedHeroes[1]) {
          			d3.select(this).style("opacity", 1).style("stroke", "red");
          		} else {
            		return d3.select(this).style("opacity") * 0.3;
            	}
          	});
		};
		document.getElementById("rotk" + i).onmouseout = function() {
			this.style.opacity = "1";
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[0])
          	.attr("class", "tooltip unhovered");
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[1])
          	.attr("class", "tooltip unhovered");
          	linksRef.style("opacity", function(d) {
            	return d3.select(this).style("stroke", "#888888").style("opacity") / 0.3;
          	});
			selectedHeroes.length = 0;
		};
	}
}
function drawThreeHeroRanking() {
	var colorID = false;
	for (var i = 0; i < 10; i++) {
		if (document.getElementById("rotk" + i) == null) {
			var current = document.createElement("div");
			current.id = "rotk" + i;
		
		// creating divs for ranking list
			var current = document.createElement("div");
			current.id = "rotk" + i;
			current.style.width = "400px";
			current.style.position = 'absolute';
			current.style.left = leftOffset + "px";
			current.style.top = barsize * i + topOffset + "px";
			current.style.height = "60px";
			if (colorID == false) {
				current.style.backgroundColor = '#ccffcc';
				colorID = true;
			} else {
				current.style.backgroundColor = '#ffe6ff';
				colorID = false;
			}
			document.body.appendChild(current);

		}
		//clear used image
		var clearing = document.getElementById("rotk" + i);
		while (clearing.firstChild) {
			clearing.removeChild(clearing.firstChild);
		}
		//dealing with heroID
		var firstHeroID = threeCombo[9 - i]["first_hero_ID"];
		var secondHeroID = threeCombo[9 - i]["second_hero_ID"];
		var thirdHeroID = threeCombo[9 - i]["third_hero_ID"];
		firstHeroID--;
		secondHeroID--;
		thirdHeroID--;
		if (firstHeroID > 23) {
			firstHeroID--;
			secondHeroID--;
			thirdHeroID--;
		}
		if (firstHeroID > 106) {
			firstHeroID--;
			secondHeroID--;
			thirdHeroID--;
		}
		if (rankingDicForThree.length < 10) {
			rankingDicForThree.push([firstHeroID, secondHeroID]);
			highlight.push(thirdHeroID);
		}
		//append ranking title
		var ranking = document.createElement("zhengxiaoliang");
		ranking.innerHTML = i + 1;
		ranking.style.font = "bold 40px impact,serif"
		ranking.style.position = "absolute";
		ranking.setAttribute("align", "center");
		ranking.style.top = imgTopOffset + "px";
		ranking.style.left = "2%";
		document.getElementById("rotk" + i).appendChild(ranking);
		document.getElementById("rotk" + i).style.width = "400px";

		//first hero
		var firstHeroName = hero_list[firstHeroID]["name"];
		firstHeroName = firstHeroName.substring(14, firstHeroName.length);
		var img = document.createElement("img");
		img.style.width = imagezoom;
		img.style.position = 'absolute';
		img.style.left = firtPos + "px";
		img.style.top = imgTopOffset + "px";
		img.style.height = 'auto';
		img.src ="http://media.steampowered.com/apps/dota2/images/heroes/" + firstHeroName + "_lg.png";
		document.getElementById("rotk" + i).appendChild(img);

		//second hero
		var secondHeroName = hero_list[secondHeroID]["name"];
		secondHeroName = secondHeroName.substring(14, secondHeroName.length);
		var img = document.createElement("img");
		img.style.width = imagezoom;
		img.style.position = 'absolute';
		img.style.left = secPos + "px";
		img.style.top = imgTopOffset + "px";
		img.style.height = 'auto';
		img.src ="http://media.steampowered.com/apps/dota2/images/heroes/" + secondHeroName + "_lg.png";
		document.getElementById("rotk" + i).appendChild(img);

		//third hero
		var thirdHeroName = hero_list[thirdHeroID]["name"];
		thirdHeroName = thirdHeroName.substring(14, thirdHeroName.length);
		var img = document.createElement("img");
		img.style.width = imagezoom;
		img.style.position = 'absolute';
		img.style.left = thirdPos + "px";
		img.style.top = imgTopOffset + "px";
		img.style.height = 'auto';
		img.src ="http://media.steampowered.com/apps/dota2/images/heroes/" + thirdHeroName + "_lg.png";

		document.getElementById("rotk" + i).appendChild(img);
		document.getElementById("rotk" + i).onclick = function() {
			//add  your node links here
			var heroes = rankingDicForThree[i];
			var id = d3.select(this)[0][0].id;
			var comboNumber = id.substr(id.length - 1);
			comboNumber = parseInt(comboNumber);
			selectedHeroes.length=0;
			selectedHeroes.push({
				name: nodesDataRef[rankingDicForThree[comboNumber][0]].name,
				id: rankingDicForThree[comboNumber][0]
			});
			selectedHeroes.push({
				name: nodesDataRef[rankingDicForThree[comboNumber][1]].name,
				id: rankingDicForThree[comboNumber][1]
			});
			drawTree();
			selectedHeroes.length = 0;
			highlight.length = 0;
		};
		document.getElementById("rotk" + i).onmouseover = function() {
			this.style.opacity = "0.5";
			var heroes = rankingDicForThree[i];
			var id = d3.select(this)[0][0].id;
			var comboNumber = id.substr(id.length - 1);
			comboNumber = parseInt(comboNumber);
			selectedHeroes.push.apply(selectedHeroes, rankingDicForThree[comboNumber]);
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[0])
          	.attr("class", "tooltip hovered");
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[1])
          	.attr("class", "tooltip hovered");
          	linksRef.style("opacity", function(d) {
          		if (d.source.idx == selectedHeroes[0] && d.target.idx == selectedHeroes[1]) {
          			d3.select(this).style("opacity", 1).style("stroke", "red");
          		} else {
            		return d3.select(this).style("opacity") * 0.3;
            	}
          	});
		};
		document.getElementById("rotk" + i).onmouseout = function() {
			this.style.opacity = "1";
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[0])
          	.attr("class", "tooltip unhovered");
          	d3.select("#plot").select("#" + "tooltip" + "nodeNo" + selectedHeroes[1])
          	.attr("class", "tooltip unhovered");
          	linksRef.style("opacity", function(d) {
            	return d3.select(this).style("stroke", "#888888").style("opacity") / 0.3;
          	});
			selectedHeroes.length = 0;
		};
	}
}