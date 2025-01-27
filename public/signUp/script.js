// color palatte
const colors = {
    darkGrey: "#303030",
    darkBlue: "#29313f",
    greyBlack: "#131314",
    lightBlue: "#809BC8",
    white: "#FFFFFF",
    purple: "#A76FB8",
    errorColor: "#ff1447"
};


// proceed to next input field
let signUpCredentials = {
    email: '',
    contact: "",
    instaLink: '',
    fbLink: '',
    grade: '',
    section: '',
    institution: '',
    shift: '',
    password: ''
};
const credentialLabels = {
    email: 'Enter your email address:',
    contact: 'Enter your contact number:',
    instaLink: 'Enter your instagram link (optional):',
    fbLink: 'Enter your facebook link (optional):',
    grade: 'Select your grade:',
    section: 'Enter your section:',
    institution: 'Enter the name of your institution:',
    shift: 'Select your shift:',
    password: 'Create a password:'
};
const credentialTypes = {
    email: 'email,input',
    contact: 'number,input',
    instaLink: 'link,input',
    fbLink: 'link,input',
    grade: 'gradeSelect,select',
    section: 'text,input',
    institution: 'text,input',
    shift: 'shiftSelect,select',
    password: 'password,input'
};
const signUpObjectKeys = Object.keys(signUpCredentials);
const labelKeys = Object.keys(credentialLabels);
const typeKeys = Object.keys(credentialTypes);
const objectLength = Object.keys(signUpCredentials).length;

let inputLabel = document.querySelector(".inputContainer label");
let inputField = document.querySelector(".inputField");
let proceedBtnDown = document.querySelector(".proceedBtnDown");
let proceedBtnUp = document.querySelector(".proceedBtnUp");
let gradeSelect = document.querySelector(".gradeSelect");
let shiftSelect = document.querySelector(".shiftSelect");

// change the type of input field
let visibilityBtn = document.querySelector(".visibilityBtn");
let show_pass_count = 0;
function pass_change_type(){
    show_pass_count += 1;
    if (show_pass_count != 0 && show_pass_count % 2 != 0){
        inputField.setAttribute('type', 'text');
        visibilityBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>';
    }
    else if (show_pass_count != 0 && show_pass_count % 2 == 0){
        inputField.setAttribute('type', 'password');
        visibilityBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>';
    }
}

let currentProgress = 0;
let nextProgress = 0;
let prevProgress = 0;
let clickCount = 0;

function updateProgress(step){
    clickCount += step;
    nextProgress = clickCount;         // next progress of user
    prevProgress = clickCount - 1;     // previous progress of user
    currentProgress = clickCount - 1;    // current progress of user
}

function proceedUp(){
    updateProgress(1);
    let currentFieldType = credentialTypes[typeKeys[currentProgress]].split(','); // array storing current field type [type, fieldType]
    let nextFieldType;
    if(currentProgress < objectLength - 1){
        nextFieldType = credentialTypes[typeKeys[nextProgress]].split(','); // array storing next field type [type, fieldType]
    }

    if (currentFieldType[1] == 'input'){  // for HTML input field
        if (inputField.value){  //input field filled
            signUpCredentials[signUpObjectKeys[currentProgress]] = inputField.value;
            if (currentProgress < objectLength - 1){   // not at the last input
                if(signUpCredentials[signUpObjectKeys[nextProgress]]){
                    newCredentialShow(nextFieldType[0], credentialLabels[labelKeys[nextProgress]]);
                    inputField.value = signUpCredentials[signUpObjectKeys[nextProgress]];
                } else {
                    newCredentialShow(nextFieldType[0], credentialLabels[labelKeys[nextProgress]]);
                }
            } else if (currentProgress == objectLength - 1){   // at the last input
                signUpCredentials[signUpObjectKeys[currentProgress]] = inputField.value;
                console.log(signUpCredentials);
                //redirectSignIn();
            }
        } else {    //input field empty
            updateProgress(-1); // prevent from incrementing the progress
            inputField.style.backgroundColor = colors.errorColor;
            inputLabel.style.color = colors.errorColor;
            setTimeout(() => {
                inputField.style.backgroundColor = 'transparent';
                inputLabel.style.color = colors.white;
            }, 400);
        }
    } else if (currentFieldType[1] == 'select'){    // for HTML select field
        if (currentFieldType[0] == 'gradeSelect'){
            signUpCredentials[signUpObjectKeys[currentProgress]] = gradeSelect.value;
        } else if (currentFieldType[0] == 'shiftSelect'){
            signUpCredentials[signUpObjectKeys[currentProgress]] = shiftSelect.value;
        }
        if(signUpCredentials[signUpObjectKeys[nextProgress]]){
            newCredentialShow(nextFieldType[0], credentialLabels[labelKeys[nextProgress]]);
            inputField.value = signUpCredentials[signUpObjectKeys[nextProgress]];
        } else {
            newCredentialShow(nextFieldType[0], credentialLabels[labelKeys[nextProgress]]);
        }
        if (currentProgress == objectLength - 2){   // going the last input
            visibilityBtn.style.display = "block";
            proceedBtnUp.innerHTML = 'Sign Up';
            proceedBtnUp.style.width = "130px"; 
        } 
    }

    if (nextProgress == 1){
        proceedBtnDown.style.display = "flex"; 
    }
    
    /*
    For debugging:
    console.log(signUpCredentials);
    console.log('prev: ' + currentProgress + ',   current: ' + nextProgress + ',   next: ' + (nextProgress + 1));
    */
}

function proceedDown(){
    updateProgress(-1);
    /*
    For debugging:
    console.log(signUpCredentials);
    console.log('prev: ' + prevProgress + ',   current: ' + nextProgress + ',   next: ' + (nextProgress + 1));
    */

    let prevFieldType = credentialTypes[typeKeys[nextProgress]].split(','); // array storing next field type [type, fieldType]
    if (nextProgress >= 0){   // not at the first input
        newCredentialShow(prevFieldType[0], credentialLabels[labelKeys[nextProgress]]);
        inputField.value = signUpCredentials[signUpObjectKeys[nextProgress]];
    }
    if (currentProgress == objectLength - 3){   // going out of the last input
        visibilityBtn.style.display = "none";
        proceedBtnUp.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>';
        proceedBtnUp.style.width = "80px"; 
    } 

    if (prevProgress < 0){
        proceedBtnDown.style.display = "none"; 
    }
}

function newCredentialShow(inputType, labelText){
    inputLabel.textContent = labelText;
    if (inputType == 'gradeSelect'){
        inputField.style.display = 'none';
        gradeSelect.style.display = 'block';
        shiftSelect.style.display = 'none';
    } else if (inputType == 'shiftSelect'){
        inputField.style.display = 'none';
        gradeSelect.style.display = 'none';
        shiftSelect.style.display = 'block';
    } else {
        inputField.value = '';
        inputField.style.display = 'block';
        inputField.setAttribute('type', inputType);
        gradeSelect.style.display = 'none';
        shiftSelect.style.display = 'none';
    }
}


// redirect to sign in page
function redirectSignIn(){
    window.location.href = "../signIn/index.html";
}
