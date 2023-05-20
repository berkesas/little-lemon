import SQLite from 'react-native-sqlite-storage';

// import { SECTION_LIST_MOCK_DATA } from './utils';

const db = SQLite.openDatabase(
  {
    name: 'little_lemon',
    location: 'default'
  },
  () => {
    // console.log('db opened'); 
  },
  error => {
    console.log("ERROR: " + error);
  }
);

SQLite.enablePromise(true);

function transformResult(results) {
  const temp = [];
  for (let i = 0; i < results.rows.length; ++i)
    temp.push(results.rows.item(i));
  return temp;
}

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, uuid text, name text, price text, description text, image text, category text);',
          [],
          (_, results) => {
            // console.log('db createTable created', results);
            resolve(results)
          },
          (error) => {
            // console.log(error); 
            reject(error)
          }
        );
      }
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, results) => {
        console.log("db getMenuItems:", results.rows);
        resolve(transformResult(results));
      }, (error) => {
        // console.log(error); 
        reject(error)
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    let sql = "INSERT INTO menuitems (id, uuid, name, price, description, image, category) VALUES " + menuItems.map((item, i) => `(${i + 1}, "${i + 1}", "${item.name}", "${item.price}","${item.description}", "${item.image}", "${item.category}")`)
      .join(', ');
    // console.log(sql);
    tx.executeSql(sql, [], (_, results) => {
      // console.log(results);
      resolve(results);
    },
      (error) => {
        console.error(error);
        reject(error);
      });
  });
}

export function deleteMenuItems(menuItems) {
  db.transaction((tx) => {
    // delete function to clean menuitems table
    let sql = "DELETE FROM menuitems;";
    tx.executeSql(sql, [], (_, results) => {
      console.log('deleteMenuItems deleted', results);
      resolve(results);
    },
      (error) => {
        console.error(error);
        reject(error);
      });
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    // console.log(activeCategories);
    let sql = "SELECT * FROM menuitems";
    const conditions = []
    if (query.length > 0) conditions.push("name LIKE '%" + query + "%'");
    if (activeCategories.length != 3) {
      const categoryList = "'" + activeCategories.join("','") + "'";
      conditions.push("category IN (" + categoryList + ")")
    }
    if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ") + ";";
    db.transaction((tx) => {
      tx.executeSql(sql, [], (_, results) => {
        // console.log("filterByQuery:", sql);
        // console.log("filterByQuery rows:", transformResult(results));
        resolve(transformResult(results));
      }, (error) => { console.log(error); reject(error) });
    });
  });
}