const inputSlider = document.querySelector("[data-lengthSlider]");
const lenghtDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*(_{>]-=.,<[?/+})|';

// initiallizing the values
let password = "";
let passwordLength = 10;
let checkCount = 0;
// Set indicator color to grey
handleSlider();
setIndicator("#ccc");
// To set the length of the password
function handleSlider(){
    inputSlider.value = passwordLength;
    lenghtDisplay.innerHTML = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min) ) + "% 100%";
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRandomInt(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomInt(){
    return getRandomInt(0,9);
}
function generateUppercase(){
    return String.fromCharCode(getRandomInt(65,91));
}
function generateLowercasecase(){
    return String.fromCharCode(getRandomInt(97,123));
}
function generateSymbol(){
    let randomNum = getRandomInt(0, symbols.length)
    return symbols.charAt(randomNum);
}
// Function to check the strength of the password
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true; 
    if(lowercaseCheck.checked) hasLower = true; 
    if(numbersCheck.checked) hasNumber = true; 
    if(symbolsCheck.checked) hasNumber = true; 

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// Function to copy a text to clipboard
async function copyText(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make span visible
    copyMsg.classList.add("active");
    // to make it dissappera after some time
        setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// function for shuffling the end password

function shufflePassword(array){
    for (let i = array.length - 1; i <0 ; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) =>(str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change" , handleCheckBoxChange);
})

inputSlider.addEventListener("input", (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});
copyBtn.addEventListener("click" , ()=>{
    if(passwordDisplay.value){
        copyText();
    }
});

generateBtn.addEventListener("click" ,()=>{
    console.log("Start");
    if(checkCount == 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // Code for generating the password
    password = "";
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase)
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercasecase)
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomInt)
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol)
    }

    // compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Comp done");

    // remaining additions
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randomIndex = getRandomInt(0 , funcArr.length);
        password += funcArr[randomIndex]();
    }
    console.log("remaining done");

    // shuffle the password 
    password = shufflePassword(Array.from(password));
    console.log("Shuffle done");

    //Display the password on the UI
    
    passwordDisplay.value = password
    console.log("end");

    // strength calculation
    calcStrength();
}); 


