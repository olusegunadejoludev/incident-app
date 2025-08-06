# 🚨 Incident Reporting App

A simple and effective incident reporting system built with React and powered by JSONBin.io for backend storage. Users can report incidents by category, attach optional images, and view a dashboard of submitted reports.

![Screenshot](/src/assets/img/incident-logo.png)

## Features

🔐 User Authentication (Register, Login, Logout)
🗂️ Categorized Incident Reports (e.g., Fire, Oil Spill, Flood)
📸 Optional Image Upload for Reports
🧾 Detailed Incident Descriptions
📄 Admin & User Dashboards
📨 Contact Form with EmailJS Integration
💻 Responsive UI (Mobile & Desktop)

## Technologies Used

### Frontend
- React
- React Router DOM
- Axios
- Bootstrap (React-Bootstrap)

### Backend
- EmailJS (for contact form)
- JSONBin.io (used as REST API storage)

## How to Use

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/olusegunadejoludev/incident-app.git
   ```
   
2. Navigate to the project directory:
   ```
   cd incident-app
   ```
   
3. Install dependencies:
   ```
   npm install
   ```
  
4. Set up environment variables:
   - Create a .env file in the root of the project and add the following variables:
     ```
     REACT_APP_JSONBIN_API_KEY=your_jsonbin_api_key
     REACT_APP_JSONBIN_BIN__USER_ID=your_users_bin_id
     REACT_APP_JSONBIN_BIN__POSTS_ID=your_posts_bin_id

      REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
      REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
      REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

     ```
    
5. ▶️ Run the App:
   ```
   # Navigate to the project directory
   cd incident-app

   # Start the server
   npm start
   ```
   
6. Open your web browser and visit http://localhost:3000 to use the incident app.

7. 📬 Contact Form Setup (EmailJS)
   
   To enable the contact form:
   ```
   Create an account at EmailJS
   Set up your email service, template, and get your public key
   Copy those values into your .env file as shown above

   ```
   
8.  Image Upload Support

   To enable image upload support:
   ```
   When creating or editing an incident post, users can upload an image file. This image is stored as a base64 string in the JSONBin data for that post and rendered in the incident app UI.

   ```

9.  🧩 Incident Categories Supported
     
     The incident app supports the following categories:
   - 🔥 Fire Outbreak
   - 🌊 Flooding
   - 🛢️ Oil Spills
   - 🧍 Assault
   - 🚨 Robbery
   - ⚡ Power Failure
   - 🚗 Road Accident
   - 🦠 Environmental Hazard
   - 🏚️ Building Collapse

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you would like to contribute to this project.