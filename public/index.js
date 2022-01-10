document.addEventListener('DOMContentLoaded', function() {
    // Query the elements
    const copyButton = document.getElementById('copyText');
    const codeEle = document.getElementById('sampleText');
    codeEle.innerHTML = window.location.href; 

copyButton.addEventListener('click', function() {
        const selection = window.getSelection();

        // Save the current selection
        const currentRange = selection.rangeCount === 0 ? null : selection.getRangeAt(0);

        // Select the text content of code element
        const range = document.createRange();
        range.selectNodeContents(codeEle);
        selection.removeAllRanges();
        selection.addRange(range);
        // Copy to the clipboard
        try {
            document.execCommand('copy');
        } catch (err) {
            // Unable to copy
            copyButton.innerHTML = 'Copy';
        } finally {
            // Restore the previous selection
            selection.removeAllRanges();
            currentRange && selection.addRange(currentRange);
        }
  copyIcon.classList.remove("fi-xwluxl-copy-wide");
        copyIcon.classList.add("fi-xnsuxl-copy-solid");
    });
});

