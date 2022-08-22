const $validate = ()=>{}

$validate.prototype = {
    drawPrice_validate : (price)=>{
        if(parseInt(price) < 10000 || !price || price.search(/\s/) !== -1){
            return false
        }
        return true
    },
    password_validate : (password)=>{
        const pattern1 = /[0-9]/; //숫자
        const pattern2 = /[a-zA-Z]/; //영문
        const pattern3 = /[~!@\#$%<>^&*]/; //특수기호
    
        if(!pattern1.test(password)||!pattern2.test(password)||!pattern3.test(password)){
            return false
        }
        return true
    },
    nickname_validate : (nickName)=>{
        const ref = /^[가-힣a-zA-Z]+$/;
        if(!nickName.match(ref)){
            return false;
        }
        return true
    }
}

export const Validate = Object.create($validate.prototype);