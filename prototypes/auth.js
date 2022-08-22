function $Certification() {} 

$Certification.prototype = {
    times : "",
    fnTimer : (comSecond)=>{
        let refSecond = (comSecond%60);
        let second = refSecond > -1 && refSecond < 10 ? '0'+refSecond : refSecond;
        let time  = Math.floor(comSecond/60) + ":" + second;
        return time;
    },
    fnStop : ()=>{
        clearInterval(this.timer);
    },
    randomNum : ()=>{
        let random;
        for(let loop = 0; loop < 8; loop++){
            random = Math.floor(Math.random()*1000000);
            if(random>100000){
                break;
            }
        }
        return random;
    },
    phone_validater : (phoneNum)=>{
        let phone = phoneNum;
        phone = phone.split('-').join('');
        phone = phone.split('.').join('');
        phone = phone.split(' ').join('');
        phone = phone.replace(/[^0-9]/g, '');
        var phoneReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        if(phoneReg.test(phone) === false || phone.length < 11 ){
            return false;
        }
        return true;
    }
}

export let Auth = Object.create($Certification.prototype);
