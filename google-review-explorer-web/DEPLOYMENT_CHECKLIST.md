# 🚀 Deployment Checklist - Place Review Explorer

## ✅ Legal Compliance - COMPLETED

All legal requirements have been implemented in the application:

### 1. Privacy Policy ✅
- **Location:** `/privacy` route
- **File:** `src/pages/PrivacyPolicyPage.tsx`
- **Includes:**
  - Data collection disclosure
  - Third-party services (Google, Groq)
  - Cookie/localStorage usage
  - User rights (GDPR, CCPA)
  - Data retention policies
  - Contact information

### 2. Terms of Service ✅
- **Location:** `/terms` route
- **File:** `src/pages/TermsOfServicePage.tsx`
- **Includes:**
  - Service description
  - User obligations
  - Rate limits (10 searches/day)
  - Disclaimer of warranties
  - Limitation of liability
  - Intellectual property rights

### 3. Cookie Consent Banner ✅
- **File:** `src/components/CookieConsent.tsx`
- **Features:**
  - Shows on first visit
  - Accept/Reject buttons
  - Link to Privacy Policy
  - Stores consent in localStorage
  - GDPR compliant

### 4. Footer with Legal Links ✅
- **File:** `src/components/Footer.tsx`
- **Includes:**
  - Privacy Policy link
  - Terms of Service link
  - Contact email link
  - Google attribution
  - Copyright notice

### 5. Google Attribution ✅
- **Location:** Place Details page
- **Text:** "Data from Google Places API"
- **Footer:** "Powered by Google Places API"

---

## 📝 Before Deployment - ACTION REQUIRED

### **CRITICAL: Update Contact Information**

You MUST update your email address in these files:

1. **`src/pages/PrivacyPolicyPage.tsx`**
   - Line ~180: Replace `[Your Email Address]` with your real email

2. **`src/pages/TermsOfServicePage.tsx`**
   - Line ~220: Replace `[Your Email Address]` with your real email
   - Line ~200: Replace `[Your Country/State]` with your jurisdiction
   - Line ~210: Replace `[Your Jurisdiction]` with your jurisdiction

3. **`src/components/Footer.tsx`**
   - Line ~60: Replace `your-email@example.com` with your real email

### **Search and Replace:**
```bash
# In the google-review-explorer-web directory:
grep -r "\[Your Email Address\]" src/
grep -r "your-email@example.com" src/
grep -r "\[Your Country/State\]" src/
grep -r "\[Your Jurisdiction\]" src/
```

---

## 🔐 Environment Variables

Make sure your `.env` file is configured:

```env
REACT_APP_GOOGLE_API_KEY=your_actual_google_api_key
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/review
```

**Important:**
- ✅ `.env` is in `.gitignore` (don't commit API keys!)
- ✅ Set environment variables in your hosting platform

---

## 🌐 Hosting Platform Setup

### **Recommended Platforms:**
- **Vercel** (easiest, free tier)
- **Netlify** (easy, free tier)
- **AWS Amplify**
- **Google Cloud Run**

### **Environment Variables to Set:**
1. `REACT_APP_GOOGLE_API_KEY` - Your Google API key
2. `REACT_APP_N8N_WEBHOOK_URL` - Your n8n webhook URL

### **Build Command:**
```bash
npm run build
```

### **Output Directory:**
```
build/
```

---

## 🔒 Security Checklist

- ✅ API keys in environment variables (not in code)
- ✅ `.env` in `.gitignore`
- ✅ Rate limiting implemented (10 searches/day)
- ✅ HTTPS required for production
- ✅ CORS configured properly
- ✅ No sensitive data in localStorage

---

## 📊 Google API Setup

### **Required APIs (Enable in Google Cloud Console):**
1. ✅ Places API (New)
2. ✅ Maps Embed API (for iframe maps)

### **API Key Restrictions (Recommended):**
1. **Application restrictions:**
   - HTTP referrers (websites)
   - Add your domain: `https://yourdomain.com/*`

2. **API restrictions:**
   - Restrict to: Places API (New)

---

## 💰 Cost Monitoring

### **Set up billing alerts in Google Cloud:**
1. Go to Google Cloud Console → Billing
2. Set budget alert at €15/month (75% of your €20 limit)
3. Set second alert at €18/month (90% of limit)

### **Expected Costs:**
- 10 users × 10 searches/day = 100 searches/day
- 100 × $0.01 = $1/day = ~$30/month
- **Recommendation:** Lower rate limit to 5-7 searches/day if needed

---

## 🧪 Pre-Deployment Testing

### **Test These Features:**
- [ ] Search functionality
- [ ] Place details loading
- [ ] AI summary generation
- [ ] Language selection
- [ ] Rate limiting (try 11 searches)
- [ ] Cookie consent banner
- [ ] Privacy Policy page loads
- [ ] Terms of Service page loads
- [ ] Footer links work
- [ ] Google Maps embed displays
- [ ] Mobile responsiveness

### **Test on Multiple Browsers:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## 🚀 Deployment Steps

### **1. Update Contact Info (REQUIRED)**
- Replace all `[Your Email Address]` placeholders
- Replace `[Your Country/State]` and `[Your Jurisdiction]`

### **2. Build the App**
```bash
cd google-review-explorer-web
npm run build
```

### **3. Deploy to Hosting Platform**

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### **4. Set Environment Variables**
In your hosting platform dashboard:
- `REACT_APP_GOOGLE_API_KEY`
- `REACT_APP_N8N_WEBHOOK_URL`

### **5. Configure Custom Domain (Optional)**
- Add your domain in hosting platform
- Update DNS records
- Enable HTTPS (automatic on Vercel/Netlify)

### **6. Update Google API Restrictions**
- Add your production domain to HTTP referrers
- Example: `https://yourdomain.com/*`

---

## 📱 Post-Deployment

### **Monitor:**
- [ ] Google Cloud Console → API usage
- [ ] Error logs in hosting platform
- [ ] User feedback
- [ ] Cost alerts

### **Test Live Site:**
- [ ] All features work
- [ ] Cookie banner appears
- [ ] Legal pages accessible
- [ ] Rate limiting works
- [ ] Mobile responsive

---

## 📧 Legal Compliance Summary

### **What Users See:**
1. ✅ Cookie consent banner on first visit
2. ✅ Privacy Policy link in footer
3. ✅ Terms of Service link in footer
4. ✅ Google attribution on place details
5. ✅ Rate limit counter (X searches remaining)
6. ✅ Clear error messages when limits reached

### **What You're Protected From:**
- ✅ GDPR violations (EU)
- ✅ CCPA violations (California)
- ✅ Google API Terms violations
- ✅ Liability claims (disclaimer)
- ✅ Unexpected costs (rate limiting)

---

## ✅ Final Checklist

Before going live:
- [ ] Updated all email addresses
- [ ] Updated jurisdiction information
- [ ] Tested all features
- [ ] Set up cost alerts
- [ ] Configured environment variables
- [ ] Restricted Google API key
- [ ] Tested on mobile
- [ ] Verified legal pages load
- [ ] Confirmed cookie banner works

---

## 🎉 You're Ready to Deploy!

Your app is now fully compliant and ready for public use. Good luck with your launch! 🚀

**Questions?** Check the files or contact support.

