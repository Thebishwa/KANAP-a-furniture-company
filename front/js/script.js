
// get the deta from the api of the back end and manipulate the HTML using the response which we get from api 
fetch('http://localhost:3000/api/products')
.then(response => {
    return response.json() //Json Read data from web and display in web in systematic way 
})
// then is a chain of call back for sucessfull resolve or reject promise
.then(jsonResponse => createProductCards(jsonResponse));
//create the product card using the response of api

let itemsElement = document.getElementById('items');

//invoke after the resonse of api
function createProductCards(productCards){

    //inside the product card manipulate the html for each element.
    //here It will loop through the collection and each time through 
    //the loop it will use the next item from the collection
    productCards.forEach(element => {
        let productCard = document.createElement('a');
        productCard.href = `./product.html?id=${element._id}`;
        let productArticle = document.createElement('article');
        let productImage = document.createElement ('img');
        productImage.src = element.imageUrl;
        let productName = document.createElement('h3');
        productName.className = "productName";
        productName.innerText = element.name;
        let productDescription = document.createElement('p');
        productDescription.innerText = element.description;
        productDescription.className = "productDescription";

 // Element.append()method supports multiple arguments and appending strings.
 //here i adds a node to the end of the list of children of a above parent node.
        productCard.appendChild(productArticle);
        productArticle.appendChild(productImage);
        productArticle.appendChild(productName);
        productArticle.appendChild(productDescription);
        itemsElement.appendChild(productCard);
    })
}

