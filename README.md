# fleet-manager

## Overview

This project is a web application for managing a vehicle fleet, developed to streamline administrative tasks and improve the efficiency of fleet operations. The application provides features such as vehicle and driver assignment, document storage, and automated notifications for upcoming technical inspections and expiring insurance policies. The system is designed to be responsive, offering a seamless experience on both desktop and mobile devices.

## Features

- **Vehicle and Driver Management**: Track and assign drivers to vehicles, monitor status, and store relevant information.
- **Automated Notifications**: Send reminders for upcoming vehicle inspections and insurance expirations.
- **Document Storage**: Securely store documents related to each vehicle.
- **User Authentication**: Secure user access with Firebase Authentication.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

### Frontend
- **JavaScript/Typescript**
- **React**
- **Next.js**

### Backend
- **Firebase**: Backend-as-a-Service for real-time database, authentication, and file storage.
- **Resend**: Email service for automated notifications and reminders.

### Hosting
- **Vercel**: Hosting platform specialized for Next.js applications, with CI/CD integration for automated deployment.

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Ernest-K/fleet-manager.git
cd fleet-manager
```
2. **Install Dependencies**
```bash
npm install
```
3. **Configure Environment Variables**

Create a .env.local file in the root directory and add the following:
```
# Public Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin Configuration
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_ADMIN_CLIENT_ID=your_firebase_client_id
FIREBASE_ADMIN_AUTH_URI=your_firebase_auth_uri
FIREBASE_ADMIN_TOKEN_URI=your_firebase_token_uri
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=your_auth_provider_cert_url
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=your_client_cert_url

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_resend_from_email
```
4. **Run the Application**
```bash
npm run dev
```
The application should now be running at http://localhost:3000.

## Live version
The application is deployed on Vercel and can be accessed here:
[Fleet Manager Live Version](https://fleet-manager-flame.vercel.app)
