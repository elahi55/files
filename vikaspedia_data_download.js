function downloadAsMarkdown(ele, filename) {
    const content = ele.textContent;
    const blob = new Blob([content], {
        type: 'text/markdown'
    });
    const anchorElement = document.createElement('a');
    anchorElement.download = filename + '.md';
    anchorElement.href = URL.createObjectURL(blob);
    anchorElement.click();
    URL.revokeObjectURL(anchorElement.href);
}

async function iterateThroughHeadings(contentDiv) {
    debugger;
    var allLinksInContentDiv = contentDiv.querySelectorAll('li');
    for (var i = 0; i < allLinksInContentDiv.length; i++) {
        if (allLinksInContentDiv[i].children[2].className.includes("page_icon")) {
            var linkRef = allLinksInContentDiv[i].children[0].href;
            try {
                const response = await fetch(linkRef);
                const html = await response.text();

                const parser = new DOMParser();
                const dom = parser.parseFromString(html, 'text/html');
                var div = dom.getElementById("texttospeak");
                var fileName = dom.querySelector("link").href.substring('https://vikaspedia.in/'.length);
                fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/\/(.)/g, function(match, p1) {
                    return '/' + p1.toUpperCase();
                }).replace(/\//g, '_').replace(/-/g, ' ');

                downloadAsMarkdown(div, fileName);
            } catch (error) {
                console.error(error);
            }
        } else if (allLinksInContentDiv[i].children[2].className.includes("folder_icon")) {
            var linkRef = allLinksInContentDiv[i].children[0].href;
            try {
                const response = await fetch(linkRef);
                const html = await response.text();

                const parser = new DOMParser();
                const dom = parser.parseFromString(html, 'text/html');
                var div = dom.getElementById("texttospeak");

                await iterateThroughHeadings(div);
            } catch (error) {
                console.error(error);
            }
        }
    }
}




//var folderName = window.location.href.substring('https://vikaspedia.in/'.length)+ "/";
var contentDiv = document.getElementById("texttospeak");
iterateThroughHeadings(contentDiv);
