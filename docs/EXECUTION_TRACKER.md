Phase,Task ID,Description,Status,Verification Gate
Track A,AUTH-01,Account Model & Email OTP Generation/Verification Backend,🟡 Next,server/tests/auth.test.js PASS
Track A,AUTH-02,"3-Profile Schema, Profile Switching, & Isolated Progress",⚪ Pending,server/tests/multiuser.test.js PASS
Track A,AUTH-03,Profile Independent Reset Endpoint & Handlers,⚪ Pending,server/tests/profile_reset.test.js PASS
Track A,AUTH-04,Frontend Auth Flow (Email OTP Modal + Profile Selector),⚪ Pending,Vitest UI Component Tests PASS
Track B,DATA-01,Automated Phonetic Transliteration Tooling (sanscript),⚪ Pending,Script check against seed-100.json
Track B,DATA-02,seed-200.json Grapheme Splits & Lessons 15–20 Bundling,⚪ Pending,integrity.test.js zero-empty-boxes
Track B,DATA-03,seed-300.json Grapheme Splits & Lessons 21–25 Bundling,⚪ Pending,integrity.test.js all words valid
Track C,AUDIO-01,Bounded Audio Pre-generation Asset Pipeline (300 Words),⚪ Pending,Clean fallback in audioEngine.js
Track D,OPS-01,"DigitalOcean Setup: PM2 Ecosystem, Nginx Config & Certbot",⚪ Pending,Live URL check on remote MongoDB