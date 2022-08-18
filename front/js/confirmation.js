// DOM
const orderSummary = document.querySelector('#orderId');

const orderDetails = JSON.parse(localStorage.getItem('order'))

function confirmOrder() {
    if (localStorage.getItem('order')) {
        orderSummary.textContent = orderDetails.orderId;
        clearLocalStorage('productcart', 'order');        
    } else {
        orderSummary.innerHTML = 
        `        
        <p align="center">There was an error processing your request.</p>
        `
    }
}

function clearLocalStorage(productcart, order) {
    localStorage.removeItem(productcart);
    localStorage.removeItem(order);
}

confirmOrder();