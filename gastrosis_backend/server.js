require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { convertLocaleTimeString } = require('./widgets');

const port = process.env.API_PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/api/', (req, res) => {
  res.json({ message: 'Veritabanı Bağlantısı Başarılı!' });
});

app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  pool.query('SELECT Users.*, Employees.Position FROM Users JOIN Employees ON Users.EmployeeID = Employees.EmployeeID WHERE Users.username = ?', [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Service Unavailable.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username and password.' });
    }

    const user = results[0];

    if (password === user.Password) {
      return res.json(
        {
          success: true,
          result: {
            username,
            userID: user["UserID"],
            userRole: user["Position"]
          }

        });
    } else {
      return res.status(401).json({ error: 'Password incorrect.' });
    }
  });
});

app.get('/api/tables', async (req, res) => {
  try {
    const [results] = await pool.promise().query('SELECT * FROM Tables');
    res.json(results);
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ error: 'Sunucuda bir hata oluştu.' });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    const [results] = await pool.promise().query('SELECT * FROM Menu');
    res.json(results);
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ error: 'Sunucuda bir hata oluştu.' });
  }
});

app.post('/api/menu/delete', async (req, res) => {
  try {
    const { ItemID } = req.body;
    console.log(req.body)
    if (!ItemID) {
      return res.status(400).json({ error: 'Item ID required.' });
    }

    const [result] = await pool.promise().query(
      'DELETE FROM Menu WHERE MenuItemID = ?',
      [ItemID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'There is no such item with this ID.' });
    } else {
      return res.json({ message: 'Item successfully deleted.' });
    }

  } catch (error) {
    console.error('Database Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/menu/edit', async (req, res) => {
  try {
    const { productID, productName, productDescription, productPrice, category } = req.body;
    console.log(req.body)
    if (!productID) {
      return res.status(400).json({ error: "Item ID Required" })
    }

    const [result] = await pool.promise().query(
      'UPDATE Menu SET Name = ?, Description = ?, Price = ?, Category = ? WHERE MenuItemID = ?',
      [productName, productDescription, productPrice, category, productID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'There is no item with this ID' });
    }
    else {
      return res.json({ message: 'Menu item successfully updated.' })
    }
  } catch (error) {
    console.error('Database Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
})

app.post('/api/menu/add', async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    console.log(req.body)

    if (!name || !price || !category || !description) {
      return res.status(400).json({ error: 'There are missing fields.' })
    }

    const [result] = await pool.promise().query(
      'INSERT INTO Menu (Name, Description, Price, Category) VALUES  (?, ?, ?, ?)',
      [name, description, price, category]
    );

    if (result.affectedRows > 0) {
      return res.status(201).json({ message: 'Menu item successfully added.' })
    }
    else {
      return res.status(500).json({ error: 'Menu item cannot added.' })
    }

  } catch (error) {
    console.error('Database Error', error);
    res.status(500).json({ error: 'Server Error' });
  }
})

app.get('/api/employees', async (req, res) => {
  try {
    const [results] = await pool.promise().query('SELECT * FROM Employees');

    // Her bir çalışan için tam isim oluşturmak üzere sonuçlar üzerinde döngü yapıyoruz
    const employees = results.map(employee => ({
      EmployeeID: employee.EmployeeID,
      EmployeeName: `${employee.FirstName} ${employee.LastName}`,
      Phone: employee.Phone,
      Position: employee.Position,
      ShiftStart: employee.ShiftStart,
      ShiftEnd: employee.ShiftEnd
    }));

    res.json(employees);
  } catch (error) {
    console.error('Database Error.', error);
    res.status(500).json({ error: 'Server Error.' });
  }
});

app.post('/api/newproduct', async (req, res) => {
  const { tableId, menuItemId, quantity, employeeId, orderTime } = req.body;

  try {
    const [existingOrders] = await pool.promise().query(
      'SELECT * FROM Orders WHERE tableID = ? AND ActiveOrder = 1',
      [tableId]
    );

    let orderId;

    if (existingOrders.length > 0) {
      orderId = existingOrders[0]?.OrderID;
    } else {
      const [result] = await pool.promise().query(
        'INSERT INTO Orders (tableID, employeeID, ActiveOrder, orderTime) VALUES (?, ?, 1, ?)',
        [tableId, employeeId, orderTime || new Date().toISOString()]
      );
      orderId = result.insertId;
    }

    if (!orderId) {
      throw new Error('OrderID could not be determined');
    }

    await pool.promise().query(
      'INSERT INTO OrderDetails (OrderID, menuItemID, Quantity, Status) VALUES (?, ?, ?, "Preparing")',
      [orderId, menuItemId, quantity]
    );

    res.status(201).json({ message: 'Product Added Successfully.' });
  } catch (error) {
    console.error('Database Error.', error);
    res.status(500).json({ error: 'Server Error.' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const tableId = req.body.tableId;
    const [OrderIDRes] = await pool.promise().query(
      'SELECT DISTINCT o.OrderID FROM OrderDetails od INNER JOIN Orders o ON od.OrderID = o.OrderID WHERE o.ActiveOrder = 1 AND o.TableID = ?',
      [tableId]
    );
    if (OrderIDRes.length === 0) {
      return res.json({
        success: false,
        error: "No active orders found for this table."
      });
    }
    const orderId = OrderIDRes[0].OrderID;
    if (OrderIDRes.length === 0) {
      return res.json({ success: false, error: "No active orders found for this table." });
    }
    const [results] = await pool.promise().query('SELECT od.Quantity, m.Name, m.Price FROM OrderDetails od INNER JOIN Orders o ON od.OrderID = o.OrderID INNER JOIN Menu m ON od.MenuItemID = m.MenuItemID WHERE o.ActiveOrder = 1 AND o.TableID = ?', [tableId]);
    // const details = results.map(detail => ({
    //   menuItemName: detail.Name,
    //   quantity: detail.Quantity,
    //   price: detail.Price
    // }));
    console.log(OrderIDRes)
    console.log(results)
    return res.json({
      success: true,
      orderId,
      result: results
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })
  }
})

app.get('/api/orderpage', async (req, res) => {
  try {
    const [results] = await pool.promise().query(
      "SELECT o.OrderID AS orderID, e.FirstName AS employeeName, t.Table_Name AS tableName, o.OrderTime AS orderTime, o.TotalAmount AS totalAmount, o.ActiveOrder AS activeOrder, JSON_ARRAYAGG(JSON_OBJECT('orderDetailID', od.OrderDetailID, 'menuItemName', m.Name, 'quantity', od.Quantity, 'price', m.Price)) AS details FROM Orders o JOIN Employees e ON o.EmployeeID = e.EmployeeID JOIN Tables t ON o.TableID = t.TableID JOIN OrderDetails od ON o.OrderID = od.OrderID JOIN Menu m ON od.MenuItemID = m.MenuItemID GROUP BY o.OrderID, e.FirstName, t.Table_Name, o.OrderTime, o.TotalAmount, o.ActiveOrder;"
    )
    res.json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.post('/api/handlepayment', async (req, res) => {
  try {
    const { paymentMethod, orderId, totalAmount } = req.body;
    // Order'ı güncelle.
    await pool.promise().query(
      'UPDATE Orders SET ActiveOrder = false, TotalAmount = ? WHERE OrderID = ?',
      [totalAmount, orderId]
    );

    await pool.promise().query(
      'INSERT INTO Payments (PaymentMethod, Amount, OrderID, PaymentTime) VALUES (?, ?, ?, NOW())',
      [paymentMethod, totalAmount, orderId]
    );

    res.json({
      success: true,
      message: "Payment successfully Done!"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })

  }
})

app.get('/api/shift', async (req, res) => {
  try {
    const [results] = await pool.promise().query('SELECT * FROM Employees')
    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })

  }
})

app.post('/api/shift/addshift', async (req, res) => {
  try {

    const { FirstName, LastName, Phone, Position, ShiftStart, ShiftEnd } = req.body;
    await pool.promise().query(
      'INSERT INTO Employees (FirstName, LastName, Phone, Position, ShiftStart, ShiftEnd) VALUES (?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, Phone, Position, convertLocaleTimeString(ShiftStart), convertLocaleTimeString(ShiftEnd)]
    );

    res.json({ message: "Employee Successfully Added." }); // Güncellendi mesajı
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })
  }
})

app.post('/api/shift/updateshift', async (req, res) => {
  try {
    const { EmployeeID, FirstName, LastName, Phone, Position, ShiftStart, ShiftEnd } = req.body;

    const [result] = await pool.promise().query(
      'UPDATE Employees SET FirstName = ?, LastName = ?, Phone = ?, Position = ?, ShiftStart = ?, ShiftEnd = ? WHERE EmployeeID = ?',
      [FirstName, LastName, Phone, Position, convertLocaleTimeString(ShiftStart), convertLocaleTimeString(ShiftEnd), EmployeeID]
    )

    res.json({ message: "Employee Successfully Updated." }); // Güncellendi mesajı
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })
  }
})

app.post('/api/shift/deleteshift', async (req, res) => {
  try {
    const { EmployeeID } = req.body;

    const [result] = await pool.promise().query('DELETE FROM Employees WHERE EmployeeID = ?', [EmployeeID])
    if (result.affectedRows === 0) {
      res.status(404).json("There is no Employee with this ID");
    } else {
      res.status(200).json({ message: "Employee Successfully Deleted." });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })
  }
})

app.get('/api/inventory', async (req, res) => {
  try {
    const [results] = await pool.promise().query('SELECT * FROM Inventory');
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error." })
  }
})

app.post('/api/inventory/additem', async (req, res) => {
  try {
    const {ItemName, Quantity} = req.body;
    if (!ItemName || !Quantity || isNaN(Quantity) || Quantity <= 0) {
      return res.status(400).json({ error: "Invalid item data. Please provide a valid ItemName and a positive Quantity." });
    }
    const [existingItem] = await pool.promise().query(
      'SELECT * FROM Inventory WHERE ItemName = ?', [ItemName]
    );

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].Quantity + Quantity;
      await pool.promise().query(
        'UPDATE Inventory SET Quantity = ? WHERE ItemName = ?',
        [newQuantity, ItemName]
      );
      res.json({ message: "Item quantity updated successfully." });
    }
    else {
      await pool.promise().query(
        'INSERT INTO Inventory (ItemName, Quantity) VALUES (?, ?)',
        [ItemName, Quantity]
      );
      res.json({ message: "Item added to inventory successfully." });
    }

    await pool.promise().query('')
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })
  }
})

app.post('/api/inventory/deleteitem', async (req, res) => {
  try {
    const {InventoryID} = req.body;
    const [result] = await pool.promise().query('DELETE FROM Inventory WHERE InventoryID = ?', [InventoryID]);
    if(result.affectedRows === 0){
      res.status(404).json({error: "There is no such item in inventory."});
    }
    else{
      res.status(200).json({message: "Item deleted from inventory successfully."})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error." })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
