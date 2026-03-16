
/**
 * Cheesy Crazy Cafe - Google Sheets powered website API
 * Attach this script to the Google Sheet, then deploy as a Web App.
 * Web App access: Anyone
 * Execute as: Me
 *
 * Supported sheets:
 * 1) Menu
 * 2) Media
 * 3) Settings
 * 4) Testimonials
 * 5) Contact_Submissions (auto-created)
 */

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const menu = readObjects_(ss.getSheetByName('Menu'));
  const media = readObjects_(ss.getSheetByName('Media'));
  const testimonials = readObjects_(ss.getSheetByName('Testimonials'));
  const settingsRows = readObjects_(ss.getSheetByName('Settings'));

  const settings = {};
  settingsRows.forEach(row => {
    if (row.key) settings[row.key] = row.value;
  });

  return ContentService
    .createTextOutput(JSON.stringify({
      settings: settings,
      media: media.filter(r => truthy_(r.is_active)),
      testimonials: testimonials.filter(r => truthy_(r.is_active)),
      menu: menu.filter(r => truthy_(r.is_active)).map(r => ({
        category: r.category,
        name: r.name,
        price: Number(r.price || 0),
        description: r.description || '',
        image_url: r.image_url || '',
        is_active: truthy_(r.is_active),
        is_featured: truthy_(r.is_featured)
      }))
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Contact_Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Contact_Submissions');
    sheet.appendRow(['timestamp', 'name', 'phone', 'email', 'message', 'source']);
  }

  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.message || '',
    data.source || 'Website'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readObjects_(sheet) {
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, idx) => obj[header] = row[idx]);
    return obj;
  }).filter(obj => Object.values(obj).some(v => String(v).trim() !== ''));
}

function truthy_(value) {
  const str = String(value).toLowerCase().trim();
  return !(str === '' || str === 'false' || str === '0' || str === 'no' || str === 'inactive');
}
