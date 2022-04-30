const inquirer = require ("inquirer")
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
      host: '',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Adv83839!',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );

function whatToDo() {
    return inquirer.prompt([
        {
            type:'list',
            name:'todo',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all Employees', 'Add a Department', 'Add a role', 'Add an employee', 'Update an employee role'],
        }
    ])
    
}

function allDepartments()







whatToDo()