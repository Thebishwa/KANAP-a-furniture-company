const server = 'http://localhost:3000/';
const productsApi = `${server}api/products/`;
const productsApiOrder = `${productsApi}order`

async function getContent(query) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
}

//dom content
const cartContent = document.querySelector('#cart__items');
const basketContent = JSON.parse(localStorage.getItem('productcart'))

//form content
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const emailInput = document.querySelector('#email');
const submitOrderBtn = document.querySelector('#order');
const inputArray = [firstNameInput, lastNameInput, addressInput, cityInput, emailInput]

//form input check
function emailvalidation(emailval) {
    const reemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var emailreg = new RegExp(reemail)
    return emailreg.test(emailval);
}

function namevalidation(nameval) {
    const rename = "^[a-zA-Z ,.'-]+$";
    var namereg = new RegExp(rename)
    return namereg.test(nameval);
}

function formValidation() {
    let emptyInput = 0;
    inputArray.forEach(input => {
        if (!input.value) {
            input.classList.add('highlight')
            emptyInput++
        } else {
            input.classList.remove('highlight')
        }
    });

    if (!emailvalidation(emailInput.value)) {
        emailInput.classList.add('highlight')
        alert('Please input correct email address!')
        return false
    } else {
        emailInput.classList.remove('highlight')
    }
    
    if (!namevalidation(firstNameInput.value)) {
        firstNameInput.classList.add('highlight')
        alert('Please input correct first name!')
        return false
    } else {
        firstNameInput.classList.remove('highlight')
    }

    if (!namevalidation(lastNameInput.value)) {
        lastNameInput.classList.add('highlight')
        alert('Please input correct last name!')
        return false
    } else {
        lastNameInput.classList.remove('highlight')
    }

    if (emptyInput > 0) {
        alert('Please fill all highlighted fields!')
        return false
    } else {
        return true       
    }
}

//generate cart product page structure
function generateNodes() {
    cartContent.innerHTML = '';
    for (let i = 0; i < basketContent.length; i++) {
        const itemEl = document.createElement('div');
        itemEl.id = `index-${i}`
        itemEl.classList.add('item-node');
        itemEl.dataset.itemId = basketContent[i].itemTag;
        cartContent.appendChild(itemEl);
    }
    enableForm();
}

//insert html content
function displayItems(items) {
    const itemNodes = document.querySelectorAll('.item-node');
    let itemIndex = 0;
    for (let i = 0; i < itemNodes.length; i++) {
        let datasetId = itemNodes[i].dataset.itemId
        items.forEach(item => {
            if (datasetId === item._id) {                
                itemNodes[i].innerHTML = 
                ` 
                <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                    <div class="cart__item__img">
                      <img src="${item.imageUrl}" alt="${item.name}">
                    </div>
                    <div class="cart__item__content">
                      <div class="cart__item__content__description">
                        <h2>${item.name}</h2>
                        <p>${basketContent[i].itemColor}</p>
                        <p>€<span id="item-price-${i}">${item.price}</span></p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basketContent[i].itemQuantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p id="item-index-${itemIndex++}" class="deleteItem">Delete</p>
                        </div>
                      </div>
                    </div>
                </article>
                `
                let quantityModify = document.querySelectorAll(".itemQuantity");
                quantityModify[i].addEventListener("change", displayTotalPrice); 
            };
        });
    };
    const removeButtons = document.querySelectorAll('.deleteItem');
    removeButtons.forEach(removeButton => removeButton.addEventListener('click', removeItem));
}

//remove disabled attribute
function enableForm() {
    const inputElements = document.querySelectorAll('.input-element')
    inputElements.forEach(inputElement => {
        inputElement.removeAttribute('disabled');
    });
};

//calulate and display total price and articles
function displayTotalPrice() {
    //calulate and display total articles
    var elemsQtt = document.getElementsByClassName('itemQuantity');
    var myLength = elemsQtt.length;
    var elemsIdBasic = "item-price-";
    totalQtt = 0;
    totalPrice = 0;//    

    for (var i = 0; i < myLength; ++i) {
        totalQtt += elemsQtt[i].valueAsNumber;
        //
        var elemsQttN = elemsQtt[i].valueAsNumber;
        var elemsId = elemsIdBasic + [i];
        var elemsPrice = document.getElementById(elemsId).innerHTML;
        var elemsPriceN = parseInt(elemsPrice);
        totalPrice += elemsPriceN * elemsQttN;            
    }

    //calulate and display total quantity
    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQtt;

    //calulate and display total price
    console.log(totalPrice)
    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;

}

//insert html content final
async function fetchCart(query) {
    
    if (basketContent && basketContent.length > 0) {
        generateNodes();
        await getContent(query).then(items => {
            displayItems(items)
            displayTotalPrice();
        })
    } else {

        inputArray.forEach(inputElement => {
            inputElement.setAttribute('disabled', true);
        });
        submitOrderBtn.setAttribute('disabled', true);
        displayTotalPrice();

        cartContent.innerHTML = 
        `
            <p align="center">Your cart is empty!</p>
        `;
    }    
}

//delete item
function removeItem(event) {
    let itemIndex = event.target.id.split('-')[2];
    console.log(itemIndex);
    basketContent.splice(itemIndex, 1);
    localStorage.setItem('productcart', JSON.stringify(basketContent));
    fetchCart(productsApi);
    displayTotalPrice();
};

fetchCart(productsApi);

//place order
async function placeOrder(event) {
    event.preventDefault();
    if (formValidation()) {
        var productIdList = [];
        for (let i = 0; i < basketContent.length; i++) {            
            productIdList.push(basketContent[i].itemTag)            
        }
        const products = productIdList;
        const contact = {
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            address: document.querySelector('#address').value,
            city: document.querySelector('#city').value,
            email: document.querySelector('#email').value
        }
        await fetch(productsApiOrder, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contact: contact,
                    products: products
                })
            })
            .then(response => response.json())
            .then(response => localStorage.setItem('order', JSON.stringify(response)))
            .then(() => window.location.href = `confirmation.html`)
            .catch(error => console.log(error))
    } else {
        return
    }
};

submitOrderBtn.addEventListener('click', placeOrder);