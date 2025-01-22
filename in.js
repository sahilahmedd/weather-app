const linkInput = document.getElementById('link');
const privateLinkInput = document.getElementById('privateLink');
const responseInput = document.getElementById('response');
const loaderArea = document.getElementById('loader-area');
const resultElement = document.getElementById('result');

// hide loader on page load(to enable remove autofocus and show loader on page load)
// window.addEventListener('load', function () {
//     if (loaderArea) {
//         loaderArea.style.display = 'none';
//     }
// });

//paste handler
document.getElementById('pasteButton').addEventListener('click', async () => {
    let textArea = linkInput || privateLinkInput;
    try {
        textArea.value = await navigator.clipboard.readText();
        if (textArea.id === 'privateLink') {
            setTimeout(getUrl, 200);
        }
    } catch (err) {
        console.error('Error accessing clipboard:', err);
    }
});

// scroll to result items(ads,with autofocus)
// if (resultElement) {
//     setTimeout(function () {
//         document.getElementById('tab-1').scrollIntoView({behavior: "smooth"});
//     }, 1000);
// }

//error modal handler
let errorModal = document.getElementById('errorModal');
if (errorModal !== null) {
    new bootstrap.Modal(errorModal).show();
}

//submit form
function analyze() {
    // const closeCaptchaModal = document.getElementById('closeCaptchaModal');
    // if (closeCaptchaModal) {
    //     closeCaptchaModal.click();
    // }

    let downloadForm = document.getElementById('downloadForm');
    if (downloadForm.checkValidity()) {
        loaderArea.style.display = 'flex';
        if (resultElement) {
            resultElement.style.display = 'none';
        }
        downloadForm.submit();
    } else {
        downloadForm.reportValidity();
    }
}

//check captcha
function checkCaptcha(event) {
    event.preventDefault();
    analyze();

    // let link = $('#link').val();
    // let referer = $('#referer').val();
    // if (link.includes("instagram.com/stories/") || referer.includes("insta-stories-download")) {
    //     let captchaModal = new bootstrap.Modal(document.getElementById('captchaModal'))
    //     captchaModal.show()
    // } else {
    // analyze();
    // }
}

//get url for private
function getUrl() {
    let privateLink = privateLinkInput.value;
    let referer = document.getElementById('referer').value;
    let locale = document.getElementById('locale').value;
    if (privateLink.trim() === "") {
        return false;
    }

    loaderArea.style.display = 'flex';
    if (resultElement) {
        resultElement.innerHTML = '';
    }
    const alertArea = document.getElementById('alertArea')
    alertArea.innerHTML = '';
    responseInput.value = '';

    fetch(`/get-url?privateLink=${encodeURIComponent(privateLink)}&referer=${referer}&locale=${locale}`)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        }).then(response => {
        loaderArea.style.display = 'none';
        if (response.url) {
            const newTab = window.open(response.url);
            if (!newTab) {
                alert("It looks like your browser blocked the popup. Please enable popups for this site to continue.");
            }
        } else {
            privateLinkInput.value = '';
            alertArea.innerHTML = response;
            let myModal = new bootstrap.Modal(document.getElementById('errorModal'));
            myModal.show();
        }
    });
}

//keys listener
if (linkInput) {
    linkInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            linkInput.blur();
            checkCaptcha(event);
        }
    });
}
if (privateLinkInput) {
    privateLinkInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            privateLinkInput.blur();
            getUrl();
        }
    });
    privateLinkInput.addEventListener("paste", function () {
        setTimeout(function () {
            privateLinkInput.blur();
            getUrl();
        }, 0);
    });
}
if (responseInput) {
    responseInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            responseInput.blur();
            analyze();
        }
    });
}

//service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js', {
        scope: '.'
    }).then(function () {
        console.log('ServiceWorker registration successful');
    }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}



