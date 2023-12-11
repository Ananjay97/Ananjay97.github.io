jQuery(document).ready(function () {
  initClient();
  giftOpen();
  fetchDropdownData();
});

function initClient() {
  gapi.load('client', function () {
    gapi.client.init({
      apiKey: 'AIzaSyC_7gev9jinCu83AaKWBRw7kpz03UILBc0', // Replace with your API key
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
      // API client is initialized, you can now use findPerson function
    });
  });
}

jQuery(window).load(function () {
  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
});

//Gift Open

// Updated giftOpen function
function giftOpen() {
  jQuery("section.gift").on("click", function () {
    if ($("#people").val() === "") {
      $(".dropdown-error").show();
      $(".dropdown-error").fadeOut(2000);
    } else {
      $(".header").hide();
      findPerson();
    }
  });
}

// Find Person
function findPerson() {
  var spreadsheetId = '1xno8nPAa6boLI1dUTc2L8dG-IZugxVoor-OTsFt1FgE';
  var range = 'Sheet1!A:A'; // Assuming names are in column A of Sheet1

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  }).then(function (response) {
    var values = response.result.values;
    if (values && values.length > 0) {
      var randomIndex = Math.floor(Math.random() * values.length);
      var randomName = values[randomIndex][0];
      updateWithPerson(randomName);
    } else {
      console.error('No data found in the spreadsheet');
    }
  }, function (response) {
    console.error('Error fetching data from Google Sheets', response);
  });
}

// Add this function to fetch data for the dropdown
function fetchDropdownData() {
  var spreadsheetId = '1xno8nPAa6boLI1dUTc2L8dG-IZugxVoor-OTsFt1FgE';
  var range = 'Sheet2!A:A'; // Assuming names are in column A of Sheet1

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  }).then(function (response) {
    var values = response.result.values;
    if (values && values.length > 0) {
      // Assuming the dropdown is identified by the ID 'people'
      var dropdown = $("#people");

      // Clear existing options
      dropdown.empty();

      // Add a default option
      dropdown.append('<option value="">Who are you?</option>');

      // Add fetched data to the dropdown
      for (var i = 0; i < values.length; i++) {
        dropdown.append('<option value="' + i + '">' + values[i][0] + '</option>');
      }
    } else {
      console.error('No data found in the spreadsheet for dropdown');
    }
  }, function (response) {
    console.error('Error fetching data for dropdown from Google Sheets', response);
  });
}


function updateWithPerson(name) {
  var message = $("#people option:selected").text() + " , you've got <span class='scramble'>" + name + "</span>";
  $(".person-text").html(message);
  $(".scramble").scramble(5000, 200);
  createSnow();
  setTimeout(function () {
    jQuery(".santa-wrapper").fadeIn(5000);
  }, 500);
  jQuery(".gift-top").removeClass("hovered");
  jQuery(".gift-text").hide();
  jQuery(".gift-final-text").show();
  jQuery("#snow").show();
  jQuery(".gift-bottom").addClass("fadeout");
  jQuery(".gift-top").addClass("fadeout");
}

// Snow Fall
function createSnow() {
  var particles = [];
  var particleSize = 3;
  var maxParticles = 1000;
  var particleOpacity = 0.9;

  // Initialize canvas
  var canvas = document.getElementById("snow");
  var ctx = canvas.getContext("2d");

  // Get window width & height
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  // Apply canvas size based on window width & height.
  // This can be changed to bound within an element instead.
  canvas.width = windowWidth;
  canvas.height = windowHeight;

  // Push particle iteration
  for (var i = 0; i < maxParticles; i++) {
    particles.push({
      x: Math.random() * windowWidth,
      y: Math.random() * windowHeight,
      r: Math.random(Math.min(particleSize)) * particleSize,
      d: Math.random() * maxParticles
    });
  }

  function render() {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.fillStyle = "rgba(255, 255, 255, " + particleOpacity + ")";
    ctx.beginPath();

    for (var i = 0; i < maxParticles; i++) {
      var p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }

    ctx.fill();
    update();
  }

  var angle = 0.005;

  function update() {
    angle += 0.005;

    for (var i = 0; i < maxParticles; i++) {
      var p = particles[i];
      p.y += Math.cos(p.d) + p.r;
      p.x += (Math.sin(angle) * Math.PI) / 10;

      if (p.y > windowHeight) {
        particles[i] = {
          x: Math.random() * windowWidth,
          y: 0,
          r: p.r,
          d: p.d
        };
      }
    }
  }

  (function runtime() {
    requestAnimFrame(runtime);
    render();
  })();
}
