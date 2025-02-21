
# **PicShare App**

A full-stack web application inspired by Pinterest, built with **React** (frontend), **Node.js** (backend), and **MongoDB** (database). This project allows users to create, view, like, and save posts with images, as well as organize them into boards.

---

## **Features**
1. **User Authentication**:
   - Sign up, log in, and logout.
   - Secure password storage using bcrypt.
   - JWT-based authentication.
2. **Post Management**:
   - Create, view, update, and delete posts.
   - Upload images for posts using Multer and Cloudinary.
3. **Interactions**:
   - Like and save posts.
   - Add comments to posts.
4. **Boards**:
   - Organize posts into boards.
5. **Search**:
   - Search for posts by title or tags.

---

## **Tech Stack**
- **Frontend**: React, Axios, Tailwind CSS/Material-UI.
- **Backend**: Node.js, Express.js, JWT, Multer, Cloudinary.
- **Database**: MongoDB, Mongoose.
- **Deployment**: Vercel (frontend), Render/Heroku (backend).

---

## **Setup Instructions**

### **Prerequisites**
1. **Node.js** installed (v16 or higher).
2. **MongoDB** installed or a MongoDB Atlas account.
3. **Cloudinary** account for image uploads.

---

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/pinterest-clone.git
cd pinterest-clone
```

---

### **2. Set Up the Backend**
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder and add the following environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

---

### **3. Set Up the Frontend**
1. Navigate to the `client` folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` folder and add the following environment variable:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm start
   ```

---

### **4. Run the Application**
- Backend: Accessible at `http://localhost:8080`.
- Frontend: Accessible at `http://localhost:3000`.

---

## **Folder Structure**
```
pinterest-clone/
├── client/                # React frontend
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Pages (Home, Login, Signup, etc.)
│   │   ├── App.js         # Main application component
│   │   ├── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

---

## **API Endpoints**
### **Authentication**
- `POST /api/register` - Register a new user.
- `POST /api/login` - Log in an existing user.

### **Posts**
- `GET /api/posts` - Get all posts.
- `POST /api/posts` - Create a new post.
- `GET /api/posts/:id` - Get a single post by ID.
- `PUT /api/posts/:id` - Update a post by ID.
- `DELETE /api/posts/:id` - Delete a post by ID.

### **Comments**
- `POST /api/posts/:id/comments` - Add a comment to a post.
- `DELETE /api/posts/:id/comments/:commentId` - Delete a comment.

### **Likes**
- `POST /api/posts/:id/like` - Like a post.
- `DELETE /api/posts/:id/like` - Remove like from a post.

### **Boards (Optional)**
- `GET /api/boards` - Get all boards.
- `POST /api/boards` - Create a new board.
- `GET /api/boards/:id` - Get a single board by ID.
- `PUT /api/boards/:id` - Update a board by ID.
- `DELETE /api/boards/:id` - Delete a board by ID.

---

## **Contributing**
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**
- Inspired by Pinterest.
- Built using React, Node.js, and MongoDB.

---

## **Contact**
For questions or feedback, feel free to reach out:
- **Yeabsira**: [yeabsira710@gmail.com](mailto:yeabsira710@gmail.com)
- **GitHub**: [deepblue-dot](https://github.com/deepblue-dot)

---

This README provides a clear overview of the project, setup instructions, and guidelines for contributing. Let me know if you’d like to add or modify anything! 😊
