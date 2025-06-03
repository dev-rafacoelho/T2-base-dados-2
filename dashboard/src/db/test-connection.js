const mysql = require("mysql2/promise");

async function testConnection() {
  const connection = await mysql.createConnection({
    host: "easypanel.rafaelcoelho.shop",
    port: 3307,
    user: "mysql",
    password: "b0a0b7fe2d93e4e5c1b6",
    database: "projeto_wellynton",
  });

  try {
    // Test the connection
    console.log("Conectado ao MySQL com sucesso!");

    // Get all table names
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\nTabelas no banco de dados:");
    tables.forEach((table) => {
      console.log(Object.values(table)[0]);
    });

    // Get data from Cartoes table
    console.log("\nDados da tabela Cartoes:");
    const [rows] = await connection.query("SELECT * FROM cartoes LIMIT 5");
    console.log(rows);
  } catch (error) {
    console.error("Erro ao conectar:", error);
  } finally {
    await connection.end();
  }
}

testConnection();
