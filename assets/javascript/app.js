$("#bookcontent").hide();
$("#moviecontent").hide();
$("#sorrybook").hide();
$("#sorrymovie").hide();
$("#searching").hide();

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

// Search Function
function search(event) {
    $("#landing").hide();

    var found;

    // TMDB API
    var movie = $("#search-input").val().trim();
    var movieQueryURL = "https://api.themoviedb.org/3/search/movie?api_key=1fc17c4180643016e173ba07928a30f2&query="+encodeURI(movie)+"&page=1";
    
    // Make ajax request on movie API first
    $.ajax({
      url: movieQueryURL,
      method: "GET"
    }).done(function(response) {
        $("#sorrymovie").hide();
        $("#sorrybook").hide();
        $("#bookcontent").hide();
        $("#searching").show();
        console.log(response);

        // If no movie results are found, change html to show "movie not found". Proceed to standalone book search.
        if (response.results.length === 0) {
            found = false;
            $("#moviecontent").hide();
            $("#sorrymovie").show();
            bookSearch();
        }
        // If movie results are found, change html to display movie results
        else {
            found = true;
            $("#moviecontent").show();
            var poster = (response.results[0].poster_path);
            var movieID = (response.results[0].id);
            // Url for credits search
            var creditsURL = "https://api.themoviedb.org/3/movie/"+movieID+"/credits?api_key=1fc17c4180643016e173ba07928a30f2";
            // Url for streaming site
            var movieStream = "https://www.fan.tv/movies/"+movieID;
            $("#moviePoster").attr("src", "https://image.tmdb.org/t/p/w300_and_h450_bestv2"+poster);
            $("#synopsis").text(response.results[0].overview);
            $("#movieRelease").text("Release Date: " + response.results[0].release_date);
            $('#fanTV').parent().attr("href",movieStream).attr("target","_blank");
            // AJAX request for movie credits
            $.ajax({
            url: creditsURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
                var director = response.crew.find(function(item) {
                    return item.job === "Director"
                });
                var screenplay = response.crew.filter(function(item) {
                    return item.job === "Screenplay"
                });
                var writer = response.crew.filter(function(item) {
                    return item.job === "Writer"
                });
                var novel = response.crew.find(function(item) {
                    return item.job === "Novel"
                });
                var author = response.crew.find(function(item) {
                    return item.job === "Author"
                });

                var book = response.crew.find(function(item) {
                    return item.job === "Book"
                });

                var story = response.crew.find(function(item) {
                    return item.job === "Original Story"
                });

                var theater = response.crew.find(function(item) {
                    return item.job === "Theatre Play"
                });

                $("#movieDir").text("Director: " + director.name);
                
                // Repeating element 
                var writers = [];
                if (screenplay === undefined) {
                    for (var i = 0; i < writer.length; i++) {
                        writers.push(writer[i].name);
                    }
                }
                else {
                    for (var i = 0; i < screenplay.length; i++) {
                        writers.push(screenplay[i].name);
                    }
                }
                var sw = writers.join(', ');
                $("#movieScreen").text("Screenplay: " + sw);
                // If movie is not based on a book, show "book not found"
                if (novel === undefined && author === undefined && book === undefined && story == undefined && theater === undefined) {
                    $("#bookcontent").hide();
                    $("#searching").hide();
                    $("#sorrybook").show();
                }
                // If movie is based on a book, proceed to book search.
                else {
                    bookSearch();
                }
            });
        }
    }).fail (function (error) {
        $("#moviecontent").hide();
        $("#sorrymovie").show();
    });

    //Movie Rating from OMDB
    var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    $.ajax({
        url: omdbURL,
        method: "GET"
        }).then(function(response) {
        //console.log(response);
         $("#movie-rating").text(response.imdbRating);
    });

    //Goodreads API URLs
    var corsProxy = "https://cors-anywhere.herokuapp.com/";
    var apiUrl = "https://www.goodreads.com/book/title.json?&key=htK1rTgrTI2aSg6OHjHKg&title="+movie;
    var xmlURL = "https://www.goodreads.com/book/title.xml?&key=htK1rTgrTI2aSg6OHjHKg&title="+movie;
    var bookQueryURL = corsProxy + apiUrl;
    var bookIDURL = corsProxy+xmlURL;
    
    function bookSearch() {
        $.ajax({
            url: bookQueryURL,
            method: 'GET'
        }).done(function(response) {
            console.log(response);
            $('#bookreviews').empty();
            $('#bookreviews').append(response.reviews_widget);
            var bookPage = ($("#gr_header a").attr("href"));
            console.log(bookPage);

            //Parsing the xml to get the book rating, author name and publisher
            $.ajax({
                url: bookIDURL,
                method: 'GET'
                }).then(function(response) {
                    console.log(response);
                    var $xml=$(response);
                    var $rating = $xml.find("average_rating");
                    var $author = $xml.find("author name");
                    var $publisher =$xml.find("publisher");
                    var $bookPoster = $xml.find("image_url");
                    var $bookPosterLink = $bookPoster.html();
                    var $publication_year = $xml.find("publication_year");
                    var $publication_month =$xml.find("publication_month");
                    var $publication_day =$xml.find("publication_day");
                    var publication_date =$publication_year.html()+"-"+$publication_month.html()+"-"+$publication_day.html();
                    var amazon= "https://www.amazon.com/s/ref=nb_sb_ss_c_1_5?url=search-alias%3Dstripbooks&field-keywords="+movie;
                    var bookSynopsis_data = $xml.find("description");
                    var bookSynopsis_cut = bookSynopsis_data.html();
                    var bookSynopis = bookSynopsis_cut.slice(8);
            
                    $("#author").text("Author: "+$author.html());
                    $("#publisher").text("Publisher: "+$publisher.html());
                    $("#book-rating").text($rating.html());
                    $("#bookPoster").attr("src", $bookPosterLink);
                    $('#publish_date').text("Publication Date: "+publication_date);
                    $('#amazon').parent().attr("href",amazon).attr("target","_blank");
                    $('#goodreads').empty();
                    $('#goodreads').parent().attr("href",bookPage).attr("target","_blank");
                    $("#searching").hide();
                    $("#bookcontent").show();
                    
                    if (found === false) {
                        $("#synopsis").text(bookSynopis);
                    }

                })
        }).fail(function(error){
            $("#bookcontent").hide();
            $("#searching").hide();
            $("#sorrybook").show();
        });
    }
};

// Synopsis Modal
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

// Book Reviews Modal
var bookReviewsModal = document.getElementById('modal-book-review');
var BRbtn = document.getElementById("myBRBtn");
var BRspan = document.getElementsByClassName("BRclose")[0];
BRbtn.onclick = function() {
    bookReviewsModal.style.display = "block";
}
BRspan.onclick = function() {
    bookReviewsModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == bookReviewsModal) {
        bookReviewsModal.style.display = "none";
    }
}

//Play Trailer Modal 
var playTrailerModal = document.getElementById('myTrailerModal');
var Trailerbtn = document.getElementById("myTrailerBtn");
var Trailerspan = document.getElementsByClassName("trailer-close")[0];
    Trailerbtn.onclick = function() {
    playTrailerModal.style.display = "block";
}
Trailerspan.onclick = function() {
    playTrailerModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == playTrailerModal) {
        playTrailerModal.style.display = "none";
    }
}

// Toggle Between Movie and Book Sections at 750px -540px
var app = {
    showingBook: true,
    showingMovie: false
};
function showMovie() {
    // app.showingMovie = true;
    // app.showingBook = false;
    $("#movie").css("display", "block");
    $("#book").css("display", "none");
}
function showBook() {
    // app.showingMovie = false;
    // app.showingBook = true;
    $("#movie").css("display", "none");
    $("#book").css("display", "block");
}
function onButtonClick() {
    // if(app.showingBook) { showMovie(); }
    // else { showBook(); }
    if ($("#book").css("display") === "block") {
        showMovie();
    }else {
        showBook();
    }
}
setInterval(function(){
    if(jQuery(window).width()>=751){
        $("#book").css("display", "block");
        $("#movie").css("display", "block");
    }
}, 500)
$(".toggleDisplay").on("click", onButtonClick);


//Youtube Trailer
function keyWordsearch(){
    gapi.client.setApiKey('AIzaSyBirSWhi-hjDSVb-EC06suntg6gZzGch3Q');
    gapi.client.load('youtube', 'v3', function() {
    
      var userMovie = $('#search-input').val() + " trailer";
  
      data = jQuery.parseJSON(`{ "data": [
        {
          "name": "${userMovie}"
        }
      ]}`);
  
      for (var i = 0; i < data.data.length; i++) {
        makeRequest(data.data[i].name);
      }  
  
    });
}
  
function makeRequest(q) {
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet', 
      maxResults: 1
    });
    request.execute(function(response)  {
    
        $('#myTrailerModal').empty()                                       
      var srchItems = response.result.items;
      for (var i = 0; i < srchItems.length; i++) {
  
        var videoID = srchItems[i].id.videoId;
        $('#myTrailerModal').append('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoID + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
      }  
    })  
}
  
$("#myTrailerBtn").on('click', function(event) {
      event.preventDefault()
      keyWordsearch();
      console.log ("clicked")
})