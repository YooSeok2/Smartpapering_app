//환경변수 값 : SERVICE_ID, ACCESSKEY_ID, SECRETKEY
import {SERVICE_ID, ACCESSKEY_ID, SECRETKEY} from "@env"
import CryptoJS from 'crypto-js';


const SMS_URL = `https://sens.apigw.ntruss.com/sms/v2/services/${SERVICE_ID}/messages`

const makeSignature = (methodType, timestamp)=>{
	const space = " ";				// one space
	const newLine = "\n";				// new line
	const method = methodType;				// method
	const url = `/sms/v2/services/${SERVICE_ID}/messages`;	// url (include query string)
	const timeStamp = `${timestamp}`;			// current timestamp (epoch)
	const accessKey = `${ACCESSKEY_ID}`;			// access key id (from portal or Sub Account)
	const secretKey = `${SECRETKEY}`;			// secret key (from portal or Sub Account)
    
	const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
	hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timeStamp);
	hmac.update(newLine);
	hmac.update(accessKey);

	var hash = hmac.finalize();

	return hash.toString(CryptoJS.enc.Base64);
}

const options = (timestamp)=>{
    return{
        POST : {
            method : 'POST',
            headers : {
                "Content-Type": "application/json; charset=UTF-8",
                "x-ncp-apigw-timestamp" : `${timestamp}`,
                "x-ncp-iam-access-key" : `${ACCESSKEY_ID}`,
                "x-ncp-apigw-signature-v2" : `${makeSignature('POST', timestamp)}`
            }
        }
    }
   
}

export const SendSms = async(phoneVal, randomnum)=>{
   const timestamp = new Date().getTime();
   const option = options(timestamp);
 
   
    const postResponse = await fetch(SMS_URL, {
            ...option.POST,
            body : JSON.stringify({
                type : "SMS",
                contentType : "COMM",
                countryCode : "82",
                from : "0269567315",
                content : `[도배GO] 인증번호는 [${randomnum}] 입니다. 정확히 입력해주세요.`,
                messages : [
                    {
                        to:`${phoneVal}`
                    }
                ]
            })
        }).catch((err)=>console.log(err,'errors'));

    const post = await postResponse.json();
    if(post.statusCode !== undefined){
        return post.statusCode;
    }else{
        return 'error';
    }
}
