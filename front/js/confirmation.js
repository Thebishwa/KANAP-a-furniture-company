// DOM element generate order number from local storage get item method
const orderSummary = document.querySelector('#orderId');
//The querySelector() method allows you to select the first element that matches one or more CSS selectors

//to get the order id in the url of the product from the local storage
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
//to clear the local storage for fresh start again
function clearLocalStorage(productcart, order) {
    localStorage.removeItem(productcart);
    localStorage.removeItem(order);
}

confirmOrder();