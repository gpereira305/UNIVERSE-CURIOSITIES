const resultsNav = document.querySelector('#resultNav')
const favoritesNav = document.querySelector('#favoritesNav')
const imagesContainer = document.querySelector('.images-container ')
const saveConfirmed = document.querySelector('.save-confirmed')
const removeConfirmed = document.querySelector('.remove-confirmed')
const loader = document.querySelector('.loader')






//   NASA API
const count = 15;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};


//  Removes "Loader " page and show content
function showContent(page) {
     window.scrollTo({
          top: 0,
          behavior: 'instant'
     })
     if (page === 'results') {
          resultsNav.classList.remove('hidden')
          favoritesNav.classList.add('hidden')
     } else {
          resultsNav.classList.add('hidden')
          favoritesNav.classList.remove('hidden')
     }
     loader.classList.add('hidden')
}



//  Populate the DOM
function createDOMNodes(page) {
     const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
     currentArray.forEach((result) => {
          //   Card container building
          const card = document.createElement('div')
          card.classList.add('card')
          //   Link
          const link = document.createElement('a')
          link.href = result.hdurl;
          link.title = 'Ver Imagem Inteira'
          link.target = '_blank';
          //   Image
          const image = document.createElement('img');
          image.src = result.url;
          image.alt = 'Imagem do dia NASA'
          image.loading = 'lazy';
          image.classList.add('card-img-top');
          //   Card body
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
          //   Save text
          const saveText = document.createElement('h3');
          saveText.classList.add('clickable')
          if (page === 'results') {
               saveText.textContent = '❤ Adicionar aos Favoritos';
               saveText.setAttribute('onclick', `saveFavorites('${result.url}')`);
          } else {
               saveText.textContent = 'Remover Favorito';
               saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);

          }
          //   Card  title
          const cardTitle = document.createElement('h5');
          cardTitle.classList.add('card-title');
          cardTitle.textContent = result.title;
          //   Card text
          const cardText = document.createElement('p');
          cardText.textContent = result.explanation
          //   Footer container
          const footer = document.createElement('small');
          footer.classList.add('text-muted')
          //  Date
          const date = document.createElement('strong')
          date.textContent = result.date;
          //  Copyright
          const copyrightResult = result.copyright === undefined ? ' ' : result.copyright;
          const copyright = document.createElement('span')
          copyright.textContent = `  ${copyrightResult}`;
          // Append elements
          footer.append(date, copyright)
          cardBody.append(saveText, cardTitle, cardText, footer)
          link.appendChild(image)
          card.append(link, cardBody)
          imagesContainer.appendChild(card)
     })
}



//   Update the DOM
function updateDOM(page) {
     // Get 'Favorites' from local storage
     if (localStorage.getItem('nasaFavorites')) {
          favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
     }
     imagesContainer.textContent = ' ';
     createDOMNodes(page);
     showContent(page);
}


//  Add result to favorites
function saveFavorites(itemUrl) {
     //  Loop through 'Results Array'  to select  'Favorite'
     resultsArray.forEach(item => {
          if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
               favorites[itemUrl] = item;
               //  Show  'Save confirmation for  2 seconds
               // removeConfirmed.hidden = true;
               saveConfirmed.hidden = false;
               setTimeout(() => {
                    saveConfirmed.hidden = true;
                    // removeConfirmed.hidden = false;
               }, 2000);
               //  Save  'Favorites' in local storage
               localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
          }
     });

}

//  Remove item from 'Favorites'
function removeFavorite(itemUrl) {
     if (favorites[itemUrl]) {
          delete favorites[itemUrl];
          removeConfirmed.hidden = false;
          setTimeout(() => {
               removeConfirmed.hidden = true;
          }, 1000);

          //  Save  'Favorites' in local storage
          localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
          updateDOM('favorites');
     }
}

// Get  images from NASA API
async function getNasaPictures() {
     //  Show 'Loader'  icon
     loader.classList.remove('hidden')
     try {
          const response = await fetch(apiUrl)
          resultsArray = await response.json()
          updateDOM('results')
     } catch (error) {
          //  Catch error here
     }
}

//On load 
getNasaPictures()