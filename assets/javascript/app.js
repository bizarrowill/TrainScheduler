var config = {
  apiKey: "AIzaSyBpj78TUXM4dHQ60BxLpeB8VHcTsdwNQRc",
  authDomain: "project-1-c63b2.firebaseapp.com",
  databaseURL: "https://project-1-c63b2.firebaseio.com",
  projectId: "project-1-c63b2",
  storageBucket: "project-1-c63b2.appspot.com",
  messagingSenderId: "9690953747"
};

firebase.initializeApp(config);
var database = firebase.database();

database.ref("trains").on("child_added", function(snapshot)
{
appendTrain(snapshot.val().name, snapshot.val().destination, snapshot.val().start, snapshot.val().frequency);
}, function(errorObject)
{
console.log("The read failed: " + errorObject.code);
});

function appendTrain(name, destination, start, frequency)
{
$("table").on("click", function() {
  
}
)

console.log("name " + name);
console.log("destination " + destination);
console.log("start " + start);
console.log("frequency " + frequency);
}

function pushTrain(name, destination, start, frequency) 
{
  database.ref("Trains").push({
      name: name,
      destination: destination,
      start: start,//dd/mm/yy
      frequency: frequency
  });
}

$("button").on("click", function(){
event.preventDefault();
pushTrain($("#name").val(), $("#destination").val(), $("#trainTime").val(), $("#pwd").val());
});

window.onload = function()
{
pushTrain("me", "other", "5/9/16", 500);
}


