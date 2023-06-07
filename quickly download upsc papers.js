var upscSiteLink = "https://www.upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202020";
// window.location.href = upscSiteLink;
var years = prompt("Enter year FROM and TO: ");

years = years.split(" ");
var startYear = parseInt(years[0]);
var endYear = parseInt(years[1]);

for (let y = startYear; y <= endYear; y++) {
    getPdfLink(upscSiteLink.slice(0, -4) + y, y);
}

function downloadPDF(pdfLink, fileName) {
    var link = document.createElement('a');
    link.href = pdfLink;
    link.target = '_blank'; // Open the PDF in a new tab/window
    link.download = fileName; // Set the custom file name for the download

    // Trigger a click event on the anchor element
    link.dispatchEvent(new MouseEvent('click'));
}

function getPdfLink(pageLink, y) {

    fetch(pageLink)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, 'text/html');
            var links = dom.getElementsByTagName('a');
            var matchingLinks = [];

            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var linkText = link.innerText.toLowerCase();

                if ((linkText.indexOf('general') >= 0) && (linkText.indexOf('studies') >= 0)) {

                    var pdfLink = link.href;
                    var fileName = 'UPSC_PRELIMS_' + y;
                    downloadPDF(pdfLink, fileName);
                    break;
                }
            }
        });
}
