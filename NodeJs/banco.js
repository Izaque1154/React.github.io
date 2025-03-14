const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, 
        },
    },
    logging: false, 
});

// Testando a conexão
sequelize.authenticate()
    .then(() => console.log("Conectado ao PostgreSQL com sucesso!"))
    .catch(err => console.error("Erro ao conectar ao banco de dados:", err));
    


// Modelo de usuários
const usuarios = sequelize.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    senha: Sequelize.STRING(255)
});

// Modelo de tarefas
const tarefas = sequelize.define('tarefas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: usuarios,
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    tarefa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    concluida: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

// Associação entre usuários e tarefas
usuarios.hasMany(tarefas, { foreignKey: 'usuarioId' });
tarefas.belongsTo(usuarios, { foreignKey: 'usuarioId' });

// Sincronizando os modelos com o banco
sequelize.sync({ alter: true })
    .then(() => console.log("Tabelas sincronizadas com sucesso!"))
    .catch((error) => console.log("Erro ao sincronizar o banco de dados:", error));

module.exports = { usuarios, tarefas };
