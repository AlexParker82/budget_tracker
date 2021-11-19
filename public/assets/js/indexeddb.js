const nameEl = document.querySelector("#t-name");
const amountEl = document.querySelector("#t-amount");

const request = window.indexedDB.open("budgetDatabase", 1);

request.onerror = (event) => {
  console.log(request.errorCode);
}

request.onupgradeneeded = ({ target }) => {
  const db = target.result;
  const purchaseStore = db.createObjectStore("PurchaseStore", { autoIncrement: true });
  purchaseStore.createIndex("PurchaseIndex", "purchase");
  ;
}

function checkDatabase() {

  let transaction = db.transaction(['PurchaseStore'], 'readwrite');

  const store = transaction.objectStore('PurchaseStore');

  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(['PurchaseStore'], 'readwrite');
            const currentStore = transaction.objectStore('PurchaseStore');
            currentStore.clear();
            console.log('Clearing store 🧹');
          }
        });
    }
  };
}


const saveRecord = (record) => {
  const transaction = db.transaction(['PurchaseStore'], 'readwrite');
  const store = transaction.objectStore('PurchaseStore');
  store.add(record);
};

window.addEventListener('online', checkDatabase);
