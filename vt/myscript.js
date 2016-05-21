/**
 * Created by Jurko on 08/03/14.
 */

// Show guidelines
$("#hide").click(function () {
   $("#testHide").toggle(500);
});

function updateClass(url, id) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        data: {get_param: 'value'},
        success:  function(html) {
            var tick = 0;

            $.each(html, function(index, element) {
                console.log("Made it.");
                $("#"+id).append("<tr "+(tick % 2 == 0 ? ("class=\"even\"") : ("class=\"odd\"")) +"><td>"+"<a href=\""+element.link+'\">' + element.title + '</a></td></tr>');
                tick++;
            })
        }
    })
}
$('#search').keyup(function() {
        var searchField = $('#search').val();
        console.log(searchField);
        var myExp = new RegExp(searchField, "i");
        $.getJSON('pbay.json', function(data) {
            var output = '<table class="pbay">';
            $.each(data, function(key, val) {
                if ((val.title.search(myExp)) != -1 && searchField != "") {
                    output+='<tr>';
                    output+= '<td onclick=clickedOn('+JSON.stringify(val.link)+')>';
                    output += '<h2>' + val.title + '</h2><br>';
                    output+='</td></tr>';


                }
            });
            $('#pbay').html(output);
        });
    }
);

function clickedOn(text) {
    $("#link").val(text);
}




updateClass('movies.json', 'area');


function download() {
    var link = document.getElementById("link").value;
    var email = document.getElementById("email").value;

    // Contains 'http://' and is a Valid link
    if (link.indexOf("thepiratebay") != -1 && link.indexOf("BrRip") != -1) {

        if (link.indexOf("http://") != -1)
            link = "torrents." + link.substring(7);

        // Parsing the link to remove '/torrent/' from the string.
        var parse = link.split("/");
        console.log(parse[0]);
        link = "http://" + parse[0] + "/" + parse[2] + "/" + parse[3] + ".torrent";

        if (email.indexOf("@") != -1) {
            // Sending the message
            var ws = new WebSocket("ws://209.159.150.117:8080/");
            ws.onopen = function() {
                ws.send(link+"//d//"+email);
                $("#sendButton").toggle(50);
                $("#loader").toggle(50);
            };

            ws.onmessage = function(evt) {
                alert(evt.data);
                $("#loader").toggle(50);
                $("#sendButton").toggle(50);
            };

            ws.onclose = function() {

            };

            ws.onerror = function(err) {

            };

        }
    } else {
        alert("Please enter a valid link. Check the guidelines for more info.");
    }
}




