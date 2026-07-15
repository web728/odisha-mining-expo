

const SITE_URL = "https://odishaminingexpo.com/";
const LOGO_URL = "https://odishaminingexpo.com/img/5th-Odisha-Logo_White.png";
const INK = "#141517";
const GOLD = "#c9a24b";
const GOLD_DEEP = "#a9832f";

export function buildAdminEmailHtml({ badge, rows, submittedAt }) {

    const rowsHtml = rows
        .filter(function (r) { return r && r.value !== undefined && r.value !== null && r.value !== ""; })
        .map(function (r, i) {
            const bg = i % 2 === 0 ? "#ffffff" : "#faf8f3";
            return `
            <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #eee;background:${bg};font:600 13px/1.4 Arial,Helvetica,sans-serif;color:${INK};width:170px;vertical-align:top;white-space:nowrap;">
                    ${r.label}
                </td>
                <td style="padding:14px 20px;border-bottom:1px solid #eee;background:${bg};font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#333333;vertical-align:top;">
                    ${String(r.value).replace(/\n/g, "<br>")}
                </td>
            </tr>`;
        })
        .join("");

    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f0ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0ef;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e7e5df;">

<!-- Header -->
<tr>
<td style="background:${INK};padding:36px 30px 28px;text-align:center;">
<img src="${LOGO_URL}" alt="Odisha Mining & Infrastructure International Expo" width="220" style="display:block;margin:0 auto 14px;max-width:220px;height:auto;">
<div style="font:700 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1.5px;color:${GOLD};text-transform:uppercase;">
5th Odisha Mining &amp; Infrastructure International Expo
</div>
<div style="font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#c9c9c9;margin-top:4px;">
07&ndash;10 January 2027 &middot; Baramunda Exhibition Ground, Bhubaneswar
</div>
</td>
</tr>

<!-- Badge -->
<tr>
<td style="padding:26px 30px 6px;text-align:center;">
<span style="display:inline-block;background:${GOLD};color:${INK};font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.5px;text-transform:uppercase;padding:9px 18px;border-radius:30px;">
${badge}
</span>
</td>
</tr>

<!-- Intro -->
<tr>
<td style="padding:16px 30px 8px;text-align:center;">
<p style="margin:0;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:#555;">
A new submission has come in on <a href="${SITE_URL}" style="color:${GOLD_DEEP};text-decoration:none;font-weight:600;">odishaminingexpo.com</a>. Details below.
</p>
</td>
</tr>

<!-- Details table -->
<tr>
<td style="padding:18px 20px 6px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:6px;overflow:hidden;">
${rowsHtml}
</table>
</td>
</tr>

<!-- Submitted at -->
<tr>
<td style="padding:18px 30px 30px;text-align:center;">
<p style="margin:0;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#999;">
Submitted on ${submittedAt}
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:${INK};padding:24px 30px;text-align:center;">
<a href="${SITE_URL}" style="font:700 13px/1 Arial,Helvetica,sans-serif;color:${GOLD};text-decoration:none;">odishaminingexpo.com</a>
<p style="margin:10px 0 0;font:400 11px/1.6 Arial,Helvetica,sans-serif;color:#9a9a9a;">
This is an automated notification from the Odisha Mining &amp; Infrastructure International Expo website.
</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}