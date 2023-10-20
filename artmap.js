var map = new maplibregl.Map({
    container: 'map',
    style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json', // 地図のスタイル
    center: [139.63066319939603, 35.90207515216969], // 中心座標
    zoom: 12, // ズームレベル
});

// 現在位置を取得する関数
function moveToCurrentLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLng = position.coords.longitude;
            const userLat = position.coords.latitude;

            // 地図を現在位置に移動
            map.flyTo({ center: [userLng, userLat], zoom: 15 });
        }, (error) => {
            console.error("位置情報の取得に失敗しました。", error);
        });
    } else {
        alert('このブラウザは位置情報の取得に対応していません。');
    }
}

const geojson =
    // マップが読み込み終わったらピンを立てる
    map.on('load', function () {
        // GeolocateControlの設定と追加
        const geolocate = new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: false,  // 追跡モードをオフにする（ユーザーがボタンをクリックするたびに位置情報を更新します）
            showUserLocation: true,    // ユーザーの現在位置を地図上に表示する
        });

        // コントロールを地図に追加
        map.addControl(geolocate);

        // 必要に応じて、初期表示時に現在位置ボタンをクリックさせる（ユーザーの許可が必要）
        geolocate.trigger();
        // 地図がロードされた後に現在位置に移動
        // moveToCurrentLocation();
        // Fetch GeoJSON file
        fetch('mapdata.js')
            .then(response => response.json())
            .then(data => {
                // Loop through each feature in the GeoJSON and create a marker
                data.forEach(feature => {
                    console.log(feature);
                    const lat = feature.lat;
                    const lon = feature.lon;
                    const name = feature["名称"];
                    const ID = feature.ID;

                    // Create popup
                    const popup = new maplibregl.Popup({ offset: 25 })
                        .setText(name);

                    // Create marker
                    // const markerElement = document.createElement('div');
                    // markerElement.className = 'custom-marker';

                    const marker = new maplibregl.Marker({ anchor: 'center' })
                        .setLngLat([lon, lat])
                        .setPopup(popup)
                        .addTo(map);

                    // Create label
                    const label = document.createElement('div');
                    label.className = 'marker-label';
                    label.textContent = ID + " " + name;
                    label.style.transform = 'translate(-50%, -50%)';

                    // Add label to the map
                    new maplibregl.Marker(label)
                        .setLngLat([lon, lat])
                        .setOffset([0, 0])
                        .addTo(map);
                });
            });
    });
// コントロール関係表示
map.addControl(new maplibregl.NavigationControl());


