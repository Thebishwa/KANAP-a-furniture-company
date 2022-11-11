
//Access the URL using javascript variable URLSearchParms 
const urlSearchParams = new URLSearchParams(window.location.search);
let productId = urlSearchParams.get('id');


// this function is use the response of the API  and populate HTMl contain
function updateProductDetails(productDetails){ 

// Add Price, Description, product image, product title, colors
    let productImage = document.getElementById('productimage1');
   // console.log(productImage);
    productImage.src = productDetails.imageUrl;
    
    let productName  = document.getElementById('title');
    //console.log(productName);
    productName.textContent = productDetails.name;

    let priceElement = document.getElementById('price');
    //console.log(priceElement);
    priceElement.textContent = productDetails.price;
   
    let productDiscription = document.getElementById('description');
    console.log(productDiscription);
    productDiscription.textContent = productDetails.description;

    let colorElement = document.getElementById('colors');
    let colorOption = productDetails.colors
    colorOption.forEach(color => {
        let colorOption = document.createElement('option');
        colorOption.value = color;
        colorOption.textContent = color;
        colorElement.appendChild(colorOption);
    });

    //add event listener on the click event
    let addToCartBtn = document.getElementById('addToCart');
    // 
    function addToCart()
    { 
        //when user add product to cart it will store inside the localStorage and used when user go to the cart page .
        if (! localStorage.getItem('productcart')) {
            basketContent = [];
        } else {
            //JavaScript built-in function JSON.parse() to convert the string into a JavaScript object
            basketContent = JSON.parse(localStorage.getItem('productcart'))
        }

        const ColorSelect = document.querySelector ("#colors");
        const quantitySelect = document.querySelector("#quantity");

        let productAdd = {
            itemTag: productDetails._id,
            itemColor: ColorSelect.value,
            itemQuantity: Number(quantitySelect.value)
        };

        //combine quantities of the same products
        for(var i = 0; i<basketContent.length; i++)
        {
            var keyTag = basketContent[i].itemTag;
            var keyColor = basketContent[i].itemColor;
            if ( productAdd.itemTag == keyTag && productAdd.itemColor == keyColor) {
                productAdd.itemQuantity += basketContent[i].itemQuantity
                basketContent.splice(i, 1);
            }
            if (quantitySelect.value < 1)  {
                alert('Please input correct value!')
                return false    
            }
                
        }

        basketContent.push(productAdd);
        localStorage.setItem('productcart', JSON.stringify(basketContent));
        window.location.href = `cart.html`;
    };


    addToCartBtn.addEventListener('click', addToCart);
     
}

// Make an API call with the product identifier from previous step
fetch(`http://localhost:3000/api/products/${productId}`)
//Json Read data from web and display in web in systematic way 
    .then(response => response.json())
    // then is a chain of call back for sucessfull resolve or reject promise
    .then(data => updateProductDetails(data));