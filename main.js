
var twoCombo = []
var threeCombo = []
var hero_list = []
var leftOffset = 850;
var topOffset = 120;
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
    console.log(data); // this will show the info it in firebug console
}).done(function(json) {
	combos = data["responseJSON"];
	twoCombo = combos["twoCombo"];
	threeCombo = combos["threeCombo"];
});

//load the hero list for utility
var datab = $.getJSON("hero_list", function(json) {
    console.log(datab); // this will show the info it in firebug console
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
		var firstHeroID = twoCombo[i]["first_hero_id"];
		var secondHeroID = twoCombo[i]["second_hero_id"];
		firstHeroID--;
		secondHeroID--;
		if (firstHeroID > 24) {
			firstHeroID--;
			secondHeroID--;
		}
		if (firstHeroID > 107) {
			firstHeroID--;
			secondHeroID--;
		}
		console.log(current);
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
		document.getElementById("rotk" + i).addEventListener('click', function(e) {
			//add  your node links here
			alert('hi');
		});
		document.getElementById("rotk" + i).addEventListener('mouseover', function(e){
			this.style.opacity = "0.5";
		});
		document.getElementById("rotk" + i).addEventListener('mouseout', function(e) {
			this.style.opacity = "1";
		});
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
		var firstHeroID = threeCombo[i]["first_hero_ID"];
		var secondHeroID = threeCombo[i]["second_hero_ID"];
		var thirdHeroID = threeCombo[i]["third_hero_ID"];
		firstHeroID--;
		secondHeroID--;
		thirdHeroID--;
		if (firstHeroID > 24) {
			firstHeroID--;
			secondHeroID--;
			thirdHeroID--;
		}
		if (firstHeroID > 107) {
			firstHeroID--;
			secondHeroID--;
			thirdHeroID--;
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
		document.getElementById("rotk" + i).addEventListener('click', function(e) {
			//add  your node links here
			alert('hi');
		});
		document.getElementById("rotk" + i).addEventListener('mouseover', function(e){
			this.style.opacity = "0.5";
		});
		document.getElementById("rotk" + i).addEventListener('mouseout', function(e) {
			this.style.opacity = "1";
		});
	}
}