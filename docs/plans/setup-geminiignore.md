# Objective
Create a `.geminiignore` file at the root of the project to reduce the baseline context usage by ignoring dependencies, build artifacts, environment secrets, and binary assets.

# Key Files & Context
- `/.geminiignore` (New File)

# Implementation Steps
1. Create `/.geminiignore` with the following content:
   ```text
   # Version Control
   .git/

   # Dependencies
   node_modules/
   client/node_modules/
   server/node_modules/

   # Environment Variables
   .env
   .env.*
   !.env.example

   # Build Outputs (for when Vite builds the PWA)
   dist/
   build/
   client/dist/

   # Logs and OS files
   *.log
   npm-debug.log*
   .DS_Store
   Thumbs.db

   # Binary Assets & Media (I don't need to read raw images/audio)
   *.png
   *.jpg
   *.svg
   *.ico
   *.mp3
   *.wav
   *.ogg
   client/public/
   client/src/assets/
   ```

# Verification & Testing
- Ensure the file is created at the root directory.
- Verify that the file contains the exact specified ignore patterns.
