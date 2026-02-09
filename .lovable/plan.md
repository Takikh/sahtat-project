
# Sahtat Promotion — Real Estate Website

## Overview
A modern, professional real estate website for **Sahtat Promotion** (Algeria), featuring full trilingual support (English, French, Arabic with RTL), dark/light mode, and a partial backend with Supabase for authentication and project management.

---

## Phase 1: Foundation & Core Pages

### 1. Branding & Design System
- Custom color palette: deep navy blue, warm gold accent, clean whites — professional and trustworthy
- "Sahtat Promotion" logo placeholder in header
- Dark mode / light mode toggle
- Trilingual support (EN/FR/AR) with `react-i18next`, full RTL layout for Arabic
- Language switcher in the header (flag icons or text)

### 2. Navigation
- Sticky top navigation bar with logo, menu links, language switcher, and dark mode toggle
- Menu items: Home, About Us, Projects, Services, News, Contact
- Mobile-responsive hamburger menu

### 3. Homepage
- **Hero section**: Bold headline with tagline and CTA button ("Discover Our Projects"), background image of Algerian cityscape
- **Featured Projects**: Carousel/grid showing 3-4 highlighted projects with images, name, location, and status
- **Company Values**: Icons + text for Trust, Quality, Innovation, Community
- **Testimonials**: Client quotes carousel
- **News Preview**: Latest 2-3 blog posts
- **Footer**: Contact info, quick links, social media (Facebook link), legal mentions

### 4. About Us Page
- Company history timeline
- Mission & Vision statements
- Team members grid (photo, name, role)
- Certifications & partnerships section

### 5. Projects Page
- Grid of project cards with image, name, city, type, status badge
- Filter bar: by city, property type (apartment, villa, commercial), status (upcoming, in progress, delivered)
- Click into a project detail page with image gallery, description, features list, location, and status

### 6. Services Page
- Cards/sections for each service (construction, project management, after-sales, etc.)
- Icons and descriptions

### 7. News/Blog Page
- List of articles with thumbnail, title, date, excerpt
- Article detail page with full content

### 8. Contact Page
- Contact form (name, email, phone, message)
- Embedded Google Maps showing company location
- Address, phone, email display
- Social media links + WhatsApp quick contact button

---

## Phase 2: Backend & Authentication (Supabase)

### 9. Supabase Setup
- Database tables for: projects, news articles, contact submissions
- Authentication with email/password
- User profiles table
- Role-based access (client vs admin) via user_roles table

### 10. Client Area (after login)
- Dashboard showing purchased properties
- Construction progress tracking with visual progress bars
- Document download section (placeholder)
- Profile management

### 11. Admin Area (after login, admin role only)
- Project CRUD (create, edit, delete projects with image uploads)
- News/blog article management
- Contact form submissions viewer
- Client management

---

## Content & Media
- Placeholder images for projects and team (high-quality stock photos of Algerian real estate and cityscapes)
- All text content in EN, FR, and AR translation files
- Inspired by Bessa Promotion's professional layout but with unique Sahtat Promotion identity
