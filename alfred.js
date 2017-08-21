/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var TJBot = require('tjbot');
var config = require('./config');
var mqtt = require('mqtt');

// obtain our credentials from config.js
var credentials = config.credentials;

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['led', 'microphone'];

// connect to mqtt
const client = mqtt.connect('mqtt://10.0.0.131:1883');

// set up TJBot's configuration
var tjConfig = {
log: {
level: 'verbose'
     }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();

console.log("I understand lots of colors.  You can tell me to shine my light a different color by saying 'turn the light red' or 'change the light to green' or 'turn the light off'.");

// uncomment to see the full list of colors TJ understands
// console.log("Here are all the colors I understand:");
// console.log(tjColors.join(", "));

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
var colors = {};
tjColors.forEach(function(color) {
		colors[color] = 1;
		});


// listen for speech
var rgbwIndex = "1";
tj.listen(function(msg) {
		console.log("Msg: " + msg);

		// Action
		var containsAction = msg.indexOf("turn") >= 0;
		containsAction |= msg.indexOf("term") >= 0;
		containsAction |= msg.indexOf("change") >= 0;
		containsAction |= msg.indexOf("set") >= 0;
		containsAction |= msg.indexOf("don't") >= 0;
		containsAction |= msg.indexOf("ten") >= 0;
		containsAction |= msg.indexOf("turner") >= 0;
		containsAction |= msg.indexOf("tone") >= 0;
		containsAction |= msg.indexOf("time") >= 0;
		// Device (light + words that sound alike)
		var containsLight = msg.indexOf("the light") >= 0;
		containsLight |= msg.indexOf("light") >= 0;
		containsLight |= msg.indexOf("lights") >= 0;
		containsLight |= msg.indexOf("right") >= 0;
		containsLight |= msg.indexOf("write") >= 0;
		containsLight |= msg.indexOf("like") >= 0;
		// Disco?
		var containsDisco = msg.indexOf("disco") >= 0;
		containsDisco |= msg.indexOf("rainbow") >= 0;
		containsDisco |= msg.indexOf("random") >= 0;
		containsLight |= containsDisco;
		// find which lamp, and set it global
		var containsIndex0 = msg.indexOf("zero") >= 0;
		var containsIndex1 = msg.indexOf("one") >= 0;
		containsIndex1 |= msg.indexOf("want") >= 0;
		var containsIndex2 = msg.indexOf("two") >= 0;
		containsIndex2 |= msg.indexOf("to") >= 0;
		var containsIndex3 = msg.indexOf("three") >= 0;
		var containsIndex4 = msg.indexOf("four") >= 0;
		containsIndex4 |= msg.indexOf("for") >= 0;
		var containsIndex5 = msg.indexOf("five") >= 0;

		if(containsIndex0){
			rgbwIndex = "0";
			console.log("rgbwIndex0: "+rgbwIndex);
		}
		else if(containsIndex1){
			rgbwIndex = "1";
			console.log("rgbwIndex1: "+rgbwIndex);
		}
		else if(containsIndex2){
			rgbwIndex = "2";
			console.log("rgbwIndex2: "+rgbwIndex);
		}
		else if(containsIndex3){
			rgbwIndex = "3";
			console.log("rgbwIndex3: "+rgbwIndex);
		}
		else if(containsIndex4){
			rgbwIndex = "4";
			console.log("rgbwIndex4: "+rgbwIndex);
		}
		else if(containsIndex5){
			rgbwIndex = "5";
			console.log("rgbwIndex5: "+rgbwIndex);
		}

		if ((containsAction) && (containsLight)) {
			// was there a color uttered?
			var words = msg.split(" ");
			for (var i = 0; i < words.length; i++) {
				var word = words[i];
				if (containsDisco){
					console.log("disco!");
					if(word == "on"){
						console.log("turning on disco" + rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/status", "3");
					}
					if(word == "off"){
						console.log("turning off disco" + rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/status", "2");
					}
				}
				else if (colors[word] != undefined || word == "on" || word == "off") {
					console.log("color!");
					tj.shine(word);
					if(word == "white"){
						console.log("turning white" + rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "0");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "red"){
						console.log("turning red"+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/color", "0");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "yellow"){
						console.log("turning yellow"+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/color", "255");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "green"){
						console.log("turning green"+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/color", "510");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "cyan"){
						console.log("turning cyan"+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/color", "765");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "blue"){
						console.log("turning blue"+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/color", "1020");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "purple"){
						console.log("turning purple"+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/saturation", "200");
						client.publish("rgbw/"+rgbwIndex+"/color", "1275");
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if ( word == "on"){
						console.log("turning on "+rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/status", "1");
					}
					else if(word == "off"){
						console.log("turning off " + rgbwIndex);
						client.publish("rgbw/"+rgbwIndex+"/status", "0");
					}
					break;
				}
			}
		}
});
