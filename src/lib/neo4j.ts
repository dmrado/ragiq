import neo4j from 'neo4j-driver';

// Получаем данные для подключения из переменных окружения
const URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// Создаем драйвер
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

// Функция для проверки подключения
driver.verifyConnectivity()
    .then(() => console.log('✅ Connected to Neo4j successfully!'))
    .catch((error) => console.error('❌ Neo4j connection failed:', error));

// Экспортируем драйвер для использования в других частях проекта
export { driver };