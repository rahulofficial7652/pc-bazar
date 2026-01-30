<div align="center">

# 🖥️ PC Bazar

### Your One-Stop Shop for Premium IT Products

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

**PC Bazar** is a modern, full-stack e-commerce platform specializing in **IT products** including laptops, desktops, computer components, peripherals, and accessories. Built with cutting-edge technologies for a seamless shopping experience.

[🌐 Live Demo](https://pcbazar.in/) • [📖 Documentation](./docs/) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📸 Screenshots

<div align="center">

| Home Page | Product Listing | Admin Dashboard |
|:---------:|:---------------:|:---------------:|
| ![Home](#) | ![Products](#) | ![Admin](#) |

</div>

---

## ✨ Features

### 🛒 Customer Features
- **Product Catalog** - Browse extensive collection of IT products
- **Category Filtering** - Find products by categories (Laptops, Desktops, Components, etc.)
- **Product Details** - Detailed specifications and multiple product images
- **Discount Pricing** - View original and discounted prices
- **Responsive Design** - Seamless experience across all devices
- **Dark/Light Mode** - Theme toggle for user preference

### 🔐 Authentication
- **Secure Login/Signup** - User authentication with NextAuth.js
- **Session Management** - Secure JWT-based sessions
- **Password Encryption** - Bcrypt password hashing

### 📦 Admin Panel
- **Dashboard Analytics** - Overview of orders, products, and users
- **Product Management** - Add, edit, delete products with image upload
- **Category Management** - Create and manage product categories
- **Order Management** - Track and update order statuses
- **Image Upload** - Cloudinary integration for media storage

### 🛠️ Technical Features
- **Type-Safe APIs** - Robust error handling with custom AppError class
- **Centralized Error Handling** - Consistent error responses across all endpoints
- **Image Compression** - Client-side image optimization before upload
- **Real-time Notifications** - Toast notifications using Sonner

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library with latest features |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Beautiful icons |
| **Sonner** | Toast notifications |
| **next-themes** | Dark/Light mode support |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **MongoDB + Mongoose** | Database & ODM |
| **NextAuth.js** | Authentication |
| **Cloudinary** | Image storage & CDN |
| **bcryptjs** | Password hashing |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Vercel** | Deployment platform |
| **Vercel Analytics** | Performance monitoring |
| **ESLint** | Code linting |

---

## 📁 Project Structure

```
pc-bazar/
├── 📂 docs/                    # Documentation
│   ├── README_API_v1.md        # API documentation
│   └── error-documentation.md  # Error handling guide
├── 📂 public/                  # Static assets
├── 📂 scripts/                 # Utility scripts
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 (auth)/          # Auth pages (login, signup)
│   │   ├── 📂 admin/           # Admin panel
│   │   │   ├── 📂 categories/  # Category management
│   │   │   ├── 📂 orders/      # Order management
│   │   │   └── 📂 products/    # Product management
│   │   ├── 📂 api/             # API routes
│   │   │   ├── 📂 auth/        # Auth endpoints
│   │   │   └── 📂 v1/          # API v1 endpoints
│   │   ├── 📂 categories/      # Category pages
│   │   ├── 📂 dashboard/       # User dashboard
│   │   └── 📂 products/        # Product pages
│   ├── 📂 components/
│   │   ├── 📂 admin/           # Admin components
│   │   ├── 📂 home/            # Home page components
│   │   ├── 📂 sidebar/         # Sidebar components
│   │   ├── 📂 theme/           # Theme components
│   │   └── 📂 ui/              # Shadcn UI components
│   ├── 📂 lib/
│   │   ├── 📂 auth/            # Auth utilities
│   │   ├── 📂 db/              # Database connection
│   │   ├── 📂 errors/          # Error handling system
│   │   ├── 📂 frontend/        # Frontend utilities
│   │   ├── 📂 utils/           # Utility functions
│   │   └── 📂 validations/     # Input validations
│   └── 📂 models/              # Mongoose models
│       ├── category.ts
│       ├── order.ts
│       ├── product.ts
│       └── user.ts
├── 📄 .env                     # Environment variables
├── 📄 package.json
└── 📄 tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **MongoDB** (Atlas or local)
- **Cloudinary** account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pc-bazar.git
   cd pc-bazar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://your-connection-string
   
   # NextAuth
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Test Database Connection

```bash
npm run db:test
```

---

## 📚 API Documentation

The API follows RESTful conventions with versioned endpoints.

### Base URL
```
/api/v1/
```

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/products` | Get all products |
| `POST` | `/api/v1/products` | Create a product |
| `GET` | `/api/v1/products/:id` | Get product by ID |
| `PUT` | `/api/v1/products/:id` | Update product |
| `DELETE` | `/api/v1/products/:id` | Delete product |
| `GET` | `/api/v1/categories` | Get all categories |
| `POST` | `/api/v1/categories` | Create category |
| `GET` | `/api/v1/orders` | Get all orders |
| `POST` | `/api/v1/orders` | Create order |
| `GET` | `/api/v1/admin/stats` | Get admin statistics |

📖 **Full API documentation available at:** [`docs/README_API_v1.md`](./docs/README_API_v1.md)

---

## 🎯 Product Categories

| Category | Products Include |
|----------|------------------|
| 💻 **Laptops** | Gaming, Business, Student laptops |
| 🖥️ **Desktops** | Pre-built PCs, Custom builds |
| ⚙️ **Components** | CPUs, GPUs, RAM, Storage, PSUs |
| 🖱️ **Peripherals** | Keyboards, Mice, Monitors, Headsets |
| 🌐 **Networking** | Routers, Switches, Network cards |
| 🔌 **Accessories** | Cables, Adapters, Cooling solutions |

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:test` | Test database connection |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful component library
- [Vercel](https://vercel.com/) - Hosting platform
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Cloudinary](https://cloudinary.com/) - Media management

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for the IT community

</div>
