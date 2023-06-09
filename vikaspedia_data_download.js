function downloadAsMarkdown(ele, filename) {
  // Get the text content of the specified element
  const content = ele.textContent;

  // Create a Blob with the content and set the MIME type to text/markdown
  const blob = new Blob([content], { type: 'text/markdown' });

  // Create a temporary <a> element
  const anchorElement = document.createElement('a');
  
  // Set the download attribute and file name
  anchorElement.download = filename + '.md';

  // Create a URL for the Blob
  anchorElement.href = URL.createObjectURL(blob);

  // Programmatically click the anchor element to trigger the download
  anchorElement.click();

  // Clean up by revoking the object URL
  URL.revokeObjectURL(anchorElement.href);
}



async function iterateThroughHeadings(contentDiv) { debugger;
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
      var linkContent = allLinksInContentDiv[i].children[0].textContent;
      folderName = folderName + linkContent + "/";

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
