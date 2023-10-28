let cookieCount = 0;

const cookie = document.querySelector('.cookie');
const cookieCountSpan = document.querySelector('.cookie-count');
const buyBakeryBtn = document.querySelector('.buy-bakery');
const bakeryLevelSpan = document.querySelector('.bakery-level');
const bakeryPriceSpan = document.querySelector('.bakery-price');

const bakery = {
  level: 1,
  price: 10,
  cookiesPerSecond: 0
};

cookie.addEventListener('click', () => {
  cookieCount++;
  cookieCountSpan.textContent = cookieCount;
});

buyBakeryBtn.addEventListener('click', () => {
  if (cookieCount >= bakery.price) {
    cookieCount -= bakery.price;
    cookieCountSpan.textContent = cookieCount;
    bakery.level++;
    bakery.cookiesPerSecond += 1;
    bakery.price = Math.floor(bakery.price * 1.1);
    bakeryLevelSpan.textContent = `Level: ${bakery.level}`;
    bakeryPriceSpan.textContent = `Price: ${bakery.price}`;
  }
});

setInterval(() => {
  cookieCount += bakery.cookiesPerSecond;
  cookieCountSpan.textContent = cookieCount;
}, 1000);

const dbPromise = idb.open('cookie-clicker', 1, upgradeDB => {
  const bakeryStore = upgradeDB.createObjectStore('bakery', { keyPath: 'id' });
});

const saveBakery = () => {
  dbPromise.then(db => {
    const tx = db.transaction('bakery', 'readwrite');
    const store = tx.objectStore('bakery');
    store.put({ id: 1, ...bakery });
    return tx.complete;
  });
};

const loadBakery = () => {
  dbPromise.then(db => {
    const tx = db.transaction('bakery', 'readonly');
    const store = tx.objectStore('bakery');
    return store.get(1);
  }).then(savedBakery => {
    if (savedBakery) {
      bakery.level = savedBakery.level;
      bakery.price = savedBakery.price;
      bakery.cookiesPerSecond = savedBakery.cookiesPerSecond;
      bakeryLevelSpan.textContent = `Level: ${bakery.level}`;
      bakeryPriceSpan.textContent = `Price: ${bakery.price}`;
    }
  });
};

dbPromise.then(() => {
  loadBakery();
});

setInterval(() => {
  saveBakery();
}, 10);
