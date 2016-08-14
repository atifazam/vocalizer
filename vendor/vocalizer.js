(function() {

	var BASE_URL = 'https://www.nameshouts.com/libs/media/';
	var name = document.getElementsByClassName('vocalizer');
	var names = [];

	for (var i = 0; i < name.length; i++) {
		var data_source = name[i].getAttribute("data-source");
		names[i] = name[i].innerHTML.toLowerCase().replace(/\W/g,'')
		var request = buildRequests(names[i]);
		fetchAudio(data_source, request, i);
	}

	function buildRequests(n) {
		return request = 'https://www.nameshouts.com/api/names/'+n;
	}

	function fetchAudio(sourceType, request, i) {
		if (sourceType == 'auto') {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', request, true);
			xhr.setRequestHeader('NS-API-KEY','SW27BxK23K0RQf7nOB32BxVdmXET98Au');
			xhr.onload = function (e) {
				if (xhr.readyState === 4) {
				    if (xhr.status === 200) {
				      var audioPath = JSON.parse(xhr.responseText).message[names[i]][0]["path"];
				      var audio = new Audio(BASE_URL+audioPath+'.mp3');
				      audio.playbackRate = 0.75;
				      var name = document.getElementsByClassName('vocalizer');
				      name[i].addEventListener('click', function() {
				      	audio.play();
				      }, false);
				    } else {
				      console.error(xhr.statusText);
				    }
				}
			}
			xhr.onerror = function (e) {
			  console.error(xhr.statusText);
			};
			xhr.send(null);
		} else {
			var audioPath = sourceType;
			var audio = new Audio(audioPath, function() {
				'Error!';
			});
			var btn = document.getElementsByClassName('vocalizer');
			btn[i].addEventListener('click', function() {
				audio.play();
			}, false);
		}
	}

})();
