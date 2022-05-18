const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
let raw;
let requestOptions;
let aID = 7932986;
let createURL;

function sendRequest() {
    let value = document.getElementById("request-query").value
    if(value !== '') {
        raw = JSON.stringify({
            "query": value,
            "pageview_id": "c37b6ea9b3550136",
            "aid": aID,
            "language": "pt-br",
            "size": 1
        });

        requestOptions = {
            method: 'POST',
            body: raw,
            redirect: 'follow'
        };
        fetch("https://accommodations.booking.com/autocomplete.json", requestOptions)
            .then(response => response.json())
            .then(result => {
                createElement(result);
            })
            .catch(error => console.log(error));
    }else {
        let div = document.querySelector(".request-result-container");
        div.innerHTML = `<p>Não foram encontrados resultados para a busca</p>`;
    }
}

function createElement(data) {
    console.log('Data: ', data);
    data.results.map(e => {

        let img;
        let correctImage;
        if (e.photo_uri != null) {
            img = 'https://t-cf.bstatic.com' + e.photo_uri
            correctImage = img.replace("square60", "max1024x768")
                .replace("square100", "max1024x768")
                .replace("-60", "")
                .replace("-100", "");
        } else {
            correctImage = 'https://t-cf.bstatic.com/static/img/plane.jpg';
        }

        createURL = "https://www.booking.com/searchresults.pt-br.html?aid=" + aID + "&dest_id=" + e.dest_id + "&dest_type=" + e.dest_type;


        let div = document.querySelector(".request-result-container");
        div.innerHTML = `
            <div class="col-sm-3">
                <h2>${e.label1}</span></h2>            
                <a href="${correctImage}" target="_blank"><img src="${correctImage}" alt="location-image"/></a>
            </div>
            <div class="col-sm-4" style="text-align: left">
                <h2>Informações do local</h2>
                <p>ID do destino: ${e.dest_id}</p>
                <p>CC1: ${e.cc1}</p>
                <p>Tipo do destino: ${e.dest_type}</p> 
                <p>Região: ${e.label2}</p>     
                <p>Latitude: ${e.latitude}</p>     
                <p>Longitude: ${e.longitude}</p>     
                <p>nr_homes: ${e.nr_homes}</p>     
                <p>nr_hotels: ${e.nr_hotels}</p>     
                <p>nr_hotels_25: ${e.nr_hotels_25}</p>     
                <button id="generateLink-btn" onclick="generatedURL(createURL)" class="btn btn-outline-light">Generate URL</button>
                <div id="url-link-container"></div>
            </div>
            <div class="col-sm-5">
                <h2>Mapa da região</h2>
                <iframe width="500" height="300" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD56HHdWgjjtS7oXzSrkRPt7owFN5X-WmU&q=${e.label1}"></iframe>
            </div>
        `;
    });
}

function generatedURL(url) {
    let getTag = document.querySelector("#url-link-container");
    document.querySelector("#generateLink-btn").style.display = 'none';
    getTag.innerHTML = `
        <a href="${url}" id="url-link" target="_blank"><button class="btn btn-outline-light">Open Link</button></a>
        <button class="btn btn-outline-light" onclick="copyUrlText()">Copy Link</button>
        <p id="url-display">${url}</p>
        <p id="url-msg-cliped" class="alert alert-success" role="alert" style="display: none; margin-top: 10px; color: darkgreen !important;">A URL foi copiada para a área de transferencia!</p>
        <input type="text" value="${url}" id="url-text" style="display: none"/>
    `;
}

function  copyUrlText() {
    let copyText = document.querySelector('#url-text');
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    document.querySelector('#url-display').style.display = 'none';
    document.querySelector('#url-msg-cliped').style.display = 'block';
}



