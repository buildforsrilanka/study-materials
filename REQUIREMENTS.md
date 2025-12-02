# Learning Platform - Project Requirements

## Project Overview
A full-stack Next.js application that enables educators (creators) to share learning materials and students to access educational content. The platform supports PDF documents (via Google Drive) and YouTube videos, with comprehensive filtering capabilities.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **PDF Viewer**: react-pdf

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Google Drive (for PDFs)
- **Video Hosting**: YouTube

### Deployment
- **Platform**: Vercel (recommended) or any Node.js hosting
- **Database**: Supabase Cloud

---

## User Roles

### 1. Creator (Educator)
Creators can upload and manage learning materials for students to access.

**Capabilities:**
- Upload PDF materials (via Google Drive public URL)
- Add YouTube video links
- Create new subjects or select from existing ones
- Select grade levels (1-13 + University)
- Choose content medium (Sinhala, Tamil, English)
- Add title and description for each material
- View all uploaded materials
- Delete their own materials

### 2. Student
Students can browse and access learning materials with filtering options.

**Capabilities:**
- View latest uploaded materials (default view)
- Filter materials by:
  - Grade level
  - Medium (language)
  - Subject
- View PDF materials with document icon
- View YouTube materials with play icon
- Open PDFs in built-in viewer
- Open YouTube videos in YouTube app/browser
- See title and description for each material

---

## Core Features

### Authentication System
- User registration with role selection (Creator/Student)
- Email and password authentication
- Protected routes based on user roles
- Secure session management
- Logout functionality

### Creator Features

#### Upload Material Form
- **Material Type Selection**: Toggle between PDF and YouTube
- **Title**: Text input (required)
- **Description**: Textarea for brief description (required)
- **URL Input**: 
  - Google Drive shareable link for PDFs
  - YouTube video URL for videos
- **Grade Selection**: Dropdown (1-13 + University level)
- **Medium Selection**: Dropdown (Sinhala/Tamil/English)
- **Subject Management**:
  - Select from existing subjects
  - Create new subjects on-the-fly
- **Form Validation**: URL validation based on type
- **Success Feedback**: Confirmation message and redirect

#### Creator Dashboard
- List all uploaded materials
- Display material type icons (PDF/YouTube)
- Show material metadata (title, description, grade, medium, subject)
- Display upload date
- Delete materials functionality
- Quick access to upload new materials

### Student Features

#### Browse Materials Page
- **Default View**: Latest materials displayed first
- **Material Cards** showing:
  - Icon (Document for PDF, Play button for YouTube)
  - Title
  - Short description
  - Grade level badge
  - Medium badge
  - Subject badge
  
#### Filter System
- **Grade Filter**: Dropdown to filter by grade level
- **Medium Filter**: Dropdown to filter by language
- **Subject Filter**: Dropdown to filter by subject
- **Multiple Filters**: Can combine filters
- **Real-time Results**: Updates as filters change
- **Clear Filters**: Option to reset all filters

#### Material Viewing
- **PDF Materials**: 
  - Click opens in-app PDF viewer
  - Full-screen viewing capability
  - Navigation controls (page up/down)
  - Close button to return to browse
  
- **YouTube Materials**:
  - Click opens in YouTube app (mobile)
  - Opens in new tab (desktop)
  - Direct link to YouTube video

### Subject Management
- Pre-populated common subjects (Math, Science, etc.)
- Creators can add new subjects
- Subjects are shared across all creators
- Subject dropdown auto-updates when new subjects are added

---

## Database Schema

### Tables

#### 1. profiles
Extends Supabase auth.users with additional user information.

```sql
- id (UUID, Primary Key, references auth.users)
- email (TEXT, Unique, Not Null)
- full_name (TEXT, Nullable)
- role (TEXT, Check: 'creator' OR 'student', Not Null)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)
```

#### 2. subjects
Stores all available subjects for categorization.

```sql
- id (UUID, Primary Key)
- name (TEXT, Unique, Not Null)
- created_at (TIMESTAMP WITH TIME ZONE)
```

**Default Subjects:**
- Mathematics
- Science
- English
- Sinhala
- Tamil
- History
- Geography
- ICT
- Physics
- Chemistry
- Biology
- Business Studies
- Economics
- Accounting

#### 3. materials
Stores all learning materials uploaded by creators.

```sql
- id (UUID, Primary Key)
- creator_id (UUID, Foreign Key to profiles.id, Not Null)
- title (TEXT, Not Null)
- description (TEXT, Not Null)
- type (TEXT, Check: 'pdf' OR 'youtube', Not Null)
- url (TEXT, Not Null)
- subject_id (UUID, Foreign Key to subjects.id, Nullable)
- grade (INTEGER, Check: 1-14, Not Null) [14 = University]
- medium (TEXT, Check: 'sinhala', 'tamil', 'english', Not Null)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)
```

**Indexes:**
- creator_id
- subject_id
- grade
- medium
- created_at (DESC for latest first)

### Row Level Security (RLS) Policies

#### profiles Table
- **SELECT**: Public (everyone can view profiles)
- **UPDATE**: Users can update their own profile only

#### subjects Table
- **SELECT**: Public (everyone can view subjects)
- **INSERT**: Creators only

#### materials Table
- **SELECT**: Public (everyone can view materials)
- **INSERT**: Creators only, must set creator_id to their own ID
- **UPDATE**: Creators can update only their own materials
- **DELETE**: Creators can delete only their own materials

---

## Application Structure

```
learning-platform/
├── app/
│   ├── (auth)/                    # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   │
│   ├── (creator)/                 # Creator protected routes
│   │   ├── layout.tsx            # Creator layout with auth check
│   │   └── creator/
│   │       ├── dashboard/
│   │       │   └── page.tsx      # Creator dashboard
│   │       └── upload/
│   │           └── page.tsx      # Upload material form
│   │
│   ├── (student)/                 # Student routes
│   │   ├── layout.tsx            # Student layout
│   │   └── browse/
│   │       └── page.tsx          # Browse materials page
│   │
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   │
│   ├── shared/
│   │   ├── Navbar.tsx            # Navigation component
│   │   └── PDFViewer.tsx         # PDF viewing component
│   │
│   ├── creator/
│   │   ├── UploadForm.tsx        # Material upload form
│   │   └── MaterialsList.tsx     # List of creator's materials
│   │
│   └── student/
│       ├── BrowseMaterials.tsx   # Browse interface
│       ├── FilterBar.tsx         # Filter controls
│       └── MaterialCard.tsx      # Individual material card
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   │
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # App constants (grades, mediums)
│
├── types/
│   └── database.types.ts         # TypeScript types for database
│
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Environment Variables

Required environment variables in `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Google Drive account (for creators to host PDFs)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key from Settings → API
4. Run the database schema in SQL Editor (see DATABASE_SCHEMA.sql)

### Step 2: Initialize Next.js Project
1. Extract project files
2. Open terminal in project directory
3. Run `npm install` to install dependencies
4. Create `.env.local` file with Supabase credentials

### Step 3: Install shadcn/ui
1. Run `npx shadcn-ui@latest init`
2. Select default options when prompted
3. Add required components:
   ```bash
   npx shadcn-ui@latest add button card input label select textarea dialog alert tabs
   ```

### Step 4: Run Development Server
1. Run `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Register as a creator or student
4. Start using the platform!

### Step 5: Production Deployment
1. Push code to GitHub repository
2. Connect to Vercel/Netlify
3. Add environment variables in hosting platform
4. Deploy!

---

## Key Functionalities

### PDF Handling
- Creators upload PDFs to their Google Drive
- Set sharing to "Anyone with the link can view"
- Copy shareable link and paste into platform
- System validates Google Drive URLs
- Built-in PDF viewer for students

### YouTube Integration
- Creators paste YouTube video URLs
- System validates YouTube URLs
- Students can click to open in YouTube app/browser
- Supports both youtube.com and youtu.be formats

### Grade System
- Grades 1-13 for school levels
- Grade 14 represents University level
- Each material must have a grade level
- Students can filter by specific grade

### Medium (Language) System
- Three supported mediums: Sinhala, Tamil, English
- Each material must specify medium
- Students can filter by language preference
- Helps students find content in their preferred language

### Subject System
- Pre-populated with common subjects
- Creators can add new subjects dynamically
- Subjects are optional but recommended
- Shared across all creators
- Students can filter by subject

---

## Security Features

### Authentication Security
- JWT-based authentication via Supabase
- Secure password hashing
- Session management with HTTP-only cookies
- Auto-logout on token expiration

### Authorization
- Row Level Security (RLS) on all tables
- Role-based access control
- Creators can only modify their own materials
- Server-side authentication checks on protected routes

### Data Validation
- URL validation for Google Drive and YouTube links
- Required field validation on all forms
- Grade range validation (1-14)
- Medium enum validation
- XSS protection through React

### Best Practices
- Environment variables for sensitive data
- HTTPS enforced in production
- CORS properly configured
- Input sanitization
- SQL injection prevention through Supabase client

---

## User Flows

### Creator Flow
1. **Registration**: Register → Select "Creator" role → Redirected to dashboard
2. **Upload Material**: Click "Upload" → Fill form → Select type/grade/medium/subject → Submit
3. **Manage Materials**: View dashboard → See all materials → Delete if needed
4. **Create Subject**: While uploading → Click "New Subject" → Enter name → Add

### Student Flow
1. **Registration**: Register → Select "Student" role → Redirected to browse page
2. **Browse Materials**: View latest materials → See icons/titles/descriptions
3. **Filter**: Select grade/medium/subject filters → View filtered results
4. **View PDF**: Click PDF material → Opens in-app viewer → Navigate pages → Close
5. **View YouTube**: Click YouTube material → Opens in YouTube app/browser

---

## Future Enhancements (Optional)

### Phase 2 Features
- Search functionality (by title/description)
- Bookmarking/favorites for students
- Material ratings and reviews
- Comments on materials
- Creator profiles with bio
- Material statistics (view counts)

### Phase 3 Features
- Direct file upload (instead of Google Drive links)
- Multiple file formats (Word, PowerPoint, etc.)
- Live classes/webinars
- Assignment submission system
- Progress tracking for students
- Certificates of completion

### Advanced Features
- AI-powered content recommendations
- Content moderation system
- Mobile app (React Native)
- Offline access to materials
- Multi-language UI support
- Admin dashboard for platform management

---

## Testing Checklist

### Authentication Testing
- [ ] User can register as creator
- [ ] User can register as student
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong credentials
- [ ] User can logout successfully
- [ ] Protected routes redirect to login when not authenticated
- [ ] Users redirected to correct dashboard based on role

### Creator Testing
- [ ] Creator can upload PDF material
- [ ] Creator can upload YouTube material
- [ ] Creator can create new subjects
- [ ] Creator can select existing subjects
- [ ] Creator can view all their materials
- [ ] Creator can delete their materials
- [ ] Creator cannot delete other creators' materials
- [ ] Form validation works correctly

### Student Testing
- [ ] Student can view latest materials
- [ ] Student can filter by grade
- [ ] Student can filter by medium
- [ ] Student can filter by subject
- [ ] Student can combine multiple filters
- [ ] PDF materials open in viewer
- [ ] YouTube materials open in app/browser
- [ ] Material cards display correct information

### General Testing
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Responsive design works on desktop
- [ ] All icons display correctly
- [ ] Loading states work properly
- [ ] Error messages display correctly
- [ ] Success messages display correctly

---

## Support and Documentation

### For Creators
- Ensure PDFs are set to public sharing on Google Drive
- Use descriptive titles and descriptions
- Select appropriate grade levels
- Choose correct medium for content language
- Add subjects for better discoverability

### For Students
- Use filters to find relevant materials
- Check material description before opening
- Report any broken links to creators
- Provide feedback through reviews (if implemented)

### For Developers
- Follow TypeScript best practices
- Use proper error handling
- Implement loading states
- Write semantic HTML
- Maintain consistent code style
- Document complex logic
- Test before deploying

---

## License
MIT