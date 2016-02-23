        var rows,
            headers,
            dataObject = {};
        function parseCSV(table, csvInput) {
            var i,
                csv,
                separator;

            separator = $('#chooseSeparator :selected').text()
            csv = $(csvInput).val();
            csv = csv.replace(/\r\n/g, "\n");
            csv = csv.replace(/\r/g, "\n");
            rows = csv.split("\n");          
            headers = rows.shift();
            headers = headers.split(separator);
            

            for (k = 0; k < rows.length; k++) {
                var r = rows[k]; 
                r = r.split(separator);
                dataObject[k] = {};
                for (i = 0; i < headers.length; i++) {
                    dataObject[k][headers[i]] = r[i];
                }
            }

            renderHeaders(table);
            renderTableData(table)
        }

        function renderHeaders(table) {
            var thead = '', i;
            thead += '<thead><tr>'
            for (i = 0; i < headers.length; i++) {
                thead += '<th><input type="radio" name="map-label" class="map-label" id="' + headers[i] + '">' + headers[i] + '</th>';
            };
            thead += '<th>Hide</th></tr></thead>';
            $(table).append(thead);
        }

        function renderTableData(table) {
            var tbody = '', row, i;
            
            

            tbody = '<tbody>';
            $.each(dataObject, function(key, value){ 
                tbody += renderRow(dataObject[key]);
            })
            tbody += '</tbody>';

            $(table).append(tbody);
            generateMap();
            setLabels();
        }

        var markers = [];
        function generateMap() {
            var mapDiv = document.getElementById('map'),
                map = new google.maps.Map(mapDiv, {
                        zoom: 8
                });

            $.each(dataObject, function(key, value) {

                var myLatlng = new google.maps.LatLng(value['Garage Latitude'],value['Garage Longitude']);
                map.setCenter(myLatlng);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    label: value[$('.active-label').attr('id')]
                });
                markers.push(marker);

            });
            
            setMarkers(markers, map);
            
            $('#map').removeClass('hidden');
        }

        function setMarkers(markers, map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        function removeMarkers() {    
            setMarkers(markers, null);
        }

        function renderRow(row) {
            var i, tr = '';
            
            tr += '<tr>';

            $.each(row, function(key, value) {
                tr += '<td>';
                if (key == 'Photo') {
                    tr += '<div class="image"><img src="' + value + '"></div>';
                } else if (key == 'Home Page') {
                    tr += '<a href="' + value + '">' + value + '</a>';
                } else {
                    tr += value;  
                } 
                tr += '</td>';
                
            });
            tr += '<td><input type="checkbox" id="' + row['Id'] + '" class="hide-garage"></td>';
            tr += '</tr>';
            return tr;
        }

        function setLabels() {
            $('.map-label').on('click', function() {
                $('.map-label:not(:checked)').removeClass('active-label');
                $('.map-label:checked').addClass('active-label')
                removeMarkers();
                generateMap();

            });
        }

        $(document).ready(function() {
                $('.parse-csv').on('click', function() {
                    parseCSV('#table-data', '#csv');
                    $('html, body').animate({
                        scrollTop: $("#table-data").offset().top
                    }, 1000);
                });
                
    });