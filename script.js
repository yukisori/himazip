var archiver = require('archiver');
var fs       = require("fs");
(function() {
  var URL_BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var elDrop = document.getElementById('dropzone');
  var elFiles = document.getElementById('files');
  elDrop.addEventListener('dragover', function(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      showDropping();
  });
  elDrop.addEventListener('dragleave', function(event) {
      hideDropping();
  });
  elDrop.addEventListener('drop', function(event) {
      event.preventDefault();
      hideDropping();
      var files = event.dataTransfer.files;
      showFiles(files);
  });
  function showDropping() {
      elDrop.classList.add('dropover');
  }
  function hideDropping() {
      elDrop.classList.remove('dropover');
  }
  function showFiles(files) {
      elFiles.innerHTML = '';
      for (var i=0, l=files.length; i<l; i++) {
          var file = files[i];
          var elFile = buildElFile(file);
          createZIP(file);
          elFiles.appendChild(elFile);
      }
  }
  function buildElFile(file) {
      var elFile = document.createElement('li');
      var text = file.name + ' (' + file.type + ',' + file.size + 'bytes)';
      elFile.appendChild(document.createTextNode(text));
      if (file.type.indexOf('image/') === 0) {
        var elImage = document.createElement('img');
        elImage.src = URL_BLANK_IMAGE;
        elFile.appendChild(elImage);
        attachImage(file, elImage);
      }
      return elFile;
  }

  function attachImage(file, elImage) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var src = event.target.result;
      elImage.src = src;
      elImage.setAttribute('title', file.name);
    };
    reader.readAsDataURL(file);
  }
  function createZIP(file){
    // zipファイル名作成
    var zip_file_name = file.name + ".zip";
    // zipファイルのストリームを生成して、archiverと紐付ける
    var archive = archiver.create( 'zip', {} );
    var output = fs.createWriteStream( zip_file_name );
    archive.pipe(output);
    archive.glob('**/*', {
       cwd: file.path,
     }, {})
    output.on("close", function(){
        // zipファイルのサイズ
        var archive_size = archive.pointer() + " total bytes";
    });
    archive.on('error', function(err) {
      alert(err);
    });
    // zip圧縮実行
    archive.finalize();
    alert("ZIPファイルを生成しました。\n ダウンロード先："+"~/"+zip_file_name);
  }
})();