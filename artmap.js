var map = new maplibregl.Map({
    container: 'map',
    style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json', // 地図のスタイル
    center: [ 139.63066319939603, 35.90207515216969], // 中心座標
    zoom: 12, // ズームレベル
});

// map.on('load', function () {
//     // サークル設定
//     map.addSource('point_sample', {
//         type: 'geojson',
//         data: './art-resource.geojson'
//     });
//     // スタイル設定
//     map.addLayer({
//         'id': 'point_sample',
//         'type': 'circle',
//         'source': 'point_sample',
//         'layout': {},
//         'paint': {
//             'circle-color': '#FF0000',
//             'circle-radius': 8
//         }
//     });
// });
const geojson = 
        // マップが読み込み終わったらピンを立てる
        map.on('load', function() {
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
                    const marker = new maplibregl.Marker()
                    .setLngLat([lon, lat])
                    .setPopup(popup)
                    .addTo(map);
    
                    // Create label
                    const label = document.createElement('div');
                    label.className = 'marker-label';
                    label.textContent = ID + " " +name;
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


