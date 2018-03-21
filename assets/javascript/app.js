// Search Button
$("#search-btn").on("click", function(event) {
    event.preventDefault();

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
    });

});






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