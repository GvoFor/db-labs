use('mongodbVSCodePlaygroundDB');

// === Clean all data ===

db.getCollection('revisions').drop();
db.getCollection('orders').deleteMany({});
db.getCollection('items').deleteMany({});

// === items ===

// 1) Створіть декілька товарів з різним набором властивостей Phone/TV/Smart 
db.getCollection('items').insertMany([
  { "category": "Phone", "model": "iPhone 6", "producer": "Apple", "price": 600 },
  { "category": "Phone", "model": "Galaxy S21", "producer": "Samsung", "price": 750 },
  { "category": "TV", "model": "Bravia X80J", "producer": "Sony", "price": 1200 },
  { "category": "Smart Watch", "model": "Watch Series 6", "producer": "Apple", "price": 400 },
  { "category": "Phone", "model": "Pixel 6", "producer": "Google", "price": 700 },
  { "category": "TV", "model": "QLED Q70A", "producer": "Samsung", "price": 1100 },
  { "category": "Smart Watch", "model": "Galaxy Watch 4", "producer": "Samsung", "price": 350 },
  { "category": "Phone", "model": "OnePlus 9", "producer": "OnePlus", "price": 729 },
  { "category": "TV", "model": "OLED CX", "producer": "LG", "price": 1400 },
  { "category": "Smart Watch", "model": "Fitbit Versa 3", "producer": "Fitbit", "price": 229 },
  { "category": "Phone", "model": "iPhone 13", "producer": "Apple", "price": 999 },
  { "category": "TV", "model": "The Frame", "producer": "Samsung", "price": 1300 },
  { "category": "Smart Watch", "model": "Amazfit GTR 3", "producer": "Amazfit", "price": 180 },
  { "category": "Phone", "model": "Moto G Power", "producer": "Motorola", "price": 250 },
  { "category": "TV", "model": "X90K", "producer": "Sony", "price": 1500 },
  { "category": "Smart Watch", "model": "TicWatch Pro 3", "producer": "Mobvoi", "price": 300 },
  { "category": "Phone", "model": "Nokia G50", "producer": "Nokia", "price": 299 },
  { "category": "TV", "model": "NanoCell 90", "producer": "LG", "price": 1000 },
  { "category": "Smart Watch", "model": "Watch GT 3", "producer": "Huawei", "price": 280 },
  { "category": "Phone", "model": "Redmi Note 11", "producer": "Xiaomi", "price": 199 }
]);

// 2) Напишіть запит, який виводить усі товари (відображення у JSON)
const allItems = db.getCollection('items').find({});
console.log('2) Усі товари:');
console.log(allItems);

// 3) Підрахуйте скільки товарів у певної категорії
const phoneItemsN = db.getCollection('items').countDocuments({ category: "Phone" });
console.log(`\n3) Кількість товарів категорії "Phone": ${phoneItemsN}`);

// 4) Підрахуйте скільки є різних категорій товарів
const categoriesN = db.getCollection('items').distinct("category").length;
console.log(`\n4) Усього категорій: ${categoriesN}`);

// 5) Виведіть список всіх виробників товарів без повторів
const producers = db.getCollection('items').distinct("producer");
console.log(`\n5) Унікальні виробники: ${producers}`)

// 6) Напишіть запити, які вибирають товари за різними критеріям і їх сукупності: 
//    a) категорія та ціна (в проміжку) - конструкція $and, 
//    b) модель чи одна чи інша - конструкція $or,
//    c) виробники з переліку - конструкція $in
const itemsA = db.getCollection('items').find({ $and: [{ category: "Phone" }, { price: { $gte: 400, $lte: 700 } }] });
console.log('\n6a) Телефони з ціною від 400 до 700:');
console.log(itemsA);

const itemsB = db.getCollection('items').find({ $or: [{ model: "Galaxy Watch 4" }, { model: "Watch Series 6" }] });
console.log('\n6b) Годинники або "Galaxy Watch 4", або "Watch Series 6":');
console.log(itemsB);

const itemsC = db.getCollection('items').find({ producer: { $in: ["Xiaomi", "Apple", "Samsung"]} });
console.log('\n6c) Товари, виробниками яких є Xiaomi або Apple, або Samsung:');
console.log(itemsC);

// 7) Оновіть певні товари, змінивши існуючі значення і додайте
// нові властивості (характеристики) усім товарам за певним критерієм
db.getCollection('items').updateOne(
  { category: "Phone", model: "iPhone 6" },
  [{ $set: { price: 660, lastModified: "$$NOW" } }]
);

db.getCollection('items').updateMany({}, [{ $set: {
  tag: {
    $switch: {
      branches: [
        { case: { $gte: ["$price", 1000] }, then: "Expensive" },
        { case: { $gte: ["$price", 500] }, then: "Medium price" }
      ],
        default: "Cheap"
      }
    }
  }
}]);

// 8) Знайдіть товари у яких є (присутнє поле) певні властивості
const modifiedItems = db.getCollection('items').find({ lastModified: { $exists: {} } });
console.log('\n8) Усі товари, що мають поле "lastModified":')
console.log(modifiedItems);

// 9) Для знайдених товарів збільшіть їх вартість на певну суму
db.getCollection('items').updateMany(
  { lastModified: { $exists: {} } },
  { $inc: { price: 40 } }
);

// === orders ===

const itemsIds = db.getCollection('items').find({}).toArray().map(({_id}) => _id);

// 1) Створіть кілька замовлень з різними наборами товарів, але так щоб один з товарів був у декількох замовленнях
db.getCollection('orders').insertMany([
  {
    "order_number": 201513,
    "date": ISODate("2015-04-14"),
    "total_sum": 1923.4,
    "customer": {
      "name": "Andrii",
      "surname": "Rodinov",
      "phones": [9876543, 1234567],
      "address": "PTI, Peremohy 37, Kyiv, UA"
    },
    "payment": {
      "card_owner": "Andrii Rodionov",
      "cardId": 12345678
    },
    "items_id": [itemsIds[0], itemsIds[4]]
  },
  {
    "order_number": 201514,
    "date": ISODate("2015-04-15"),
    "total_sum": 1150.0,
    "customer": {
      "name": "Olena",
      "surname": "Shevchenko",
      "phones": [3214567],
      "address": "Khreshchatyk 10, Kyiv, UA"
    },
    "payment": {
      "card_owner": "Olena Shevchenko",
      "cardId": 87654321
    },
    "items_id": [itemsIds[0], itemsIds[5]]
  },
  {
    "order_number": 201515,
    "date": ISODate("2015-04-16"),
    "total_sum": 2050.2,
    "customer": {
      "name": "Ivan",
      "surname": "Petrenko",
      "phones": [8888888, 7777777],
      "address": "Lvivska 23, Lviv, UA"
    },
    "payment": {
      "card_owner": "Ivan Petrenko",
      "cardId": 23456789
    },
    "items_id": [itemsIds[1], itemsIds[2]]
  },
  {
    "order_number": 201516,
    "date": ISODate("2015-04-17"),
    "total_sum": 980.0,
    "customer": {
      "name": "Olena",
      "surname": "Shevchenko",
      "phones": [3214567],
      "address": "Khreshchatyk 10, Kyiv, UA"
    },
    "payment": {
      "card_owner": "Olena Shevchenko",
      "cardId": 87654321
    },
    "items_id": [itemsIds[7]]
  },
  {
    "order_number": 201517,
    "date": ISODate("2015-04-18"),
    "total_sum": 1300.0,
    "customer": {
      "name": "Mykola",
      "surname": "Zelenko",
      "phones": [2222222],
      "address": "Soborna 1, Odesa, UA"
    },
    "payment": {
      "card_owner": "Mykola Zelenko",
      "cardId": 99887766
    },
    "items_id": [itemsIds[3], itemsIds[8], itemsIds[0]]
  },
  {
    "order_number": 201518,
    "date": ISODate("2015-04-19"),
    "total_sum": 670.5,
    "customer": {
      "name": "Ivan",
      "surname": "Petrenko",
      "phones": [8888888, 7777777],
      "address": "Lvivska 23, Lviv, UA"
    },
    "payment": {
      "card_owner": "Ivan Petrenko",
      "cardId": 23456789
    },
    "items_id": [itemsIds[10], itemsIds[11]]
  },
  {
    "order_number": 201519,
    "date": ISODate("2015-04-20"),
    "total_sum": 1540.3,
    "customer": {
      "name": "Andrii",
      "surname": "Rodinov",
      "phones": [9876543, 1234567],
      "address": "PTI, Peremohy 37, Kyiv, UA"
    },
    "payment": {
      "card_owner": "Andrii Rodionov",
      "cardId": 12345678
    },
    "items_id": [itemsIds[6], itemsIds[19]]
  },
  {
    "order_number": 201520,
    "date": ISODate("2015-04-21"),
    "total_sum": 999.9,
    "customer": {
      "name": "Mykola",
      "surname": "Zelenko",
      "phones": [2222222],
      "address": "Soborna 1, Odesa, UA"
    },
    "payment": {
      "card_owner": "Mykola Zelenko",
      "cardId": 99887766
    },
    "items_id": [itemsIds[12]]
  },
  {
    "order_number": 201521,
    "date": ISODate("2015-04-22"),
    "total_sum": 480.0,
    "customer": {
      "name": "Olena",
      "surname": "Shevchenko",
      "phones": [3214567],
      "address": "Khreshchatyk 10, Kyiv, UA"
    },
    "payment": {
      "card_owner": "Olena Shevchenko",
      "cardId": 87654321
    },
    "items_id": [itemsIds[13], itemsIds[0]]
  },
  {
    "order_number": 201522,
    "date": ISODate("2015-04-23"),
    "total_sum": 2100.0,
    "customer": {
      "name": "Ivan",
      "surname": "Petrenko",
      "phones": [8888888, 7777777],
      "address": "Lvivska 23, Lviv, UA"
    },
    "payment": {
      "card_owner": "Ivan Petrenko",
      "cardId": 23456789
    },
    "items_id": [itemsIds[14], itemsIds[15], itemsIds[16]]
  }
]);

// 2) Виведіть всі замовлення
const allOrders = db.getCollection('orders').find({});
console.log('\n2) Усі замовлення:');
console.log(allOrders);

// 3) Виведіть замовлення з вартістю більше певного значення
const expensiveOrders = db.getCollection('orders').find({ total_sum: { $gt: 1000 }});
console.log('\n3) Замовлення вартістю від 1000:');
console.log(expensiveOrders);

// 4) Знайдіть замовлення зроблені одним замовником
const andriiOrders = db.getCollection('orders').find({ "customer.name": "Andrii", "customer.surname": "Rodinov" });
console.log('\n4) Замовлення зроблені "Andrii Rodionov":');
console.log(andriiOrders);

// 5) Знайдіть всі замовлення з певним товаром (товарами) (шукати можна по ObjectId)
const ordersWithFirstItem = db.getCollection('orders').find({ items_id: itemsIds[0] });
console.log(`\n5) Замовлення з першим товаром (id = ${itemsIds[0]}):`);
console.log(ordersWithFirstItem);

// 6) Додайте в усі замовлення з певним товаром ще один товар і збільште існуючу вартість замовлення на деяке значення Х
const X = 1000;
db.getCollection('orders').updateMany(
  { items_id: itemsIds[0] }, [
    { $set: { items_id: { $concatArrays: ["$items_id", [itemsIds[19]]] }}},
    { $set: { total_sum: { $sum: ["$total_sum", X] }}},
  ]
);
// console.log(db.getCollection('orders').find({}));

// 7) Виведіть кількість товарів в певному замовленні
const ordersIds = db.getCollection('orders').find({}).toArray().map(({_id}) => _id);

const firstOrderItemsCount = db.getCollection('orders').aggregate([
  { $match: { _id: ordersIds[0]} },
  { $project: { items_count: { $size: "$items_id" } } }
]).next().items_count;
console.log(`7) Кількість товарів в першому замовленні (id = ${ordersIds[0]}): ${firstOrderItemsCount}`);

// 8) Виведіть тільки інформацію про кастомера і номери кредитної карт, для замовлень вартість яких перевищує певну суму
const someCustomers = db.getCollection('orders').aggregate([
  { $match: { total_sum: { $gt: 2000 } }},
  { $project: { _id: 0, customer: 1, "payment.cardId": 1 } }
]);

console.log('8) Кастомери і номера їх кредитних карток для замовлень від 2000:');
someCustomers.forEach(console.log);

// 9) Видаліть товар з замовлень, зроблених за певний період дат
db.getCollection('orders').updateMany({
  date: {
    $gte: ISODate('2015-04-15'),
    $lte: ISODate('2015-04-18')
  }
}, [
  { $set: { items_id: [] }}
]);

// console.log(db.getCollection('orders').find({ 
//   date: {
//     $gte: ISODate('2015-04-15'),
//     $lte: ISODate('2015-04-18')
//   }
// }));

// 10) Перейменуйте у всіх замовлення ім'я (прізвище) замовника
db.getCollection('orders').updateMany({}, [
  { $set: { "customer.name": "John", "customer.surname": "Doe" } }
]);
// console.log(db.getCollection('orders').find({}, { customer: 1 }));

// 11) Знайдіть замовлення зроблені одним замовником, і виведіть тільки інформацію про кастомера та товари у замовлені
//     підставивши замість ObjectId("***") назви товарів та їх вартість (аналог join-а між таблицями orders та items).
const ordersWithItems = db.getCollection('orders').aggregate([
  {
    $group: {
      _id: {
        name: "$customer.name",
        surname: "$customer.surname"
      },
      all_items: { $push: "$items_id" }
    }
  },
  {
    $project: {
      _id: 0,
      customer: "$_id",
      items_id: {
        $reduce: {
          input: "$all_items",
          initialValue: [],
          in: { $concatArrays: ["$$value", "$$this"] }
        }
      }
    }
  },
  {
    $lookup: {
      from: 'items',
      localField: 'items_id',
      foreignField: '_id',
      as: 'items'
    }
  },
  {
    $project: {
      items_id: 0,
    }
  },
]);

console.log('\n11)');
ordersWithItems.forEach(console.log)

// === capped collection ===
// Створіть Сapped collection яка б містила 5 останніх відгуків
db.createCollection('revisions', { capped: true, size: 1024 * 10, max: 5 })

db.getCollection('revisions').insertMany([
  {
    "customer": {
      "name": "Andrii",
      "surname": "Rodinov",
      "phones": [9876543, 1234567],
      "address": "PTI, Peremohy 37, Kyiv, UA"
    },
    "stars": 4,
    "text": "Bought a phone. Quite good for its price. The service also good."
  },
  {
    "customer": {
      "name": "Olena",
      "surname": "Shevchenko",
      "phones": [3214567],
      "address": "Khreshchatyk 10, Kyiv, UA"
    },
    "stars": 5,
    "text": "Amazing experience! Fast delivery and the TV works perfectly."
  },
  {
    "customer": {
      "name": "Ivan",
      "surname": "Petrenko",
      "phones": [8888888, 7777777],
      "address": "Lvivska 23, Lviv, UA"
    },
    "stars": 3,
    "text": "Smart watch is fine, but battery life could be better."
  },
  {
    "customer": {
      "name": "Mykola",
      "surname": "Zelenko",
      "phones": [2222222],
      "address": "Soborna 1, Odesa, UA"
    },
    "stars": 2,
    "text": "Expected more from this tablet. It lags a bit under load."
  },
  {
    "customer": {
      "name": "Andrii",
      "surname": "Rodinov",
      "phones": [9876543, 1234567],
      "address": "PTI, Peremohy 37, Kyiv, UA"
    },
    "stars": 5,
    "text": "Second purchase from here — flawless service again!"
  }
]);

// 1) Перевірте що при досягненні обмеження старі відгуки будуть затиратись
console.log('\n=== REVISIONS ===')

db.getCollection('revisions').find({}, { _id: 0, "customer.name": 1, "customer.surname": 1, stars: 1, text: 1 }).forEach(console.log)

db.getCollection('revisions').insertOne({
  "customer": {
    "name": "Olena",
    "surname": "Shevchenko",
    "phones": [3214567],
    "address": "Khreshchatyk 10, Kyiv, UA"
  },
  "stars": 1,
  "text": "Received a damaged item and still waiting on a refund."
});

console.log('\nДодаємо новий відгук\n')

db.getCollection('revisions').find({}, { _id: 0, "customer.name": 1, "customer.surname": 1, stars: 1, text: 1 }).forEach(console.log)
