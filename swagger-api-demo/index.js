// index.js
const express = require('express');
const setupSwagger = require('./swagger');
const jwt = require ('jsonwebtoken');

const authenticateToken = require('./auth.js');

const app = express();
app.use(express.json());

const users = [
  {id:1,
    username:'Admin',
    password:'Axity24'
  },
  {id:2,
    username:'Marco',
    password:'123456'
  },
  {id:3,
    username:'Raul',
    password:'Raul24'
  }
]

const students = [
  {
    "id": 1,
    "firstName": "Jose",
    "lastName": "Montaño",
    "age": 21,
    "email": "Jose@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 2,
    "firstName": "Marco",
    "lastName": "Mejia",
    "age": 23,
    "email": "Marco@axity.com",
    "enrollmentNumber": "2024-002",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "C"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 3,
    "firstName": "Miguel",
    "lastName": "Montaño",
    "age": 21,
    "email": "Mike@axity.com",
    "enrollmentNumber": "2024-003",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "D"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  }
]

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
 
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
 
  const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of items
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items',authenticateToken, (req, res) => {
  res.status(200).json(students);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 */

app.post('/items',authenticateToken, (req, res) => {
  const {firstName,lastName,age,email,enrollmentNumber,courses,status} = req.body;
  const studentObject = {
    id: students.length + 1,
    firstName,
    lastName,
    age,
    email,
    enrollmentNumber,
    courses,
    status
  }
  students.push(studentObject);
  res.status(201).json({ 
    message: 'Se he agregado un estudiante',
    nuevoEstudiante: studentObject 
  });
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               enrollmentNumber:
 *                 type: string
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Item not found
 */

app.get('/items/:id',authenticateToken, (req, res) => {
  const itemId = parseInt(req.params.id);
  const student = students.find(student => student.id === itemId);

  if(student){
    res.status(200).json(student)
  }else{
    res.status(404).json({ message: `No se encontró ID: ${itemId}` });
  }
  
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
app.put('/items/:id',authenticateToken, (req, res) => {
  const itemId = parseInt(req.params.id);
  const { firstName, lastName, age, email, enrollmentNumber, courses, status } = req.body;
  const index = students.findIndex(student => student.id === itemId);

  if (index !== -1) {
    students[index] = {
      ...students[index],
      firstName,
      lastName,
      age,
      email,
      enrollmentNumber,
      courses,
      status
    };

    res.status(200).json({
      message: `Estudiante con ID ${itemId} actualizado`,
      updatedStudent: students[index]
    });
  } else {
    res.status(404).json({ message: `No se encontró ID: ${itemId}` });
  }
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
app.delete('/items/:id',authenticateToken, (req, res) => {
  const itemId = parseInt(req.params.id);

  // Encuentra el índice del estudiante con el ID proporcionado
  const index = students.findIndex(student => student.id === itemId);

  if (index !== -1) {
    // Elimina el estudiante del arreglo
    students.splice(index, 1);

    res.status(200).json({ message: `Estudiante con ID ${itemId} eliminado` });
  } else {
    res.status(404).json({ message: `No se encontró ID: ${itemId}` });
  }
});

// Setup Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
