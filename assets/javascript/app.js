var config = {
  apiKey: "AIzaSyBpj78TUXM4dHQ60BxLpeB8VHcTsdwNQRc",
  authDomain: "project-1-c63b2.firebaseapp.com",
  databaseURL: "https://project-1-c63b2.firebaseio.com",
  projectId: "project-1-c63b2",
  storageBucket: "project-1-c63b2.appspot.com",
  messagingSenderId: "9690953747"
};

firebase.initializeApp(config);

var trainData = firebase.database();

// 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)
// 3. Button for adding trains
$("#add-train-btn").on("click", function() {

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {

    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  trainData.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  // Determine when the next train arrives.
  return false;
});

// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

      console.log(childSnapshot.val());

      // Store everything into a variable.
      var tName = childSnapshot.val().name;
      var tDestination = childSnapshot.val().destination;
      var tFrequency = childSnapshot.val().frequency;
      var tFirstTrain = childSnapshot.val().firstTrain;

      var timeArr = tFirstTrain.split(":");
      var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
      var maxMoment = moment.max(moment(), trainTime);
      var tMinutes;
      var tArrival;
      
      //If the first train is later than the current time, sent arrival to the first train time
      if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
      } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the currrent time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
      }
        console.log("tMinutes:", tMinutes);
        console.log("tArrival:", tArrival);

        // Add each train's data into the table
        $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
          tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
      });

    // Assume the following situations.

    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? ( Let's use our brains first)
    // It would be 3:18 -- 2 minutes away

    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Let's use our brains first)
    // It would be 3:21 -- 5 minutes away


    // ==========================================================

    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18

    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21