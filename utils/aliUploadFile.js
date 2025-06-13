import {
	apiAliCredential
} from "/http/aliRequest.js"

import OSS from "ali-oss"

import CryptoJS from "crypto-js"
import {
	showToast
} from "./util"

export let ali = ref({});

// 获取到oss上传实例的方法
export const getClient = async () => {
	try{
		const {
			code,
			data,
			msg
		} = await apiAliCredential()
		console.log(code,data,msg);
		if (code !== 200) return showToast(msg);
		ali.value = data;
		const client = new OSS({
			region: data.region,
			accessKeyId: data.accessKeyId,
			accessKeySecret: data.accessKeySecret,
			bucket: data.bucket,
			stsToken: data.securityToken,
			refreshSTSTokenInterval: 300000,
			refreshSTSToken: async () => {
				const info = await apiAliCredential();
				return {
					accessKeyId: info.data.accessKeyId,
					accessKeySecret: info.data.accessKeySecret,
					stsToken: info.data.securityToken
				}
			},
		});
		return client
	}catch(e){
		//TODO handle the exception
		// 返回一个失败的
		return Promise.reject(e)
	}
	
}

// 将图片转成 base64格式
export const policyBase64 = function(expiration) {
	let date = new Date(expiration);
	date.setHours(date.getHours() + 24);
	const policyText = {
		"expiration": date.toISOString(),
		"conditions": [
			["content-length-range", 0, 1 * 1024 * 1024 * 1024]
		]
	};
	const jsonText = JSON.stringify(policyText);
	const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonText));
	return base64;
}

export const getSignature = function(accessKeySecret, policyBase64) {
	const bytes = CryptoJS.HmacSHA1(policyBase64, accessKeySecret);
	return CryptoJS.enc.Base64.stringify(bytes);
}

export // 图片上传到阿里云
const uploadFilePromise = (url) => {
	return new Promise(async (resolve, reject) => {
		const client = await getClient()
		let signUrl = await client.signatureUrl('image', {
			expires: 86400
		});
		signUrl = signUrl.replace('/image', '')
		const [a, suffix] = url.split('.')
		const policy = policyBase64(Date.now() + 86400000)
		const fileName = 'fximage/' + Date.now() + '.' + suffix
		uni.uploadFile({
			url: signUrl,
			filePath: url,
			name: 'file',
			formData: {
				'key': fileName,
				'policy': policy,
				'OSSAccessKeyId': ali.value.accessKeyId,
				'signature': getSignature(ali.value.accessKeySecret, policy),
				'success_action_status': '200',
				'x-oss-security-token': ali.value.securityToken
			},
			success: async (res) => {
				if (res.statusCode === 200) {
					// 返回成功结果url链接
					// resolve('http://gcjt-fxpt-beijing.oss-cn-beijing.aliyuncs.com/' +
					// 	fileName,'上传成功')
						
					resolve({code: 200,data: 'http://gcjt-fxpt-beijing.oss-cn-beijing.aliyuncs.com/' +
					fileName,msg: '上传失败'})
				}
			},
			fail: function(err) {
				console.log(err, 7777777)
				reject({data: err,code: 201,msg: '上传失败,请重试'})
			},
		})
	})
}
