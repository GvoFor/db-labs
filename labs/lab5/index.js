const neo4j = require("neo4j-driver");

require("dotenv").config();

const {
  NEO4J_URI: URI,
  NEO4J_PORT: PORT,
  NEO4J_USERNAME: USERNAME,
  NEO4J_PASSWORD: PASSWORD,
  NEO4J_DATABASE: DATABASE,
} = process.env;

if ([URI, PORT, USERNAME, PASSWORD, DATABASE].some((x) => x === undefined)) {
  throw Error("either .env or some env-variable is missing");
}

/* Prepare the data */
const queryCreateItem = `
  CREATE (i:Item {id: $id, name: $name, price: $price})
  RETURN i
`;

const queryCreateCustomer = `
  CREATE (c:Customer {id: $id, name: $name})
  RETURN c
`;

const queryCreateOrder = `
  CREATE (o:Order {id: $id, date: $date})
  RETURN o
`;

const queryCreateCustomerMakesOrder = `
  MATCH (c:Customer {id: $customerId})
  MATCH (o:Order {id: $orderId})
  CREATE (c)-[m:MAKES]->(o)
  RETURN m
`;

const queryCreateOrderContainsItem = `
  MATCH (o:Order {id: $orderId})
  MATCH (i:Item {id: $itemId})
  CREATE (o)-[c:CONTAINS]->(i)
  RETURN c
`;

const queryCreateCustomerViewsItem = `
  MATCH (c:Customer {id: $customerId})
  MATCH (i:Item {id: $itemId})
  CREATE (c)-[v:VIEWS]->(i)
  RETURN v
`;

const buildQuery = (query, params = {}, callback = () => {}) => ({
  query,
  params,
  callback,
});

const insertData = (data, query) =>
  data.map((params) => buildQuery(query, params));

const insertItems = (items) => insertData(items, queryCreateItem);
const insertCustomers = (customers) =>
  insertData(customers, queryCreateCustomer);
const insertOrders = (orders) => insertData(orders, queryCreateOrder);
const insertCustomersAndOrders = (customersAndOrders) =>
  insertData(customersAndOrders, queryCreateCustomerMakesOrder);
const insertOrdersAndItems = (ordersAndItems) =>
  insertData(ordersAndItems, queryCreateOrderContainsItem);
const insertCustomersAndItems = (customersAndItems) =>
  insertData(customersAndItems, queryCreateCustomerViewsItem);

const items = [
  { id: 1n, name: "apple", price: 42.5 },
  { id: 2n, name: "banana", price: 30.0 },
  { id: 3n, name: "orange", price: 28.75 },
  { id: 4n, name: "grape", price: 55.0 },
  { id: 5n, name: "peach", price: 48.25 },
  { id: 6n, name: "mango", price: 60.0 },
  { id: 7n, name: "pear", price: 33.3 },
  { id: 8n, name: "kiwi", price: 45.0 },
  { id: 9n, name: "plum", price: 37.2 },
  { id: 10n, name: "cherry", price: 50.0 },
];

const customers = [
  { id: 1n, name: "Daniel" },
  { id: 2n, name: "Sarah" },
  { id: 3n, name: "Mike" },
  { id: 4n, name: "Emma" },
  { id: 5n, name: "Liam" },
];

const orders = [
  { id: 1n, date: "2025-04-09" },
  { id: 2n, date: "2025-04-08" },
  { id: 3n, date: "2025-04-07" },
  { id: 4n, date: "2025-04-06" },
  { id: 5n, date: "2025-04-05" },
  { id: 6n, date: "2025-04-04" },
  { id: 7n, date: "2025-04-03" },
  { id: 8n, date: "2025-04-02" },
  { id: 9n, date: "2025-04-01" },
  { id: 10n, date: "2025-03-31" },
  { id: 11n, date: "2025-03-30" },
  { id: 12n, date: "2025-03-29" },
  { id: 13n, date: "2025-03-28" },
  { id: 14n, date: "2025-03-27" },
  { id: 15n, date: "2025-03-26" },
  { id: 16n, date: "2025-03-25" },
  { id: 17n, date: "2025-03-24" },
  { id: 18n, date: "2025-03-23" },
  { id: 19n, date: "2025-03-22" },
  { id: 20n, date: "2025-03-21" },
];

const customersAndOrders = [
  { customerId: 1n, orderId: 1n },
  { customerId: 1n, orderId: 2n },
  { customerId: 2n, orderId: 3n },
  { customerId: 2n, orderId: 4n },
  { customerId: 3n, orderId: 5n },
  { customerId: 3n, orderId: 6n },
  { customerId: 4n, orderId: 7n },
  { customerId: 4n, orderId: 8n },
  { customerId: 5n, orderId: 9n },
  { customerId: 5n, orderId: 10n },
  { customerId: 1n, orderId: 11n },
  { customerId: 2n, orderId: 12n },
  { customerId: 3n, orderId: 13n },
  { customerId: 4n, orderId: 14n },
  { customerId: 5n, orderId: 15n },
  { customerId: 1n, orderId: 16n },
  { customerId: 2n, orderId: 17n },
  { customerId: 3n, orderId: 18n },
  { customerId: 4n, orderId: 19n },
  { customerId: 5n, orderId: 20n },
];

const ordersAndItems = [
  { orderId: 1n, itemId: 1n },
  { orderId: 1n, itemId: 3n },
  { orderId: 2n, itemId: 5n },
  { orderId: 3n, itemId: 2n },
  { orderId: 4n, itemId: 4n },
  { orderId: 5n, itemId: 7n },
  { orderId: 6n, itemId: 6n },
  { orderId: 7n, itemId: 9n },
  { orderId: 8n, itemId: 8n },
  { orderId: 9n, itemId: 10n },
  { orderId: 10n, itemId: 2n },
  { orderId: 11n, itemId: 3n },
  { orderId: 12n, itemId: 1n },
  { orderId: 13n, itemId: 5n },
  { orderId: 14n, itemId: 7n },
  { orderId: 15n, itemId: 4n },
  { orderId: 16n, itemId: 8n },
  { orderId: 17n, itemId: 6n },
  { orderId: 18n, itemId: 9n },
  { orderId: 19n, itemId: 10n },
  { orderId: 20n, itemId: 1n },
];

const customersAndItems = [
  { customerId: 1n, itemId: 1n },
  { customerId: 1n, itemId: 2n },
  { customerId: 2n, itemId: 3n },
  { customerId: 2n, itemId: 4n },
  { customerId: 3n, itemId: 5n },
  { customerId: 3n, itemId: 6n },
  { customerId: 4n, itemId: 7n },
  { customerId: 4n, itemId: 8n },
  { customerId: 5n, itemId: 9n },
  { customerId: 5n, itemId: 10n },
  { customerId: 1n, itemId: 3n },
  { customerId: 2n, itemId: 5n },
  { customerId: 3n, itemId: 7n },
  { customerId: 4n, itemId: 9n },
  { customerId: 5n, itemId: 1n },
];

const deleteQueries = [
  `MATCH ()-[v:VIEWS]->()
  DELETE v`,
  `MATCH ()-[c:CONTAINS]->()
  DELETE c`,
  `MATCH ()-[m:MAKES]->()
  DELETE m`,
  `MATCH (o:Order)
  DELETE o`,
  `MATCH (o:Customer)
  DELETE o`,
  `MATCH (o:Item)
  DELETE o`,
].map((query) => buildQuery(query));

/* Task queries */

// Знайти Items які входять в конкретний Order (за Order id)
const queryFindOrderItems = `
  MATCH (:Order {id: $orderId})-[:CONTAINS]->(i:Item)
  RETURN i.id AS id,
    i.name AS name,
    i.price AS price
`;

// Підрахувати вартість конкретного Order
const queryFindOrderTotalPrice = `
  MATCH (:Order {id: $orderId})-[:CONTAINS]->(i:Item)
  RETURN sum(i.price) AS total_price
`;

// Знайти всі Orders конкретного Customer
const queryFindCustomerOrders = `
  MATCH (:Customer {id: $customerId})-[:MAKES]->(o:Order)
  RETURN o.id AS id,
    o.date AS date
`;

// Знайти всі Items куплені конкретним Customer (через його Orders)
const queryFindCustomerItems = `
  MATCH (:Customer {id: $customerId})-[:MAKES]->(:Order)-[:CONTAINS]->(i:Item)
  RETURN i.id AS id,
    i.name AS name,
    i.price AS price
`;

// Знайти загальну кількість Items куплені конкретним Customer (через його Order)
const queryFindCustomerItemsN = `
  MATCH (:Customer {id: $customerId})-[:MAKES]->(:Order)-[:CONTAINS]->(i:Item)
  RETURN count(i) AS count
`;

// Знайти для Customer на яку загальну суму він придбав товарів (через його Order)
const queryFindCustomersTotalPrice = `
  MATCH (c:Customer)-[:MAKES]->(:Order)-[:CONTAINS]->(i:Item)
  RETURN c.id AS id,
    c.name AS name,
    sum(i.price) AS total_price
`;

// Знайти скільки разів кожен товар був придбаний, відсортувати за цим значенням
const queryFindOrderedItems = `
MATCH (o:Order)-[c:CONTAINS]->(i:Item)
RETURN i.id AS id,
  i.name AS name,
  i.price AS price,
  count(c) AS count
ORDER BY count
`;

// Знайти всі Items переглянуті (view) конкретним Customer
const queryFindCustomerViewedItems = `
  MATCH (:Customer {id: $customerId})-[:VIEWS]->(i:Item)
  RETURN i.id AS id,
    i.name AS name,
    i.price AS price
`;

// Знайти інші Items що купувались разом з конкретним Item (тобто всі Items що входять до Order-s разом з даними Item)
const queryFindRelatedItems = `
  MATCH (i:Item)<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(:Item {id: $itemId})
  WHERE i.id <> $itemId
  RETURN o.id AS order_id,
    i.id AS item_id,
    i.name AS name,
    i.price AS price
`;

// Знайти Customers які купили даний конкретний Item
const queryFindCustomersThatBoughtItem = `
  MATCH (c:Customer)-[:MAKES]->(o:Order)-[:CONTAINS]->(:Item {id: $itemId})
  RETURN o.id AS order_id,
    c.id AS customer_id,
    c.name AS name
`;

// Знайти для певного Customer(а) товари, які він переглядав, але не купив
const queryFindItemsThatCustomerViewedButNotBought = `
  MATCH (c:Customer {id: $customerId})-[:VIEWS]->(i:Item)
  WHERE NOT EXISTS {
    MATCH (c)-[:MAKES]->(:Order)-[:CONTAINS]->(i)
  }
  RETURN i.id AS id, i.name AS name, i.price AS price
`;

/* ------------ */

const printResult = (text) => {
  return (result) => {
    console.log(text);
    if (result.records.length > 0) {
      console.log(result.records[0].keys);
      console.log(result.records.map((record) => [...record.values()]));
    } else {
      console.log("No records returned");
    }
  };
};

const queries = [
  ...deleteQueries,
  ...insertItems(items),
  ...insertCustomers(customers),
  ...insertOrders(orders),
  ...insertCustomersAndOrders(customersAndOrders),
  ...insertOrdersAndItems(ordersAndItems),
  ...insertCustomersAndItems(customersAndItems),
  buildQuery(
    queryFindOrderItems,
    { orderId: 1n },
    printResult("\nqueryFindOrderItems:")
  ),
  buildQuery(
    queryFindOrderTotalPrice,
    { orderId: 1n },
    printResult("\nqueryFindOrderTotalPrice:")
  ),
  buildQuery(
    queryFindCustomerOrders,
    { customerId: 1n },
    printResult("\nqueryFindCustomerOrders:")
  ),
  buildQuery(
    queryFindCustomerItems,
    { customerId: 1n },
    printResult("\nqueryFindCustomerItems:")
  ),
  buildQuery(
    queryFindCustomerItemsN,
    { customerId: 1n },
    printResult("\nqueryFindCustomerItemsN:")
  ),
  buildQuery(
    queryFindCustomersTotalPrice,
    {},
    printResult("\nqueryFindCustomersTotalPrice:")
  ),
  buildQuery(
    queryFindOrderedItems,
    {},
    printResult("\nqueryFindOrderedItems:")
  ),
  buildQuery(
    queryFindCustomerViewedItems,
    { customerId: 1n },
    printResult("\nqueryFindCustomerViewedItems:")
  ),
  buildQuery(
    queryFindRelatedItems,
    { itemId: 1n },
    printResult("\nqueryFindRelatedItems:")
  ),
  buildQuery(
    queryFindCustomersThatBoughtItem,
    { itemId: 1n },
    printResult("\nqueryFindCustomersThatBoughtItem:")
  ),
  buildQuery(
    queryFindItemsThatCustomerViewedButNotBought,
    { customerId: 1n },
    printResult("\nqueryFindItemsThatCustomerViewedButNotBought:")
  ),
];

(async () => {
  const driver = neo4j.driver(
    `${URI}:${PORT}`,
    neo4j.auth.basic(USERNAME, PASSWORD)
  );

  const session = driver.session({ database: DATABASE });

  try {
    for (const { query, params, callback } of queries) {
      const result = await session.run(query, params);
      callback(result);
    }
  } catch (e) {
    console.error(e);
  }

  session.close();
  driver.close();
})();
