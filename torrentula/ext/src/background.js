chrome.contextMenus.create({
  title: "Download with Torrentula",
  contexts: ["link"],
  onclick : function(e) {
    var laserExtensionId = "jmldnoihkphcnfgofbgfhnhinkpnjfco";
    chrome.runtime.sendMessage(laserExtensionId, e.linkUrl,
      function(response) {
        console.log('got response', response);
      });
  }
});
