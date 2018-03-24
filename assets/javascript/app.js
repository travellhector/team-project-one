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


      var poster = (response.results[0].poster_path);
      
      $("#moviePoster").attr("src", "https://image.tmdb.org/t/p/w300_and_h450_bestv2"+poster);

      $("#synopsis").text(response.results[0].overview);

      $("#movieRelease").text("Release Date: " + response.results[0].release_date);

      var movieID = (response.results[0].id);
      console.log (movieID);

      console.log(movie);

      //Getting the streaming site 

      var movieStream = "https://www.fan.tv/movies/"+movieID;
      console.log(movieStream);
      $('#fanTV').parent().attr("href",movieStream).attr("target","_blank")

      var creditsURL = "https://api.themoviedb.org/3/movie/"+movieID+"/credits?api_key=1fc17c4180643016e173ba07928a30f2";

        $.ajax({
        url: creditsURL,
        method: "GET"
        }).then(function(response) {
        console.log(response);

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

    

    //Getting the movie rating 

    var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    $.ajax({
        url: omdbURL,
        method: "GET"
      }).then(function(response) {
        //console.log(response);
         $("#movie-rating").text(response.imdbRating);

    });

        //Establing the book urls
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
        }).then(function(response) {
           // console.log(response);
        // console.log(response.reviews_widget);
            $("#book-review").append(response.reviews_widget);
            var bookPage = ($("#gr_header a").attr("href"));
            //console.log(bookPage);
            //Parsing the xml to get the book rating, author name and publisher
            $.ajax({
                url: bookIDURL,
                method: 'GET'
                }).then(function(response) {
               // console.log(response);
                var $xml=$(response);
                var $rating = $xml.find("average_rating");
                var $author = $xml.find("author name");
                var $publisher =$xml.find("publisher");
                var $bookPoster = $xml.find("image_url");
                var $bookPosterLink = $bookPoster.html();
                var $publication_year = $xml.find("publication_year");
                var $publication_month =$xml.find("publication_month");
                var $publication_day =$xml.find("publication_day");
                var publication_date =$publication_month.html()+"-"+$publication_day.html()+"-"+$publication_year.html();
                //var $isbn = $xml.find("isbn");
                //console.log($rating.html());
                //console.log($publisher.html());
                //console.log($author.html());
                //console.log($bookPosterLink);
                //console.log(publication_date);
                //var isbn = ($isbn.html());
               // console.log(isbn);
                //var num =isbn.slice(9,19)
                //console.log(num);
              //console.log("http://covers.openlibrary.org/b/isbn/"+num+"-L.jpg")
              var amazon= "https://www.amazon.com/s/ref=nb_sb_ss_c_1_5?url=search-alias%3Dstripbooks&field-keywords="+movie;
   
              //console.log(amazon);
           
                $("#author").text("Author: "+$author.html());
                $("#publisher").text("Publisher: "+$publisher.html());
                $("#book-rating").text($rating.html());
                $("#bookPoster").attr("src", $bookPosterLink);
                $('#publish_date').text("Publication Date :"+publication_date);
               $('#amazon').parent().attr("href",amazon).attr("target","_blank")
               $('#goodreads').parent().attr("href",bookPage).attr("target","_blank")
               

                });
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

// functon for th buttons to move between the to sections with 750px -540px
var app = {
    showingBook: true,
    showingMovie: false
};

function showMovie() {
    app.showingMovie = true;
    app.showingBook = false;
    $("#movie").show();
    $("#book").hide();
}

function showBook() {
    app.showingMovie = false;
    app.showingBook = true;
    $("#movie").hide();
    $("#book").show();
}

function onButtonClick() {
    if(app.showingBook) { showMovie(); }
    else { showBook(); }
}

$(".toggleDisplay").on("click", onButtonClick);

