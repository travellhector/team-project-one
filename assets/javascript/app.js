$(document).ready(function() {
    $("#search-btn").on('click', function(e){
        e.preventDefault();
        $("#search-form").parsley().validate();
        if ($("#search-form").parsley().isValid()){
            search(event);
        }
    });

    $("#search-input").on('keypress', function(e){
        if (event.keyCode === 13) {
            e.preventDefault();
            $("#search-form").parsley().validate();
            if ($("#search-form").parsley().isValid()){
                search(event);
            }
        }
    });
});

// Search Button


//$("#search-btn").on("click", function(event) {
function search(event) {

    // Movie Info Ajax
var movie = $("#search-input").val().trim();

var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=1fc17c4180643016e173ba07928a30f2&query="+encodeURI(movie)+"&page=1";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response);
      var poster = (response.results[0].poster_path);
      
      $("#moviePoster").attr("src", "https://image.tmdb.org/t/p/w300_and_h450_bestv2"+poster);

      $("#synopsis").text(response.results[0].overview);

      $("#movieRelease").text("Release Date: " + response.results[0].release_date);

      var movieID = (response.results[0].id);
      console.log (movieID);

      var creditsURL = "https://api.themoviedb.org/3/movie/"+movieID+"/credits?api_key=1fc17c4180643016e173ba07928a30f2";

        $.ajax({
        url: creditsURL,
        method: "GET"
        }).then(function(response) {
        

        var director = response.crew.find(function(item) {
            return item.job === "Director"
        });

        $("#movieDir").text("Director: " + director.name);

        var screenplay = response.crew.find(function(item) {
            return item.job === "Screenplay"
        });

        $("#movieScreen").text("Screenplay: " + screenplay.name);
        
        });
    });

    console.log(movie);

        //Establing the urls
        var corsProxy = "https://cors-anywhere.herokuapp.com/";
        var apiUrl = "https://www.goodreads.com/book/title.json?&key=htK1rTgrTI2aSg6OHjHKg&title="+movie;
        var xmlURL = "https://www.goodreads.com/book/title.xml?&key=htK1rTgrTI2aSg6OHjHKg&title="+movie;
        var queryURL = corsProxy + apiUrl;
        var bookIDURL = corsProxy+xmlURL;
        // Getting the widget for the reviews 
        // Getting the URL for the link to the goodreads bookpage
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
           console.log(response);
        // console.log(response.reviews_widget);
            $("#book-review").append(response.reviews_widget);
            var bookPage = ($("#gr_header a").attr("href"));
            console.log(bookPage);
            //Parsing the xml to get the book rating, author name and publisher
            $.ajax({
                url: bookIDURL,
                method: 'GET'
                }).done(function(response) {
                //var xmlDoc =$.parseXML(response);
                //console.log(response);
                // console.log(xmlDoc);
                var $xml=$(response);
                var $rating = $xml.find("average_rating");
                var $author = $xml.find("author name");
                var $publisher =$xml.find("publisher");
                console.log($rating.html());
                console.log($publisher.html());
                console.log($author.html());
           
                $("#author").text("Author: "+$author.html());
                $("#publisher").text("Publisher: "+$publisher.html());
                $("#book-rating").text($rating.html());

                }).fail(function(error){
                    console.log("not");
                });
        }).fail(function(error){
            console.log ("NOPE");
        });

        $(document).ajaxError(function(){
            alert("An error occurred!");
        });

//});
    };






// Modal
var modal = document.getElementById('myModal');

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
