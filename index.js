const expenseSection = document.getElementById('expenseSection');
const budgetSection = document.getElementById('budgetSection');
const budgetAmount = document.getElementById('budgetAmount');
const budgetText = document.getElementById('budgetText');
const addBudget = document.getElementById('addBudget');
const helper = document.getElementById('helper');
const helperButton = document.getElementById('helperButton');
const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');
const amountRange = document.getElementById('amountRange');
const addExpense = document.getElementById('addExpense');
const remText = document.getElementById('remText');
const percentageOf = document.getElementById('percentageOf');
const remainingAmount = document.getElementById('remAmount');
const tbody = document.getElementById('tbody');

const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = Number(localStorage.getItem('budget')) || 0;
let isNew = JSON.parse(localStorage.getItem('isNew')) || false;

remText.style.display = 'none';
remainingAmount.style.display = 'none';
helper.style.display = 'none';

function percentageCalculator(amount, wholeAmount) {
    let perc = (amount / wholeAmount) * 100;
    return perc;
}

function displayExpenses() {
    return expenses;
}

function toggleClearButton() {
    if (budget === 0 && expenses.length === 0) {
        clearAllBtn.style.display = 'none';
        addExpense.disabled = true;
    } else {
        clearAllBtn.style.display = 'block';
        addExpense.disabled = false;
    }
}

function toggleDisable() {
    if (budget === 0 && expenses.length === 0) {
        addExpense.disabled = true;
    } else {
        addExpense.disabled = false;
    }
}


expenseAmount.addEventListener('input', () => {
    amountRange.value = expenseAmount.value;
});
amountRange.addEventListener('input', () => {
    expenseAmount.value = amountRange.value;
});

addBudget.addEventListener('click', () => {
    if (!budgetAmount.value) {
        window.alert("Please fill the budget field");
        return;
    }

    if (budget !== 0 && isNew) {
        window.alert('Please clear all first');
        return;
    }

    budget = Number(budgetAmount.value);
    localStorage.setItem('budget', JSON.stringify(budget));
    isNew = true;
    localStorage.setItem('isNew', JSON.stringify(isNew));

    remainingAmount.textContent = budget;

    budgetText.style.display = 'none';
    budgetAmount.style.display = 'none';
    addBudget.style.display = 'none';
    remText.style.display = 'block';
    remainingAmount.style.display = 'block';
    clearAllBtn.style.display = 'block';

    displayRemainingAmount();
    toggleDisable();
});

addExpense.addEventListener('click', () => {
    if (!expenseName.value || !expenseAmount.value) {
        return window.alert(`Expense must have a name and an amount`);
    }

    const newExpense = {
        name: expenseName.value,
        amount: Number(expenseAmount.value),
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    expenseAmount.value = '';
    expenseName.value = '';

    listUpdater();
    displayRemainingAmount();
});

function displayRemainingAmount() {
    let remAmount = budget;
    expenses.forEach((expense) => (remAmount -= expense.amount));
    remainingAmount.textContent = remAmount;
    expenseAmount.max = remAmount;
    amountRange.max = remAmount;

    remainingAmount.classList.remove('text-success', 'text-warning', 'text-danger');

    let percentage = percentageCalculator(remAmount, budget);
    let spentPercentage = ((Number(budget) - remAmount) / Number(budget)) * 100;
    percentageOf.textContent = `Expenditure: ${spentPercentage.toFixed(2)}%`;

    if (percentage >= 60) {
        remainingAmount.classList.add('text-success');
        helper.style.display = 'none';
    } else if (percentage >= 25 && percentage < 60) {
        remainingAmount.classList.add('text-warning');
    } else {
        remainingAmount.classList.add('text-danger');
        helper.style.display = 'block';
    }

    localStorage.setItem('budget', JSON.stringify(budget));
    return;
}

function listUpdater() {
    tbody.innerHTML = '';

    expenses.forEach((expense, index) => {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdAmount = document.createElement('td');
        let tdAction = document.createElement('td');
        let button = document.createElement('button');

        tdName.textContent = expense.name;
        tdAmount.textContent = expense.amount;

        button.textContent = 'Remove';
        button.classList.add('btn', 'btn-danger');

        button.addEventListener('click', () => {
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            listUpdater();
            displayRemainingAmount();
        });

        tdAction.append(button);
        tr.append(tdName, tdAmount, tdAction);
        tbody.append(tr);
    });
}

if (budget > 0) {
    budgetText.style.display = 'none';
    budgetAmount.style.display = 'none';
    addBudget.style.display = 'none';
    remText.style.display = 'block';
    remainingAmount.style.display = 'block';
    listUpdater();
    displayRemainingAmount();
}

const clearAllBtn = document.createElement('button');
clearAllBtn.textContent = "Clear All";
clearAllBtn.classList.add('btn', 'btn-outline-danger', 'mt-3');
budgetSection.append(clearAllBtn);
toggleClearButton();


clearAllBtn.addEventListener('click', () => {
    if (!confirm("Are you sure you want to reset everything?")) return;
    localStorage.clear();
    window.location.reload();
});
