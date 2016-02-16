        $(document).ready(function() {
                var garageList = [],
                    locations = [];
                // The event listener for the file upload
                document.getElementById('txtFileUpload').addEventListener('change', upload, false);

                // Method that checks that the browser supports the HTML5 File API
                function browserSupportFileUpload() {
                    var isCompatible = false;
                    if (window.File && window.FileReader && window.FileList && window.Blob) {
                    isCompatible = true;
                    }
                    return isCompatible;
                }

                function parseCSV() {
                    var csv,
                        rows,
                        headers;
                    csv = $('#csv').val();
                    csv = csv.replace(/\r\n/g, "\n");
                    csv = csv.replace(/\r/g, "\n");
                    rows = csv.split("\n");          
                    headers = rows.shift();
                }
                // Method that reads and processes the selected file
                function upload(evt) {
                if (!browserSupportFileUpload()) {
                    alert('The File APIs are not fully supported in this browser!');
                    } else {
                        var data = new Array();
                        var file = evt.target.files[0];
                        var reader = new FileReader();
                        reader.readAsText(file);
                        reader.onload = function(event) {
                            var csvData = event.target.result,
                            arrayList = csvData.split('\n'),
                            keysList = arrayList.shift(),
                            keysList = keysList.split(','); 

                            // create array of objects
                            for (var k = 0; k < arrayList.length; k++) {
                                var rowData = arrayList[k].split(',');
                                var Garage = new Object();
                                for ( var i = 0 ; i < keysList.length; i++) { 
                                    Garage[keysList[i]] = rowData[i];
                                    
                                }
                                var coordinates = [parseFloat(Garage['Garage Latitude']), parseFloat(Garage['Garage Longitude'])];
                                locations[k] = coordinates;
                                garageList.push(Garage);
                            }
                
                            dataToHtml(keysList, garageList);
                            var mapDiv = document.getElementById('map'),
                                map = new google.maps.Map(mapDiv, {
                                            center: {
                                                        lat: locations[0][0], 
                                                        lng: locations[0][1]
                                                    },
                                            zoom: 8
                                });
                            for(var i = 0; i < locations.length; i++) {

                                debugger
                                var myLatlng = new google.maps.LatLng(locations[i][0],locations[i][1]);
                                var marker = new google.maps.Marker({
                                    position: myLatlng,
                                    title:"Hello World!"
                                });
                                marker.setMap(map);
                            }
                    };
                    
                    $('html, body').animate({
                        scrollTop: $("#table-data").offset().top
                    }, 1000);

                            // console.log(arrayList); 
                }
                reader.onerror = function() {   
                    alert('Unable to read ' + file.fileName);
                };
            }

            function headersToHtml(tableHeaders) {
                var htmlString = '<thead><tr>';
                for(var i = 0; i < tableHeaders.length; i++) {
                    htmlString += '<th>' + tableHeaders[i] + '</th>';
                }
                htmlString += '</tr></thead>';
                $('.table').append(htmlString);
            }

            function dataToHtml(tableHeaders, tableData){
                headersToHtml(tableHeaders);
                var htmlString = '<tbody>';
                for (var i = 0; i < tableData.length; i++) {
                    htmlString += '<tr>';
                    for (var k = 0; k < tableHeaders.length; k++) {
                        htmlString += '<td thdata="' + tableHeaders[k] + '">';
                        if (tableHeaders[k] == 'Photo') {
                            htmlString += '<img src="' +    tableData[i][tableHeaders[k]] + '" class="image"></td>';
                        } else if (tableHeaders[k] == 'Home Page') {
                            
                            htmlString += '<a href="' + tableData[i][tableHeaders[k]] + '">' + tableData[i][tableHeaders[k]] + '</a></td>';
                        } else {
                            htmlString += tableData[i][tableHeaders[k]] + '</td>';
                        } 

                    }
                    htmlString += '</tr>';
                }

                htmlString += '</tbody>';
                $('.table').append(htmlString);
                $('#table-data').tablesorter();
            }

    });