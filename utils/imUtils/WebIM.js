
import websdk from "../sdk/Easemob-chat-4.6.0";
import config from "./WebIMConfig";

console.group = console.group || {};
console.groupEnd = console.groupEnd || {};

var window = {};
let WebIM = window.WebIM = websdk;
window.WebIM.config = config;
//var DOMParser = window.DOMParser = xmldom.DOMParser;
//let document = window.document = new DOMParser().parseFromString("<?xml version='1.0'?>\n", "text/xml");

WebIM.isDebug = function(option){
	if (option) {
		WebIM.config.isDebug = option.isDebug
		openDebug(WebIM.config.isDebug)
	} 

	function openDebug(value){
		function ts(){
			var d = new Date();
			var Hours = d.getHours(); // 获取当前小时数(0-23)
			var Minutes = d.getMinutes(); // 获取当前分钟数(0-59)
			var Seconds = d.getSeconds(); // 获取当前秒数(0-59)
			return (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds) + " ";
		}


		// if (value) {
		// 	Strophe.Strophe.Connection.prototype.rawOutput = function(data){
		// 		try{
		// 			console.group("%csend # " + ts(), "color: blue; font-size: large");
		// 			console.log("%c" + data, "color: blue");
		// 			console.groupEnd();
		// 		}
		// 		catch(e){
		// 			console.log(e);
		// 		}
		// 	};
		// }else{
		// 	Strophe.Strophe.Connection.prototype.rawOutput = function(){};
		// }
		
	}
}

/**
 * Set autoSignIn as true (autoSignInName and autoSignInPwd are configured below),
 * You can auto signed in each time when you refresh the page in dev model.
 */
WebIM.config.autoSignIn = false;
if(WebIM.config.autoSignIn){
	WebIM.config.autoSignInName = "lwz2";
	WebIM.config.autoSignInPwd = "1";
}


// var stropheConn = new window.Strophe.Connection("ws://im-api.easemob.com/ws/", {
//                 inactivity: 30,
//                 maxRetries: 5,
//                 pollingTime: 4500
//             });
//
// stropheConn.connect(
//   '$t$' + 'YWMtmbQEBKKIEeaGmMtXyg5n1wAAAVlkQvGO2WOJGlMCEJKM4VV9GCMnb_XLCXU',
//   function() {
//     console.log(arguments, 'ggogogo');
//   }, stropheConn.wait, stropheConn.hold);
WebIM.parseEmoji = function(msg){
	if(typeof WebIM.Emoji === "undefined" || typeof WebIM.Emoji.map === "undefined"){
		return msg;
	}
	var emoji = WebIM.Emoji,
		reg = null;
	var msgList = [];
	var objList = [];
	for(var face in emoji.map){
		if(emoji.map.hasOwnProperty(face)){
			while(msg.indexOf(face) > -1){
				msg = msg.replace(face, "^" + emoji.map[face] + "^");
			}
		}
	}
	var ary = msg.split("^");
	var reg = /^e.*g$/;
	for(var i = 0; i < ary.length; i++){
		if(ary[i] != ""){
			msgList.push(ary[i]);
		}
	}
	for(var i = 0; i < msgList.length; i++){
		if(reg.test(msgList[i])){
			var obj = {};
			obj.data = msgList[i];
			obj.type = "emoji";
			objList.push(obj);
		}
		else{
			var obj = {};
			obj.data = msgList[i];
			obj.type = "txt";
			objList.push(obj);
		}
	}
	return objList;
};

WebIM.time = function(){
	var date = new Date();
	var Hours = date.getHours();
	var Minutes = date.getMinutes();
	var Seconds = date.getSeconds();
	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
								+ (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds);
	return time;
};

WebIM.Emoji = {
  // path: config.imImages+"/faces/",
  path: config.imImages+"/newFaces/",
  map: {
    "[大哭]": "ee_1.png",
    "[晕]": "ee_3.png",
    "[无语]": "ee_4.png",
    "[皱眉]": "ee_5.png",
    "[破涕为笑]": "ee_7.png",
    "[调皮]": "ee_9.png",
    "[憨笑]": "ee_10.png",
    "[汗颜]": "ee_11.png",
    "[微笑]": "ee_12.png",
    "[心花怒放]": "ee_13.png",
    "[脸红]": "ee_2.png",
    "[生气]": "ee_15.png",
    "[龇牙咧嘴]": "ee_16.png",
    "[嘘]": "ee_17.png",
    "[亲亲]": "ee_6.png",
    "[愉快]": "ee_20.png",
    "[难过]": "ee_21.png",
    "[惊讶]": "ee_22.png",
    "[汗]": "ee_23.png",
    "[撇嘴]": "ee_24.png",
    "[吐舌头]": "ee_25.png",
    "[开心]": "ee_26.png",
    "[睡觉]": "ee_27.png",
    "[眼泪汪汪]": "ee_28.png",
    "[害羞]": "ee_29.png",
    "[笑脸]": "ee_30.png",
    "[得意]": "ee_31.png",
    "[失望]": "ee_32.png",
    "[囧]": "ee_33.png",
    "[喝彩]": "ee_8.png",
    "[栓Q]": "ee_34.png",
    "[爱心]": "ee_35.png",
    "[666]": "ee_36.png",
    "[ok]": "ee_37.png",
  }
};

WebIM.EmojiObj = {
	// 相对 emoji.js 路径"[):]": "ee_1.png",
  // path: config.imImages+"/faces/",
  path: config.imImages+"/newFaces/",
	map1: {
    "[大哭]": "ee_1.png",
    "[晕]": "ee_3.png",
    "[无语]": "ee_4.png",
    "[皱眉]": "ee_5.png",
    "[破涕为笑]": "ee_7.png",
    "[调皮]": "ee_9.png",
    "[憨笑]": "ee_10.png"
	},
	map2: {
    "[汗颜]": "ee_11.png",
    "[微笑]": "ee_12.png",
    "[心花怒放]": "ee_13.png",
    "[脸红]": "ee_2.png",
    "[生气]": "ee_15.png",
    "[龇牙咧嘴]": "ee_16.png",
    "[嘘]": "ee_17.png"
	},
	map3: {
    "[亲亲]": "ee_6.png",
    "[愉快]": "ee_20.png",
    "[难过]": "ee_21.png",
    "[惊讶]": "ee_22.png",
    "[汗]": "ee_23.png",
    "[撇嘴]": "ee_24.png",
    "[吐舌头]": "ee_25.png"
	},
	map4: {
    "[开心]": "ee_26.png",
    "[睡觉]": "ee_27.png",
    "[眼泪汪汪]": "ee_28.png",
    "[害羞]": "ee_29.png",
    "[笑脸]": "ee_30.png",
    "[得意]": "ee_31.png",
    "[失望]": "ee_32.png"
	},
	map5: {
    "[囧]": "ee_33.png",
    "[喝彩]": "ee_8.png",
    "[栓Q]": "ee_34.png",
    "[爱心]": "ee_35.png",
    "[666]": "ee_36.png",
    "[ok]": "ee_37.png"
	},
	map6: {
		//"[del]": "del.png"
	}
};


WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: true, //typeof WebIM.config.https === "boolean" ? WebIM.config.https : location.protocol === "https:",
	url: WebIM.config.socketServer,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: false,
	heartBeatWait: 30000, //WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	isDebug: WebIM.config.isDebug,
	deviceId: WebIM.config.deviceId
});

WebIM.filterGreet = (obj)=>{
    let path = obj.greeting
    if(!path) return
	for(let prop in obj){
		if(prop == 'jobTitle') path =  path.replace(/\$\{position\}/g,`${obj[prop]}`)  //岗位标题
		if(prop == 'resumeName') path = path.replace(/\$\{geekName\}/g,`${obj[prop]}`)   //简历姓名
		if(prop == 'jobCompanyName') path = path.replace(/\$\{company\}/g,`${obj[prop]}`)   //公司名称
		if(prop == 'jobRecruiterJob') path = path.replace(/\$\{title\}/g,`${obj[prop]}`)    //招聘者职位
		if(prop == 'resumeWorkYear') path = path.replace(/\$\{experience\}/g,`${obj[prop]}`) //工作年限
		if(prop == 'jobSalary') path = path.replace(/\$\{salary\}/g,`${obj[prop]}`)          //薪资
		if(prop == 'cityName') path = path.replace(/\$\{cityName\}/g,``)      //地址名称
	}
	return path
};

// async response
// WebIM.conn.listen({
//   onOpened: () => dispatch({type: Types.ON_OPEND})
// })
Math.uuid = function (len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [], i; 
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence
        // as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};
// export default WebIM;
module.exports = {
	"default": WebIM
};
