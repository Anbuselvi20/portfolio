# Anbuselvi A - Backend Developer Portfolio

A responsive, static portfolio site built with HTML5, CSS3 and vanilla JavaScript. No build step or package installation is required.

## Preview locally

The simplest option is to open `index.html` in a browser. To preview through a local HTTP server, open PowerShell in this folder and run:

```powershell
py -m http.server 8000
```

Then visit <http://localhost:8000>. Stop the server with `Ctrl+C`.

The Google Fonts stylesheet is optional; the site uses local fallback fonts if it cannot load.

## Configure personal and project links

Open `script.js` and update `PORTFOLIO_LINKS`:

- `email`: your public contact email address (without `mailto:`).
- `phone`: your public phone number (without `tel:`).
- `linkedin` and `github`: your full profile URLs.
- `resume`: a public resume URL. For a local file, add your PDF to this folder (for example, `resume.pdf`) and set the value to `'resume.pdf'`.
- `hotelProject`, `paymentProject`, and `portalProject`: optional public project URLs. Leave these empty if you cannot share the work.

The email, phone, profile, and resume links are configured. The resume PDF is `Anbuselvi_SpringBoot_Microservices_Resume_pdf.pdf`. Project links are optional. Use public links only; do not add employer source code, credentials, or confidential project details.

## Publish with GitHub Pages

1. Create a GitHub repository for the portfolio and add `index.html`, `style.css`, `script.js`, and `README.md` to its root.
2. Push the files to the repository's default branch.
3. In the repository, open **Settings > Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the default branch and the `/ (root)` folder, then save.
6. Wait for the Pages build to finish. GitHub will show the published URL in the Pages settings.

No deployment or publication has been performed by this project setup.

## Demonstrations

The REST playground returns fixed illustrative sample responses and validates the editable booking JSON in the browser. The Kafka demo animates a sample event across visual processing stages. Neither demo makes network requests or connects to a real service. These are independent demonstrations, separate from the professional employment experience described on the page.
