# **PicShare - A Simple Image Sharing App**

## **Description**
PicShare is a simple image-sharing platform where users can upload and view images. The app is built using **React** for the frontend, **Node.js** with **Express** for the backend, and **MongoDB** for data storage. It includes basic features like user authentication, image upload, and viewing images.

## **Tech Stack**
### **Frontend**
- **React** (with Create React App or Vite)
- **React Router** (for navigation)
- **Axios** (for API requests)
- **Tailwind CSS** or **Bootstrap** (for styling)
- **React Query** or **Redux Toolkit** (for state management)

### **Backend**
- **Node.js** with **Express**
- **MongoDB** (with **Mongoose** for ORM)
- **Multer** (for handling file uploads)
- **JWT** (for user authentication)
- **Bcrypt** (for password hashing)

## **Features**
- **User Authentication**: Users can register, log in, and manage their sessions.
- **Image Upload**: Users can upload images and save them to the database.
- **Image Gallery**: Users can view uploaded images in a gallery format.
- **Like/Save Images**: Users can like or save images.
- **User Profiles**: Each user has a profile page where their uploaded images are displayed.

## **Installation**

### **1. Clone the repository**
```sh
git clone https://github.com/yourusername/picshare.git
cd picshare
```

### **2. Backend Setup**
- Go to the **backend directory**:
  ```sh
  cd picshare-server
  ```
- Install the required dependencies:
  ```sh
  npm install
  ```
- Create a `.env` file with the necessary configurations:
  ```
  MONGO_URI=your-mongodb-connection-string
  JWT_SECRET=your-secret-key
  PORT=5000
  ```
- Start the backend server:
  ```sh
  npm run dev
  ```

### **3. Frontend Setup**
- Go to the **frontend directory**:
  ```sh
  cd picshare-client
  ```
- Install the required dependencies:
  ```sh
  npm install
  ```
- Start the frontend server:
  ```sh
  npm start
  ```

## **Running the Project**

1. **Start the backend server**:
   - The backend will run on **`http://localhost:5000`**.

2. **Start the frontend server**:
   - The frontend will run on **`http://localhost:3000`**.

Open your browser and visit `http://localhost:3000` to see the app in action.


## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### **📌 Next Steps**
- Add features like **comments**, **search**, and **image categories**.
- Implement **testing** for both frontend and backend.
- Add **deployment instructions** for hosting the app.

Let me know if you'd like more sections or details! 🚀
