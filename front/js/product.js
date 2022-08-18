
//Access the URL using javascript
const urlSearchParams = new URLSearchParams(window.location.search);
let productId = urlSearchParams.get('id');
console.log(productId);

// Use the response of the API to populate HTML
function updateProductDetails(productDetails){
    console.log(productDetails);

// Add Price, Description, product image, product title, colors
    let productImage = document.getElementById('productimage1');
    console.log(productImage);
    productImage.src = productDetails.imageUrl;
    
    let productName  = document.getElementById('title');
    console.log(productName);
    productName.textContent = productDetails.name;

    let priceElement = document.getElementById('price');
    console.log(priceElement);
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

    function addToCart()
    { 
        if (! localStorage.getItem('productcart')) {
            basketContent = [];
        } else {
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
            //if (quantitySelect.value <= 0) {
              //  alert('Please input correct value!')
               // return false    
        }

        basketContent.push(productAdd);
        localStorage.setItem('productcart', JSON.stringify(basketContent));
        window.location.href = `cart.html`;
    };


    addToCartBtn.addEventListener('click', addToCart);
        console.log('Test')
     
}
//From URL retrieve the product identifier - From URL,  retrieve query parameter
// Make an API call with the product identifier from previous step
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => response.json())
    .then(data => updateProductDetails(data));
    
 