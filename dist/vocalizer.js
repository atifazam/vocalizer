(function() {

    var config = {
        className: 'vocalizer',
        classNameIO: /vocalizer-(.+)/,
        nameshouts: {
            queryBase: 'https://www.nameshouts.com/api/names/',
            mediaBase: 'https://www.nameshouts.com/libs/media/',
            token: (document.currentScript.getAttribute('api-key') === null) ? "SW27BxK23K0RQf7nOB32BxVdmXET98Au" : document.currentScript.getAttribute('data-api-key'),
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
            var name = el.innerText.toLowerCase();
            name = name.replace(/-/g, '_');
            name = name.replace(/ /g, '_');
            name = name.replace(/\W/g,'');
            name = name.replace(/_/g, '-');

            var dataSource = el.getAttribute("data-source") || 'auto';
            var lang_name = el.getAttribute("data-lang") || 'default';
            var serveFrom;
            if (dataSource === 'auto') {
                var vocIOId = [].slice.call(el.classList).map(extractIOToken).find(function(x) { return x; });
                serveFrom = vocIOId ? ['io', vocIOId] : ['ns', [name, lang_name]];
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
                    console.log(xhr.responseText);
                    cb(null, xhr.responseText);
                } else {
                    cb(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            cb(xhr.statusText);
        };
        xhr.send(null);
    }

    function extractIOToken(className) {
        var data = config.classNameIO.exec(className);
        return data && data[1];
    }

    function fetchNSAudio(name, language, cb) {
        var url = config.nameshouts.queryBase + name;
        getURL(url, {'NS-API-KEY': config.nameshouts.token}, function(err, data) {
            if (err) return cb(err);
            console.log(JSON.parse(data).message);

            language = language.toLowerCase();

            var names = name.split('-');
            var audioPath = []
            for (var i = 0; i < names.length; i++) {
                var languages = JSON.parse(data).message[names[i]].map(function (el) {
                    return el.lang_name.toLowerCase();
                });

                if (languages.includes(language)) {
                    var audioPathRel = JSON.parse(data).message[names[i]][languages.indexOf(language)]["path"];
                }
                else {
                    var audioPathRel = JSON.parse(data).message[names[i]][0]["path"];
                }

                audioPath.push(config.nameshouts.mediaBase + audioPathRel + '.mp3')
            }
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
        var audioList = audioPath.map(function(el) {
            var audio = new Audio(el);
            audio.playbackRate = 0.75;
            return audio;
        });

        el.addEventListener('click', function() {
            playAudioList(audioList)
        }, false);
    }

    function playAudioList(audioList) {
        console.log(audioList);
        audioList[0].play();
        if (audioList.length > 1) {
            audioList[0].addEventListener("ended", function () {
                playAudioList(audioList.slice(1));
            });
        }
    }

    function fetchAudio(serveFrom, el) {
        var type = serveFrom[0];
        var data = serveFrom[1];

        if (type === 'ns') {
            fetchNSAudio(data[0], data[1], function(err, audioPath) {
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
