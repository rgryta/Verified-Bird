// HTML for verification checkmark
const verifiedHTML = '<div role=\"button\" tabindex=\"0\" class=\"css-18t94o4 css-1dbjc4n r-6koalj r-9cviqr r-1ny4l3l r-o7ynqc r-6416eg\"><svg viewBox=\"0 0 24 24\" role=\"img\" class=\"r-13v1u17 r-4qtqp9 r-yyyyoo r-1xvli5t r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr\"><g><path d=\"M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z\"><\/path><\/g><\/svg><\/div>';


// Generalized selector for icon wrapper - working with different scenarios (embedded tweets, Twitter, profiles etc.)
const clownSelector = '.css-901oao.r-xoduu5.r-18u37iz.r-1q142lx.r-bcqeeo.r-qvutc0';

// Config for MutationObserver
const config = {
    childList: true,
    subtree: true
};


function updateVerification(el) {
    chrome.storage.sync.get({
        repVer: true,
        repNonver: true,
        nonverCustom: false,

        verReplacer: '🤡',
        nonverReplacer: '😎'
    }, function(items) {

		// Logic to calculate whether the profile is already verified or not - also verify if the MutationObserver hasn't already picked up this element
        let isVer = false;
        let updated = false;
        if (el.childElementCount > 0) {
            isVer = true;
            updated = el.childNodes[0].classList.contains('verified-bird');
        }

        if (!updated) {
            let wrapper = document.createElement('div');
            wrapper.classList.add('css-1dbjc4n', 'r-xoduu5', 'verified-bird');
            el.appendChild(wrapper);

            let replacer = document.createElement('div');

            if (items.repVer && isVer) {
                el.childNodes[0].remove();

                replacer.innerHTML = items.verReplacer;
                wrapper.appendChild(replacer);
            }

            if (items.repNonver && !isVer) {
                if (items.nonverCustom) {
                    replacer.innerHTML = items.nonverReplacer;
                    wrapper.appendChild(replacer);
                } else {
                    wrapper.innerHTML = verifiedHTML;
                }
            }
        }
    });
}

function selectClowns(el) {
    let clowns = el.querySelectorAll(clownSelector);
    clowns.forEach(clown => updateVerification(clown));
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        selectClowns(mutation.target);
    })
});

// Only enable the extension when it's switched on
chrome.storage.sync.get({
    toggle: true
}, function(items) {
    if (items.toggle) {
        selectClowns(document.body);
        observer.observe(document.body, config);
    }
});