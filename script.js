const display = document.querySelector(".display");
const buttons = document.querySelector('.buttons');
const clear = document.querySelector(".buttons .toprow.clear")
const ops = document.querySelectorAll(".op");
const MAX_DIGITS = 10;

let ac = false;
let pressedButton = null;
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let lastOperand = null;
let lastOperator = null;
let prevClickedOp = 4;

buttons.addEventListener('mousedown', function (event) {
    const target = event.target;
    if(target.classList.contains("op"))
    {
        let currOp = -1;
        if(target.classList.contains("divide"))
        {
            currOp = 0;
        }
        else if(target.classList.contains("multiply"))
        {
            currOp = 1;
        }    
        else if(target.classList.contains("subtract"))
        {
            currOp = 2;
        }
        else if(target.classList.contains("add"))
        {
            currOp = 3;
        }
        else
        {
            currOp = 4;
        }
        if(prevClickedOp != 4)
        {
            ops[prevClickedOp].classList.remove('clickedBorder');
        }
        prevClickedOp = currOp;
        if(currOp != 4)
        {
            ops[currOp].classList.add('clickedBorder');
        }
    }
    target.classList.add('clicked');
    pressedButton = target;
});

buttons.addEventListener('mouseup', function (event) {
    const target = event.target;
    target.classList.remove('clicked');
    pressedButton = null;
});

buttons.addEventListener('mouseout', function (event) {
    const target = event.target;
    target.classList.remove('clicked');
});

buttons.addEventListener('mouseover', function (event) {
    const target = event.target;

    if (target === pressedButton)
    {
        target.classList.add('clicked');
    }
});


buttons.addEventListener('click', function (event) {
    const target = event.target;

    if(target.classList.contains('dot'))
    {
        handleDot();
    }
    else if(target.classList.contains('digit'))
    {
        if(ac)
        {
            clear.innerText = "C";
            ac = false;
        }
        appendToDisplay(target.innerText);
    }
    else if(target.classList.contains('op'))
    {
        handleOperator(target.innerText);
    }
    else if(target.classList.contains('clear'))
    {
        clearDisplay();
    }
    else if(target.classList.contains('toggle-sign'))
    {
        toggleSign();
    }
    else if(target.classList.contains('percent'))
    {
        handlePercentage();
    }
    else if(target.classList.contains('equals'))
    {
        calculateResult();
    }
});

function handleDot()
{
    let displayText = display.innerText;
    if(displayText.length < MAX_DIGITS && !displayText.includes("."))
    {
        display.innerText = displayText + ".";
    }
}

function appendToDisplay(value)
{
    if(waitingForSecondOperand)
    {
        display.innerText = value;
        waitingForSecondOperand = false;
    }
    else if(display.innerText.length < MAX_DIGITS)
    {
        display.innerText = display.innerText === '0' ? value : display.innerText + value;
    }
}

function clearDisplay()
{
    if(ac)
    {
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = true;
        lastOperand = null;
        lastOperator = null;
    }
    else
    {
        clear.innerText = "AC";
        lastOperand = null;
        waitingForSecondOperand = true;
        ac = true;
    }
    display.innerText = '0';

}

function toggleSign()
{
    display.innerText = display.innerText.startsWith('-') ?
    display.innerText.slice(1) : '-' + display.innerText;
}

function handlePercentage()
{
    display.innerText = (parseFloat(display.innerText) / 100).toString();
}

function handleOperator(nextOperator)
{
    const inputValue = parseFloat(display.innerText);

    if (firstOperand === null)
    {
        firstOperand = inputValue;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
}

function calculateResult()
{
    let inputValue = parseFloat(display.innerText);

    // If we inputted a new operation, store the one we inputted as new last operand and operator
    if(operator)
    {
        if(!waitingForSecondOperand)
        {
            lastOperand = inputValue;
        }
        lastOperator = operator;
    }
    // If we hit equals without any new valid operations, recalculate last operation
    else if (lastOperator)
    {
        operator = lastOperator;
        inputValue = lastOperand;
    }

    if(firstOperand !== null && operator)
    {
        const result = compute(firstOperand, inputValue, operator);
        display.innerText = formatResult(result);
        firstOperand = result;
        waitingForSecondOperand = false;
    }
    operator = null;
}

function compute(firstOperand, secondOperand, operator)
{
    switch (operator)
    {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '×':
            return firstOperand * secondOperand;
        case '÷':
            return secondOperand !== 0 ? firstOperand / secondOperand : 'Divide By Zero';
        default:
            return secondOperand;
    }
}

function isOperator(char)
{
    return ['+', '-', '×', '÷'].includes(char);
}

function formatResult(result)
{
    const resultStr = String(result);
    if(resultStr.length > MAX_DIGITS)
    {
        return "Too Long!";
    }
    return resultStr;
}