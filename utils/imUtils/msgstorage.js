let Disp = require("Dispatcher");
let msgPackager = require("msgpackager");
let msgType = require("msgtype");
let msgStorage = new Disp();
let disp = require("broadcast");
msgStorage.saveReceiveMsg = function(receiveMsg, type){
  console.log(receiveMsg,'receiveMsg')
  // debugger
  let sendableMsg;
  let domain='https://imgcdn.guochuanyoupin.com/'
	if(type == msgType.IMAGE){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
          type: type,
          url: domain+receiveMsg.filename,
					// url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					size: {
						width: receiveMsg.width,
						height: receiveMsg.height
					},
				},
			},
		};
	}else if (type == msgType.CUSTOM) {
        sendableMsg = {
            id: receiveMsg.id,
            type: type,
            body: {
                id: receiveMsg.id,
                from: receiveMsg.from,
                to: receiveMsg.to,
                type: receiveMsg.type,
                ext: receiveMsg.ext,
                chatType: receiveMsg.type,
                body: {
                    type: type,
                    customEvent: receiveMsg.customEvent,
                    customExts: receiveMsg.customExts
                }
            },
            time: receiveMsg.time
        };
    } 
	else if(type == msgType.TEXT || type == msgType.EMOJI){
		sendableMsg ={
            id: receiveMsg.id,
            type: type,
            body: {
                msg: receiveMsg.data,
				from: receiveMsg.from,
				to: receiveMsg.to
            },
            ext:receiveMsg.ext,
            from: receiveMsg.from,
            targetType: "users",
            to: [
                receiveMsg.to
            ],
            type: type
          };
	}
	else if (type == msgType.FILE) {
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.file_length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					msg: "当前不支持此格式消息展示",
				},
			},
			value: receiveMsg.data
		};
	}
	else if(type == msgType.AUDIO){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			accessToken: receiveMsg.token || receiveMsg.accessToken,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
          // url: receiveMsg.url,
          url: domain+receiveMsg.filename,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					from: receiveMsg.from,
					to: receiveMsg.to
				},
			},
		};
	}
	else if(type == msgType.VIDEO){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			accessToken: receiveMsg.token || receiveMsg.accessToken,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					from: receiveMsg.from,
					to: receiveMsg.to
				},
			},
		};
	}
	else{
		return;
	}
	this.saveMsg(sendableMsg, type, receiveMsg);
};
msgStorage.saveMsg = function(sendableMsg, type, receiveMsg){
	//console.log('sendableMsgsendableMsg', sendableMsg)
	let me = this;
	let myName = wx.getStorageSync("myUsername") || wx.getStorageSync('userInfo').info.hxUname;
	let sessionKey;
	sessionKey = sendableMsg.body.from == myName
			? sendableMsg.body.to + myName
			: sendableMsg.body.from + myName;
	
    let curChatMsg = wx.getStorageSync(sessionKey) || [];
	let renderableMsg = msgPackager(sendableMsg, type, myName);
	if(type == msgType.AUDIO) {
		renderableMsg.msg.length = sendableMsg.body.length;
		renderableMsg.msg.token = sendableMsg.accessToken;
	}
	curChatMsg.push(renderableMsg);
	//console.log('renderableMsgrenderableMsg', renderableMsg)
	if(type == msgType.VIDEO){
		renderableMsg.msg.token = sendableMsg.accessToken;
	}else{
		save();
	}
	function save(){
		wx.setStorage({
			key: sessionKey,
			data: curChatMsg,
			success(){
				if (type == msgType.AUDIO || type == msgType.VIDEO) {
					disp.fire('em.chat.audio.fileLoaded');
				}
				me.fire("newChatMsg", renderableMsg, type, curChatMsg, sessionKey);
			}
		});
	}
};

msgStorage.saveReadMsg = function(readMsg){
  let me = this;
  wx.setStorage({
    key: 'readMsg',
    data: readMsg,
    success(){
      me.fire("readMsg", readMsg);
    }
  });
}


module.exports = msgStorage;
