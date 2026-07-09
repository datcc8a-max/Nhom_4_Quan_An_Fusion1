// Bridge for global auth functions referenced by inline HTML handlers
// These will be defined by app.js, so we just ensure they're exposed globally

(function(){
  // After app.js loads, these should be available
  const exposeGlobalAuthFunctions = () => {
    // doLogin, doRegister, doLogout, openLoginModal, finishLogin are defined in app.js
    // just ensure they're globally accessible
    if(typeof doLogin !== 'undefined') window.doLogin = doLogin;
    if(typeof doRegister !== 'undefined') window.doRegister = doRegister;
    if(typeof doLogout !== 'undefined') window.doLogout = doLogout;
    if(typeof openLoginModal !== 'undefined') window.openLoginModal = openLoginModal;
    if(typeof finishLogin !== 'undefined') window.finishLogin = finishLogin;
  };
  
  // Try to expose immediately and again after a delay
  setTimeout(exposeGlobalAuthFunctions, 100);
})();
