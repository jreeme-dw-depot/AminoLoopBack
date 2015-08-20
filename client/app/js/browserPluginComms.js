window.addEventListener('message', function(event){
  if(event.data === 'IGNORE-genericMsg'){
    return;
  }
  window.alert(event.origin);
  window.postMessage('IGNORE-genericMsg', event.origin);
});
