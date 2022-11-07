// Saves options to chrome.storage
function save_options() {
	
  var toggle = document.getElementById('toggle').checked;
  var replacer = document.getElementById('replacer').value;
  
  chrome.storage.sync.set({
    toggle: toggle,
    replacer: replacer
  }, function() {
	  
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
	
  });
}

function restore_options() {
  chrome.storage.sync.get({
    toggle: true,
    replacer: "🤡"
  }, function(items) {
    document.getElementById('toggle').checked = items.toggle;
    document.getElementById('replacer').value = items.replacer;
  });
  
  document.getElementById('reset').addEventListener('click', function(){
	  document.getElementById('toggle').checked = true;
	  document.getElementById('replacer').value = '🤡';
	  save_options();
  });
  document.getElementById('save').addEventListener('click', save_options);
}


document.addEventListener('DOMContentLoaded', restore_options);