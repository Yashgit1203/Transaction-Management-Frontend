document.addEventListener('DOMContentLoaded', async () => {
    try {
        const accountInfo = await fetch(`https://transaction-management.onrender.com/api/account?account_id=06817931-1ecb-4d59-914f-92473c92b8b7`);
        const accountData = await accountInfo.json();
        document.getElementById('balance').textContent = `$${accountData.balance}`;

        const transactions = await fetch(`https://transaction-management.onrender.com/api/transactions?account_id=06817931-1ecb-4d59-914f-92473c92b8b7`);
        const transactionData = await transactions.json();
        // console.log(accountData.balance);
        console.log(transactions);
        
        if (transactions) {
            displayTransactionHistory(transactionData.transactions);
        } else {
            document.getElementById("transaction-history").style.display="none";
        }
    } catch (error) {
        console.error('Error fetching account information:', error);
    }
});

document.getElementById('transaction-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const transactionType = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const response = await fetch(`https://transaction-management.onrender.com/api/dw?transactiontype=${transactionType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account_id: '06817931-1ecb-4d59-914f-92473c92b8b7', amount })
        });
        const result = await response.json();
        // console.log(result);
        
        if (result.success) {
            alert('Transaction successful!');
            document.getElementById('balance').textContent = `$${result.balance.toFixed(2)}`;
            document.getElementById('transaction-form').reset();
            
            const transactions = await fetch(`https://transaction-management.onrender.com/api/transactions?account_id=06817931-1ecb-4d59-914f-92473c92b8b7`);
            const transactionData = await transactions.json();
            
            displayTransactionHistory(transactionData.transactions);
        } else {
            alert(`Transaction failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error processing transaction:', error);
    }
});

function displayTransactionHistory(transactions) {
    const tbody = document.getElementById('transaction-history').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    transactions.forEach(tx => {
        // console.log(tx);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(tx.created_at).toLocaleString()}</td>
            <td>${tx.type}</td>
            <td>$${tx.amount.toFixed(2)}</td>
            <td>$${tx.balance_after_transaction}</td>
            `;
        tbody.appendChild(row);
    });
}
