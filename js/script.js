// Search bar Handler
$(function(){
    var searchField = $('#query');
    var icon = $('#search-btn');

    // Focus Event Handler
    $(searchField).on('focus', function(){
        $(this).animate({
            width:'100%'
        },400);
        $(icon).animate({
            right: '10px'
        }, 400);
    });

    // Blur Event Handler
    $(searchField).on('blur', function(){
        if(searchField.val() == ''){
            $(searchField).animate({
                width:'45%'
            },400, function(){});
            $(icon).animate({
                right:'360px'
            },400, function(){});
        }
    });


    // Stop the form from the submitting.
        $('#search-form').submit(function(e){
        e.preventDefault();
    });
})

// Every time we're preforming a search we want to delete the results from div.
function clearResults(){

    $('#results').html('');
    $('#buttons').html('');

}

// Search for a specified string.
function search(){
    clearResults(); // Clear previous results.

    // Get From Input
    q = $('#query').val();


    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", //URL, Adding the options
        {
            part:'snippet,id',
            q:q,
            type:'video',
            key:'AIzaSyAbjn6HZghsFaQGbmSkx2zAjOBSLZ_51q0'
        }, //  Run a function and getting a data from the request.
            function(data){
                var nextPageToken = data.nextPageToken;
                var prevPageToken = data.prevPageToken;

                // Log Data - NEED TO DELETE
                console.log(data);

                // Loop through the array of item using i.
                $.each(data.items,function(i,item){
                    var output = getOutput(item);  // Building the HTML item here.

                    //Display results by appending to our li.
                    $('#results').append(output);
                });

                var buttons = getButtons(prevPageToken,nextPageToken);

                // Display the buttons
                $('#buttons').append(buttons);
            }


    );
}


// Next Page Function
function nextPage(){
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type:'video',
            key: 'AIzaSyAbjn6HZghsFaQGbmSkx2zAjOBSLZ_51q0'},
        function(data){
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display Buttons
            $('#buttons').append(buttons);
        }
    );
}


// Prev Page Function
function prevPage(){
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type:'video',
            key: 'AIzaSyAbjn6HZghsFaQGbmSkx2zAjOBSLZ_51q0'},
        function(data){
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display Buttons
            $('#buttons').append(buttons);
        }
    );
}


// Build Output method
function getOutput(item){

    // Define variables
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;


    // Build our output String
    // Build Output String
    var output = '<li>' +
        '<div class="list-left">' +
        '<img src="'+thumb+'">' +
        '</div>' +
        '<div class="list-right">' +
        '<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'"> '+ title +'</a></h3>' +
        '<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>' +
        '<p>'+description+'</p>' +
        '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return output;
}

// Build the buttons
function getButtons(prevPageToken, nextPageToken){
    if(!prevPageToken){
        var btnoutput = '<div class="button-container">'+'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
            'onclick="nextPage();">Next Page</button></div>';
    } else {
        var btnoutput = '<div class="button-container">'+
            '<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
            'onclick="prevPage();">Prev Page</button>' +
            '<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
            'onclick="nextPage();">Next Page</button></div>';
    }

    return btnoutput;
}


