let WebIM = require("WebIM")["default"];
let msgType = require("msgtype");

module.exports = function(sendableMsg, type, myName){
    var time = WebIM.time();
	var renderableMsg = {
		info: {
			from: sendableMsg.body.from,
			to: sendableMsg.body.to
		},
		username: sendableMsg.body.from == myName ? sendableMsg.body.to : sendableMsg.body.from,
		yourname: sendableMsg.body.from,
		msg: {
			type: type,
			url: sendableMsg.body.body&&sendableMsg.body.body.url||'',
			data: getMsgData(sendableMsg, type),
			ext: sendableMsg.body.ext || sendableMsg.ext
		},
		style: sendableMsg.body.from == myName ? "self" : "",
		time: time,
		mid: sendableMsg.type + sendableMsg.id,
		id: sendableMsg.id,
		chatType: sendableMsg.body.chatType || 'singleChat',
		ext: sendableMsg.body.ext || sendableMsg.ext,
		isFail: false
  };
	if (type == msgType.IMAGE) {
        renderableMsg.msg.size = {
            width: sendableMsg.body.body.size.width,
            height: sendableMsg.body.body.size.height
        };
    } else if (type == msgType.AUDIO) {
        renderableMsg.msg.length = sendableMsg.body.length;
    } else if (type == msgType.FILE) {
        renderableMsg.msg.url = sendableMsg && sendableMsg.body && sendableMsg.body.body.url || "";
        renderableMsg.msg.filename = sendableMsg && sendableMsg.body && sendableMsg.body.body.filename || "";
        renderableMsg.msg.size = sendableMsg && sendableMsg.body && sendableMsg.body.body.file_length || 0;
    } else if (type == msgType.CUSTOM) {
        renderableMsg.msg.customEvent = sendableMsg.body.customEvent || sendableMsg.body.body.customEvent
        renderableMsg.msg.customExts = sendableMsg.body.customExts || sendableMsg.body.body.customExts
    }
	return renderableMsg;

	function getMsgData(sendableMsg, type){
		if(type == msgType.TEXT){
			return WebIM.parseEmoji(sendableMsg.body.msg.replace(/\n/mg, ""));
		}
		else if(type == msgType.EMOJI){
			return sendableMsg.value;
		}
		else if(type == msgType.IMAGE || type == msgType.VIDEO || type == msgType.AUDIO){
			return sendableMsg.body.body.url;
		} else if (type == msgType.FILE) {
			return sendableMsg.body.body.msg
		}
		return "";
	}
};
