(function() {
  var config = {
    className: 'vocalizer',
    classNameIO: /vocalizer-(.+)/,
    nameshouts: {
      queryBase: 'https://www.nameshouts.com/api/names/',
      mediaBase: 'https://www.nameshouts.com/libs/media/',
      token: 'SW27BxK23K0RQf7nOB32BxVdmXET98Au',
    },
    vocalizerIO: {
      queryBase: 'https://www.vocalizer.io/audio-url/',
    },
  };

  function loadCss() {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];
    var scriptUrl = myScript.src;
    if (scriptUrl) {
      var style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = scriptUrl.replace('.js', '.css');
      document.body.appendChild(style);
    }
  }

  loadCss();

  document.addEventListener('DOMContentLoaded', function() {
    var nameElements = document.getElementsByClassName(config.className);
    [].slice.call(nameElements).forEach(function(el) {
      var name = el.innerText.toLowerCase().replace(/\W/g,'')
      var dataSource = el.getAttribute("data-source") || 'auto';
      var serveFrom;
      if (dataSource === 'auto') {
        var vocIOId = [].slice.call(el.classList).map(extractIOToken).find(function(x) { return x; });
        serveFrom = vocIOId ? ['io', vocIOId] : ['ns', name];
      } else {
        serveFrom = ['url', dataSource];
      }
      fetchAudio(serveFrom, el);
    });
  });

  function getURL(request, headers, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, true);
    Object.keys(headers).forEach(function(header) {
      xhr.setRequestHeader(header, headers[header]);
    });
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            cb(null, xhr.responseText);
          } else {
            cb(xhr.statusText);
          }
      }
    }
    xhr.onerror = function (e) {
      cb(xhr.statusText);
    };
    xhr.send(null);
  }

  function extractIOToken(className) {
    var data = config.classNameIO.exec(className);
    return data && data[1];
  }

  function fetchNSAudio(name, cb) {
    var url = config.nameshouts.queryBase + name;
    getURL(url, {'NS-API-KEY': config.nameshouts.token}, function(err, data) {
      if (err) return cb(err);
      var audioPathRel= JSON.parse(data).message[name][0]["path"];
      var audioPath = config.nameshouts.mediaBase + audioPathRel + '.mp3';
      cb(null, audioPath);
    });
  }

  function fetchIOAudio(id, cb) {
    var url = config.vocalizerIO.queryBase + id;
    getURL(url, {}, function(err, data) {
      if (err) return cb(err);
      cb(null, data);
    });
  }

  function addAudioForName(el, audioPath) {
    var audio = new Audio(audioPath);
    audio.playbackRate = 0.75;
    el.addEventListener('click', function() {
      audio.play();
    }, false);
  }

  function fetchAudio(serveFrom, el) {
    var type = serveFrom[0];
    var data = serveFrom[1];

    if (type === 'ns') {
      fetchNSAudio(data, function(err, audioPath) {
        if (err) {
          console.log(err);
          return;
        }
        addAudioForName(el, audioPath);
      });
    } else if (type === 'io') {
      fetchIOAudio(data, function(err, audioPath) {
        if (err) {
          console.log(err);
          return;
        }
        addAudioForName(el, audioPath);
      });
    } else if (type === 'url') {
      var audioPath = data;
      addAudioForName(el, audioPath);
    }
  }
})();
