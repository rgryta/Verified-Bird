// Replacer text boxes
function show_replacer(el) {
    el.classList.add('enabled');
}

function hide_replacer(el) {
    el.classList.remove('enabled');
}

// Initialize logic for verified users section
function init_v() {
    let dis = document.querySelector('#v-norm');
    let en = document.querySelector('#v-repl');

    let textField = document.querySelector('#v-repl-val');


    dis.addEventListener('change', function() {
        hide_replacer(textField);

		// Logic to check if extension is enabled for verified or non-verified users
        let veri_dis = true;
        let nveri_dis = document.querySelector('#nv-norm').checked;

		
        chrome.storage.sync.set({
            toggle: !(veri_dis && nveri_dis),
            repVer: !veri_dis
        }, null);
    });
    en.addEventListener('change', function() {
        show_replacer(textField);

        chrome.storage.sync.set({
            toggle: true,
            repVer: true
        }, null);
    });
}

// Initialize logic for non-verified users section
function init_nv() {
    let dis = document.querySelectorAll('#nv-norm,#nv-veri');
    let en = document.querySelector('#nv-repl');

    let textField = document.querySelector('#nv-repl-val');

    dis.forEach(function(i) {
        i.addEventListener('change', function() {
            hide_replacer(textField);

			// Logic to check if extension is enabled for verified or non-verified users
            let veri_dis = document.querySelector('#v-norm').checked;
            let nveri_dis = i.id == 'nv-norm';
			
			
            chrome.storage.sync.set({
                toggle: !(veri_dis && nveri_dis),
                repNonver: !nveri_dis,
                nonverCustom: false
            }, null);
        });
    });

    en.addEventListener('change', function() {
        show_replacer(textField);

        chrome.storage.sync.set({
            toggle: true,
            repNonver: true,
            nonverCustom: true
        }, null);
    });
}

// Initialize logic for power button - off and on - plus listener for its calculatable status
function extension_status() {
    let ext_status = document.querySelector('#ext-status');

    chrome.storage.sync.get({
        toggle: true
    }, function(items) {
        if (items.toggle) {
            ext_status.classList.add('ext-enabled');
        } else {
            ext_status.classList.remove('ext-enabled');
        }
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (let [key, {
                oldValue,
                newValue
            }] of Object.entries(changes)) {
            if (key == 'toggle') {
                let ext_status = document.querySelector('#ext-status');
                if (newValue) {
                    ext_status.classList.add('ext-enabled');
                } else {
                    ext_status.classList.remove('ext-enabled');
                }
            }
        }
    });

    ext_status.addEventListener('click', function() {
        let toggle = ext_status.classList.contains('ext-enabled');
        if (toggle) {
            document.querySelector('#v-norm').click();
            document.querySelector('#nv-norm').click();
        } else {
            document.querySelector('#v-repl').click();
            document.querySelector('#nv-veri').click();
        }
    });
}

// Reset replacement strings with default values
function reset_settings() {
    document.querySelector('#ext-reset').addEventListener('click', function() {
        chrome.storage.sync.set({
            verReplacer: '🤡',
            nonverReplacer: '😎'
        }, null);
        document.querySelector('#v-repl-val').value = '🤡';
        document.querySelector('#nv-repl-val').value = '😎';
    });
}

// Set up custom replacement listeners
function replacers() {
    document.querySelector('#v-repl-val').addEventListener('input', function(e) {
        console.log(e.target.value);
        chrome.storage.sync.set({
            verReplacer: e.target.value
        }, null);
    });
    document.querySelector('#nv-repl-val').addEventListener('input', function(e) {
        console.log(e.target.value);
        chrome.storage.sync.set({
            nonverReplacer: e.target.value
        }, null);
    });
}

// Set up extension page content
function init() {
	// Recover settings from sync
    chrome.storage.sync.get({
        repVer: true,
        repNonver: true,
        nonverCustom: false,

        verReplacer: '🤡',
        nonverReplacer: '😎'
    }, function(items) {

        if (items.repVer) {
            document.querySelector('#v-repl').click()
        } else {
            document.querySelector('#v-norm').click()
        }

        if (items.nonverCustom) {
            document.querySelector('#nv-repl').click()
        } else if (items.repNonver) {
            document.querySelector('#nv-veri').click()
        } else {
            document.querySelector('#nv-norm').click()
        }

        document.querySelector('#v-repl-val').value = items.verReplacer;
        document.querySelector('#nv-repl-val').value = items.nonverReplacer;
    });

    init_v();
    init_nv();
    extension_status();
    reset_settings();
    replacers();
}

document.addEventListener('DOMContentLoaded', init);