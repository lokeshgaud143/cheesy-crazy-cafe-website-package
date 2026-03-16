CHEESY CRAZY CAFE - WEBSITE PACKAGE

FILES INCLUDED
- index.html, about.html, menu.html, gallery.html, reviews.html, contact.html
- assets/css/style.css
- assets/js/config.js
- assets/js/app.js
- assets/js/pages.js
- assets/data/local-data.json
- apps-script/Code.gs

WHAT THIS PACKAGE DOES
1. Premium animated multi-page website
2. WhatsApp ordering for every menu item
3. Contact form page
4. Menu can be updated from Google Sheet
5. Google Maps reviews/photos can be loaded automatically with a Maps API key
6. Same dark premium theme across all pages

HOW TO EDIT MENU WITHOUT TOUCHING CODE
OPTION A - BEST METHOD (Google Apps Script)
1. Open the provided Excel workbook in Google Sheets
2. Open Extensions > Apps Script
3. Paste Code.gs from the apps-script folder
4. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
5. Copy the Web App URL
6. Open assets/js/config.js
7. Paste the Web App URL into:
   sheetApiUrl: "YOUR_WEB_APP_URL"

After that, the client only edits the Google Sheet.
The website will auto-read:
- Menu
- Media
- Settings
- Testimonials

OPTION B - SIMPLE METHOD (Menu only via published CSV)
1. Upload workbook to Google Sheets
2. Publish the Menu sheet as CSV
3. Paste the CSV URL into assets/js/config.js under menuCsvUrl

GOOGLE REVIEWS + GOOGLE PHOTOS SETUP
1. Create a Google Maps JavaScript API key
2. Enable Places API / Maps JavaScript API
3. Restrict the key to your domain
4. Open assets/js/config.js
5. Add your API key to googleMapsApiKey

The site will then try to find:
Cheesy Crazy Cafe, 112/SP-4, Kumbha Marg, Pratap Nagar, Jaipur, Rajasthan 302033

It will load:
- live Google reviews
- live Google rating
- live Google place photos (for gallery fallback)

CONTACT FORM
- If sheetApiUrl is used and Code.gs is deployed, the contact form can also post submissions to the Contact_Submissions sheet.
- Or set contactFormEndpoint in config.js to Formspree / any form backend.

WHATSAPP
- Change whatsappNumber in assets/js/config.js if needed

IMPORTANT
- Replace placeholder email if needed
- Replace or improve image links in the Media sheet for final delivery
- If Google review sync is not configured, the reviews page shows a setup-ready message and curated testimonial fallback
