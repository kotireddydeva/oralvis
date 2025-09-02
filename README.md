# OralVis Healthcare

OralVis Healthcare is a full-stack web application designed to streamline the management of patient dental scans. The application allows:

* **Technicians** to upload patient scan images with relevant details.
* **Dentists** to view and download stored scans and generate PDF reports.

The focus is on role-based authentication, data storage, and easy retrieval of patient scans.

---

## Tech Stack

* **Frontend**: React.js (Vite)
* **Backend**: Node.js with Express.js
* **Database**: SQLite
* **Cloud Storage**: Cloudinary (for scan image uploads)
* **PDF Generation**: jsPDF / pdf-lib (for per-scan PDF reports)

---

## Features

### 1. Role-Based Login

* Two roles: **Technician** and **Dentist**
* Login using **email + password**
* Only **Technicians** can upload scans
* Only **Dentists** can view scans

### 2. Technician – Upload Page

Form Fields:

* Patient Name
* Patient ID
* Scan Type: RGB
* Region: Frontal / Upper Arch / Lower Arch
* Upload Scan Image (JPG/PNG)

On submission:

* Image is uploaded to **Cloudinary** (or AWS S3)
* All form data + image URL + upload date + timestamp is saved to **SQLite**

### 3. Dentist – Scan Viewer Page

Displays all stored scans:

* Patient Name
* Patient ID
* Scan Type
* Region
* Upload Date
* Image Thumbnail

**Actions**:

* Button to **View Full Image**
* Button to **Download PDF Report** for each scan

### 4. Downloadable PDF Report

Each scan report includes:

* Patient Name & ID
* Scan Type & Region
* Upload Date
* Embedded scan image

---

## Steps to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/kotireddydeva/oralvis.git
cd oralvis
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
node index.js
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend folder with:

```env
SECRET_KEY = ORALVIS_MY_SECRET_KEY
PORT = 3000
CLOUDINARY_CLOUD_NAME=dyz8l9er0
CLOUDINARY_API_KEY=295587931669514
CLOUDINARY_API_SECRET=IVsIyLHV9qGp3U510apdFuOrOFI

```

### 4. Start the Backend Server

```bash
cd backend
npm start
```

Backend runs on `http://localhost:3000` by default.

### 5. Start the Frontend

```bash
cd ../frontend
npm run dev
```

Open your browser at `http://localhost:5173` (Vite default) to access the app.

---

## Hosted Demo

Live demo is available here:
[https://oralvis-delta.vercel.app](https://oralvis-delta.vercel.app)

**Note:** Vercel does not support SQLite, so the demo runs without persistent database storage.

---

## Screenshots

**Technician Upload Page**
![Upload Page](https://github.com/kotireddydeva/oralvis/blob/main/technician.png)
*Technician can enter patient info and upload scan images.*

**Dentist Scan Viewer**
![Scan Viewer](https://github.com/kotireddydeva/oralvis/blob/main/dentist.png)
*Dentist can view all scans and generate PDF reports.*

**PDF Report Example**
![PDF Report](https://github.com/kotireddydeva/oralvis/blob/main/pdf.png)
*Automatically generated report for a selected scan.*

---

