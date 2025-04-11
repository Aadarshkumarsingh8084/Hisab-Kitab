document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const textInput = document.getElementById('text');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const balanceElement = document.getElementById('balance');
    const incomeElement = document.getElementById('money-plus');
    const expenseElement = document.getElementById('money-minus');
    const transactionsList = document.getElementById('transactions');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let currentFilter = 'all';

    // Initialize the app
    init();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
            alert('Please add a description and amount');
            return;
        }
        
        const transaction = {
            id: generateID(),
            text: textInput.value,
            amount: +amountInput.value,
            category: categorySelect.value,
            date: new Date().toISOString()
        };
        
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        
        textInput.value = '';
        amountInput.value = '';
        textInput.focus();
    });

    // Generate random ID
    function generateID() {
        return Math.floor(Math.random() * 100000000);
    }

    // Add transaction to DOM
    function addTransactionDOM(transaction) {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        
        item.innerHTML = `
            <span>${transaction.text}</span>
            <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
            <span class="category">${transaction.category}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        transactionsList.appendChild(item);
    }

    // Update balance, income and expense
    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);
        
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        
        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);
        
        const expense = (
            amounts
                .filter(item => item < 0)
                .reduce((acc, item) => (acc += item), 0) * -1
            ).toFixed(2);
        
        balanceElement.innerText = `₹${total}`;
        incomeElement.innerText = `+₹${income}`;
        expenseElement.innerText = `-₹${expense}`;
    }

    // Remove transaction by ID
    function removeTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        init();
    }

    // Update local storage
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Filter transactions
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.id;
            init();
        });
    });

    // Initialize app
    function init() {
        transactionsList.innerHTML = '';
        
        let filteredTransactions = transactions;
        
        if (currentFilter === 'income') {
            filteredTransactions = transactions.filter(t => t.amount > 0);
        } else if (currentFilter === 'expense') {
            filteredTransactions = transactions.filter(t => t.amount < 0);
        }
        
        filteredTransactions.forEach(addTransactionDOM);
        updateValues();
    }

    // Make removeTransaction function available globally
    window.removeTransaction = removeTransaction;
});
